// Web Audio: one playback context, a Karplus-Strong guitar/bass, and a small jazz kit.
let ctx = null, out = null, verb = null, wet = null, bus = null;
const voices = new Set();

export const midiFreq = (m, a4 = 440) => a4 * Math.pow(2, (m - 69) / 12);

function impulse(sec) {
  const r = ctx.sampleRate, len = Math.floor(r * sec), b = ctx.createBuffer(2, len, r);
  for (let ch = 0; ch < 2; ch++) {
    const d = b.getChannelData(ch);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.5);
  }
  return b;
}

function build() {
  ctx = new (window.AudioContext || window.webkitAudioContext)();
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -14; comp.ratio.value = 3; comp.attack.value = 0.003; comp.release.value = 0.15;
  out = ctx.createGain(); out.gain.value = 0.9;
  out.connect(comp); comp.connect(ctx.destination);
  verb = ctx.createConvolver(); verb.buffer = impulse(1.8);
  wet = ctx.createGain(); wet.gain.value = 0.16;
  wet.connect(verb); verb.connect(comp);
  // guitar body: warm archtop-ish EQ
  bus = ctx.createBiquadFilter(); bus.type = 'lowpass'; bus.frequency.value = 3600; bus.Q.value = 0.5;
  const body = ctx.createBiquadFilter(); body.type = 'peaking'; body.frequency.value = 220; body.gain.value = 3; body.Q.value = 1;
  bus.connect(body); body.connect(out); body.connect(wet);
  ksCache.clear(); voices.clear(); noiseBuf = null;
}

export function audio() {
  if (!ctx || ctx.state === 'closed') build();
  if (ctx.state !== 'running') ctx.resume().catch(() => {});
  return ctx;
}
export const now = () => audio().currentTime;

// iOS audio session: 'playback' plays through the silent switch; the mic needs 'play-and-record'.
let recording = false;
function setSession(type) { try { if (navigator.audioSession) navigator.audioSession.type = type; } catch {} }
export function micSession(on) { recording = on; setSession(on ? 'play-and-record' : 'playback'); }

// iPhone can leave web audio "interrupted" after the lock screen: resume, or rebuild.
let reviving = false;
export function revive() {
  if (!recording) setSession('playback');
  if (!ctx || reviving || ctx.state === 'running') return;
  reviving = true;
  ctx.resume().catch(() => {});
  setTimeout(() => {
    reviving = false;
    if (ctx && ctx.state !== 'running') { try { ctx.close(); } catch {} ctx = null; build(); ctx.resume().catch(() => {}); }
  }, 250);
}
window.addEventListener('pointerdown', revive, { capture: true });
document.addEventListener('visibilitychange', () => { if (!document.hidden) revive(); });

// ---- Karplus-Strong plucked string ------------------------------------------------------
// Each pitch is rendered once into a buffer; playbackRate trims it to the exact frequency,
// which also lets slides and bends glide.
const ksCache = new Map();
function ksBuffer(midi, kind) {
  const key = kind + midi;
  if (ksCache.has(key)) return ksCache.get(key);
  const sr = ctx.sampleRate, f = midiFreq(midi);
  const N = Math.max(2, Math.round(sr / f - 0.5));
  const bass = kind === 'b';
  const secs = bass ? 1.6 : 2.6;
  const len = Math.floor(sr * secs), y = new Float32Array(len);
  // excitation: smoothed noise with a pick-position comb (darker for bass / thumb)
  const ex = new Float32Array(N);
  let s = 0; const sm = bass ? 0.75 : 0.45;
  for (let i = 0; i < N; i++) { s = s * sm + (Math.random() * 2 - 1) * (1 - sm); ex[i] = s; }
  const pp = Math.max(1, Math.round(N * (bass ? 0.3 : 0.18)));
  for (let i = 0; i < N; i++) y[i] = ex[i] - 0.6 * ex[(i + pp) % N];
  let mx = 0; for (let i = 0; i < N; i++) mx = Math.max(mx, Math.abs(y[i]));
  for (let i = 0; i < N; i++) y[i] /= mx || 1;
  // loss: decay per period so low and high notes ring for a similar time
  const t60 = bass ? 1.1 : (midi < 55 ? 2.4 : midi < 67 ? 1.8 : 1.3);
  const rho = Math.pow(0.001, 1 / (f * t60));
  const S = bass ? 0.62 : 0.5;
  for (let n = N; n < len; n++) y[n] = rho * ((1 - S) * y[n - N] + S * y[n - N - 1 < 0 ? 0 : n - N - 1]);
  // pitch of this loop is sr / (N + S); correct with playbackRate
  const actual = sr / (N + S);
  const b = ctx.createBuffer(1, len, sr); b.copyToChannel ? b.copyToChannel(y, 0) : b.getChannelData(0).set(y);
  const r = { buf: b, rate: f / actual, secs };
  ksCache.set(key, r);
  return r;
}

// Pluck one string. t = context time. glideFrom = midi to slide from (slides/bends).
export function pluck(midi, t, { vel = 0.7, len = 2, kind = 'g', glideFrom = null, glideTime = 0.06, bendTo = null, bendFrom = null, vibrato = false, dest = null, cents = 0 } = {}) {
  const c = audio();
  const k0 = ksBuffer(midi, kind);
  const k = cents ? { ...k0, rate: k0.rate * Math.pow(2, cents / 1200) } : k0;
  const src = c.createBufferSource(); src.buffer = k.buf;
  if (glideFrom != null) {
    src.playbackRate.setValueAtTime(k.rate * Math.pow(2, (glideFrom - midi) / 12), t);
    src.playbackRate.linearRampToValueAtTime(k.rate, t + glideTime);
  } else src.playbackRate.setValueAtTime(k.rate, t);
  if (bendTo != null) {
    src.playbackRate.setValueAtTime(k.rate, t + 0.05);
    src.playbackRate.linearRampToValueAtTime(k.rate * Math.pow(2, (bendTo - midi) / 12), t + 0.05 + Math.min(0.25, len * 0.4));
  }
  // released bend: starts bent, falls back to the fretted pitch
  if (bendFrom != null) {
    const hold = Math.min(0.12, len * 0.3);
    src.playbackRate.setValueAtTime(k.rate * Math.pow(2, (bendFrom - midi) / 12), t);
    src.playbackRate.setValueAtTime(k.rate * Math.pow(2, (bendFrom - midi) / 12), t + hold);
    src.playbackRate.linearRampToValueAtTime(k.rate, t + hold + Math.min(0.22, len * 0.5));
  }
  // wide blues vibrato: an LFO on the playback rate that fades in once the note settles
  if (vibrato && len > 0.3) {
    const top = bendTo != null ? bendTo : midi;
    const lfo = c.createOscillator(), dg = c.createGain();
    lfo.frequency.value = 5.6;
    const depth = k.rate * Math.pow(2, (top - midi) / 12) * (Math.pow(2, 0.35 / 12) - 1);
    const t0 = t + (bendTo != null ? 0.05 + Math.min(0.25, len * 0.4) : 0.12);
    dg.gain.setValueAtTime(0, t); dg.gain.setValueAtTime(0, t0); dg.gain.linearRampToValueAtTime(depth, t0 + 0.25);
    lfo.connect(dg); dg.connect(src.playbackRate);
    lfo.start(t); lfo.stop(t + len + 0.1);
  }
  const g = c.createGain();
  const amp = vel * (kind === 'b' ? 0.95 : 0.55);
  g.gain.setValueAtTime(amp, t);
  const end = t + Math.min(len, k.secs - 0.05);
  g.gain.setValueAtTime(amp, Math.max(t, end - 0.04));
  g.gain.linearRampToValueAtTime(0.0001, end);
  src.connect(g);
  if (kind === 'b') {
    const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 900;
    g.connect(lp); lp.connect(dest || out);
  } else g.connect(dest || bus);
  src.start(t); src.stop(end + 0.02);
  const v = { g, end }; voices.add(v); src.onended = () => voices.delete(v);
  return v;
}

// Strum a chord: notes low→high (down) or high→low (up), lightly staggered.
export function strum(midis, t, { vel = 0.5, len = 0.3, up = false, spread = 0.012 } = {}) {
  const list = up ? [...midis].reverse() : midis;
  list.forEach((m, i) => pluck(m, t + i * spread, { vel: vel * (up ? 0.75 : 1) * (1 - i * 0.04), len }));
}

export function stopAll() {
  if (!ctx) return;
  const t = ctx.currentTime;
  voices.forEach(v => { v.g.gain.cancelScheduledValues(t); v.g.gain.setTargetAtTime(0.0001, t, 0.03); });
  voices.clear();
}

// ---- percussion ------------------------------------------------------------------------
let noiseBuf = null;
function noise() {
  if (noiseBuf) return noiseBuf;
  const len = ctx.sampleRate; noiseBuf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = noiseBuf.getChannelData(0); for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  return noiseBuf;
}
function env(g, t, a, peak, dec) {
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + a);
  g.gain.exponentialRampToValueAtTime(0.0001, t + a + dec);
}

// Metronome voices. level: 2 = downbeat accent, 1 = beat, 0.5 = subdivision.
export function click(t, level = 1, sound = 'click') {
  const c = audio();
  if (sound === 'kit') return level >= 1 ? ride(t, level >= 2 ? 0.9 : 0.7) : ride(t, 0.45);
  const o = c.createOscillator(), g = c.createGain();
  if (sound === 'wood') {
    o.type = 'triangle'; o.frequency.setValueAtTime(level >= 2 ? 1250 : level >= 1 ? 950 : 800, t);
    o.frequency.exponentialRampToValueAtTime(level >= 2 ? 900 : 700, t + 0.03);
    env(g, t, 0.001, level >= 2 ? 0.7 : level >= 1 ? 0.45 : 0.2, 0.06);
  } else if (sound === 'beep') {
    o.type = 'sine'; o.frequency.value = level >= 2 ? 1760 : level >= 1 ? 1320 : 990;
    env(g, t, 0.002, level >= 2 ? 0.5 : level >= 1 ? 0.32 : 0.14, 0.09);
  } else {
    o.type = 'square'; o.frequency.value = level >= 2 ? 2400 : level >= 1 ? 1700 : 1300;
    env(g, t, 0.0005, level >= 2 ? 0.32 : level >= 1 ? 0.2 : 0.08, 0.025);
  }
  o.connect(g); g.connect(out); o.start(t); o.stop(t + 0.15);
}

// Ride cymbal: inharmonic square partials through a high band-pass (the classic analog recipe).
export function ride(t, vel = 0.7) {
  const c = audio();
  const g = c.createGain(), hp = c.createBiquadFilter(), bp = c.createBiquadFilter();
  hp.type = 'highpass'; hp.frequency.value = 5200;
  bp.type = 'bandpass'; bp.frequency.value = 8800; bp.Q.value = 0.6;
  [263, 400, 421, 474, 587, 845].forEach(f => {
    const o = c.createOscillator(); o.type = 'square'; o.frequency.value = f * 1.9;
    o.connect(bp); o.start(t); o.stop(t + 1.2);
  });
  bp.connect(hp); hp.connect(g);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.09 * vel, t + 0.002);
  g.gain.exponentialRampToValueAtTime(0.025 * vel, t + 0.08);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 1.1);
  g.connect(out); g.connect(wet);
}

// Foot hi-hat "chick" on 2 and 4.
export function hat(t, vel = 0.6) {
  const c = audio();
  const s = c.createBufferSource(); s.buffer = noise();
  const hp = c.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 6500;
  const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 9000; bp.Q.value = 1.2;
  const g = c.createGain(); env(g, t, 0.003, 0.35 * vel, 0.045);
  s.connect(hp); hp.connect(bp); bp.connect(g); g.connect(out);
  s.start(t, Math.random() * 0.5); s.stop(t + 0.1);
}

// Brush swish, for the soft kit.
export function brush(t, vel = 0.5, dur = 0.18) {
  const c = audio();
  const s = c.createBufferSource(); s.buffer = noise();
  const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 3200; bp.Q.value = 0.5;
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.12 * vel, t + dur * 0.4);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  s.connect(bp); bp.connect(g); g.connect(out);
  s.start(t, Math.random() * 0.5); s.stop(t + dur + 0.02);
}

// Backbeat snare: band-passed noise over a short pitched body.
export function snare(t, vel = 0.6) {
  const c = audio();
  const s = c.createBufferSource(); s.buffer = noise();
  const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 2400; bp.Q.value = 0.7;
  const g = c.createGain(); env(g, t, 0.002, 0.32 * vel, 0.16);
  s.connect(bp); bp.connect(g); g.connect(out); g.connect(wet);
  s.start(t, Math.random() * 0.5); s.stop(t + 0.22);
  const o = c.createOscillator(), og = c.createGain();
  o.type = 'triangle'; o.frequency.setValueAtTime(220, t); o.frequency.exponentialRampToValueAtTime(160, t + 0.05);
  env(og, t, 0.001, 0.22 * vel, 0.07);
  o.connect(og); og.connect(out); o.start(t); o.stop(t + 0.12);
}

// Soft feathered kick.
export function kick(t, vel = 0.5) {
  const c = audio();
  const o = c.createOscillator(), g = c.createGain();
  o.type = 'sine'; o.frequency.setValueAtTime(110, t); o.frequency.exponentialRampToValueAtTime(48, t + 0.08);
  env(g, t, 0.002, 0.5 * vel, 0.16);
  o.connect(g); g.connect(out); o.start(t); o.stop(t + 0.25);
}

// ---- sustained reference tone (tuner, "by ear" mode) -----------------------------------
let drone = null;
export function startDrone(freq, timbre = 'tone') {
  const c = audio(); stopDrone();
  const t = c.currentTime + 0.01;
  const g = c.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.16, t + 0.05);
  const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = Math.min(6000, freq * 8);
  const parts = (timbre === 'pure' ? [[1, 1]] : [[1, 1], [2, 0.5], [3, 0.28], [4, 0.14], [5, 0.07]]).map(([h, a]) => {
    const o = c.createOscillator(), og = c.createGain(); o.type = 'sine'; o.frequency.value = freq * h; og.gain.value = a;
    o.connect(og); og.connect(lp); o.start(t); return o;
  });
  lp.connect(g); g.connect(out);
  drone = { g, parts, freq };
}
export function stopDrone() {
  if (!drone || !ctx) return;
  const t = ctx.currentTime, d = drone; drone = null;
  d.g.gain.cancelScheduledValues(t); d.g.gain.setValueAtTime(d.g.gain.value, t);
  d.g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
  d.parts.forEach(o => o.stop(t + 0.15));
}
export const droneOn = () => !!drone;

// Keep the screen awake while something is playing.
let lock = null;
export async function wake(on) {
  try {
    if (on && !lock && navigator.wakeLock) { lock = await navigator.wakeLock.request('screen'); lock.addEventListener('release', () => { lock = null; }); }
    else if (!on && lock) { await lock.release(); lock = null; }
  } catch {}
}
