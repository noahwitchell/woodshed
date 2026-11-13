// Loop player engine: plays part of a decoded recording, slowed down or sped up without
// changing pitch (WSOLA in a worker), optionally transposed, looping seamlessly with an
// optional gap between repeats.
//
// The track is cut into chunks on a fixed grid. Each chunk is stretched once, cached, and
// scheduled back-to-back on the audio clock with a short crossfade, so loops are sample-exact.
import { audio } from './audio.js';

const CHUNK = 6;      // seconds of source per chunk
const XF = 0.04;      // crossfade between chunks (real seconds)
const EDGE = 0.004;   // tiny fade at loop edges so the cut doesn't click

export const L = {
  buf: null,                       // AudioBuffer (always 2 channels)
  a: 0, b: 0, loop: true, cursor: 0,
  speed: 1, semis: 0, cents: 0, gap: 0, chan: 'stereo',
  trainer: false, trainerStep: 0.05,
  playing: false, passes: 0,
  onState: () => {},               // UI callback (play/stop, pass count, speed changes)
};

const ratio = () => Math.pow(2, (L.semis * 100 + L.cents) / 1200);

// ---- stretching ------------------------------------------------------------------------
let worker = null, reqId = 0;
const waiting = new Map();
function stretch(chans, speed, sr) {
  if (!worker) {
    worker = new Worker('js/stretch-worker.js');
    worker.onmessage = e => { const r = waiting.get(e.data.id); waiting.delete(e.data.id); r && r(e.data.chans); };
  }
  return new Promise(res => { const id = ++reqId; waiting.set(id, res); worker.postMessage({ id, chans, speed, sr }, chans.map(c => c.buffer)); });
}

let cache = new Map();
export function clearCache() { cache = new Map(); }

// One chunk: source range [lo + k*CHUNK, ...] of a pass over [lo, hi].
function chunkInfo(lo, hi, k) {
  const a = lo + k * CHUNK, b = Math.min(hi, a + CHUNK);
  return { a, b, last: b >= hi - 1e-6 };
}
const nChunks = (lo, hi) => Math.max(1, Math.ceil((hi - lo) / CHUNK - 1e-9));

function getChunk(lo, hi, k, speed, r) {
  const sEff = speed / r;
  const key = `${lo.toFixed(4)}|${hi.toFixed(4)}|${k}|${sEff.toFixed(5)}|${r.toFixed(5)}`;
  let c = cache.get(key);
  if (c) return c;
  if (cache.size > 60) cache.clear();
  const { a, b, last } = chunkInfo(lo, hi, k);
  const buf = L.buf, sr = buf.sampleRate;
  const inEnd = last ? b : Math.min(hi, b + XF * speed);       // overlap into the next chunk for the crossfade
  const i0 = Math.max(0, Math.round(a * sr)), i1 = Math.min(buf.length, Math.round(inEnd * sr));
  const src = [0, 1].map(ch => buf.getChannelData(ch).slice(i0, Math.max(i0 + 1, i1)));
  c = { a, b, last, ready: false, ab: null };
  const bake = chans => {
    const ctx = audio();
    const len = chans[0].length;
    // fades in buffer samples (buffer plays at rate r)
    const fin = Math.round((k > 0 ? XF : EDGE) * sr * r), fout = Math.round((last ? EDGE : XF) * sr * r);
    for (const d of chans) {
      for (let i = 0; i < Math.min(fin, len); i++) d[i] *= i / fin;
      for (let i = 0; i < Math.min(fout, len); i++) d[len - 1 - i] *= i / fout;
    }
    const ab = ctx.createBuffer(2, len, sr);
    chans.forEach((d, ch) => ab.copyToChannel(d, ch));
    c.ab = ab; c.ready = true;
    return c;
  };
  c.p = Math.abs(sEff - 1) < 1e-4 ? Promise.resolve(bake(src)) : stretch(src, sEff, sr).then(bake);
  cache.set(key, c);
  return c;
}

// ---- output routing: stereo / left / right / mono / no centre ---------------------------
let route = null;
const MATRIX = { stereo: [1, 0, 0, 1], left: [1, 0, 1, 0], right: [0, 1, 0, 1], mono: [0.5, 0.5, 0.5, 0.5], side: [0.8, -0.8, 0.8, -0.8] };
function output() {
  const ctx = audio();
  if (route && route.ctx === ctx) return route;
  const input = ctx.createGain(), split = ctx.createChannelSplitter(2), merge = ctx.createChannelMerger(2);
  input.connect(split);
  const g = [0, 1, 2, 3].map(() => ctx.createGain());
  // g0: L->L, g1: R->L, g2: L->R, g3: R->R
  split.connect(g[0], 0); split.connect(g[1], 1); split.connect(g[2], 0); split.connect(g[3], 1);
  g[0].connect(merge, 0, 0); g[1].connect(merge, 0, 0); g[2].connect(merge, 0, 1); g[3].connect(merge, 0, 1);
  merge.connect(ctx.destination);
  route = { ctx, input, g };
  setChannels(L.chan);
  return route;
}
export function setChannels(mode) {
  L.chan = mode;
  if (!route) return;
  MATRIX[mode].forEach((v, i) => route.g[i].gain.setTargetAtTime(v, route.ctx.currentTime, 0.01));
}

// ---- scheduling --------------------------------------------------------------------------
let timer = 0, live = [], pieces = [];
let pass = null;       // { lo, hi, k, t0 (clock time of source position lo), speed, r, end }

function newPass(lo, hi, from, t, speed) {
  // t = clock time at which `from` should sound
  const r = ratio();
  const k = Math.min(nChunks(lo, hi) - 1, Math.floor((from - lo) / CHUNK + 1e-9));
  return { lo, hi, k, from, t0: t - (from - lo) / speed, speed, r };
}

function range() { return L.loop ? [L.a, L.b] : [0, L.buf.duration]; }

function tick() {
  if (!L.playing || !pass || pass.done) return;
  const ctx = audio(), now = ctx.currentTime;
  for (let guard = 0; guard < 8; guard++) {
    const { lo, hi, k, speed, r } = pass;
    const info = chunkInfo(lo, hi, k);
    const start = pass.t0 + (info.a - lo) / speed;            // when this chunk's first sample sounds
    if (start > now + 1.2) break;                              // far enough ahead
    const c = getChunk(lo, hi, k, speed, r);
    // look ahead: get the next chunk rendering too
    if (!info.last) getChunk(lo, hi, k + 1, speed, r);
    else if (L.loop) getChunk(L.a, L.b, 0, nextSpeed(), ratio());
    if (!c.ready) {
      // not stretched yet: if we're about to miss it, push the whole pass later
      if (start < now + 0.05) pass.t0 += now + 0.08 - start;
      break;
    }
    // offset into the first chunk when starting mid-chunk
    let when = start, offset = 0;
    if (pass.from > info.a + 1e-4) {
      offset = (pass.from - info.a) / (speed / r) / 1;           // buffer seconds (buffer time = source / sEff)
      when = pass.t0 + (pass.from - lo) / speed;
    }
    if (when < now) { offset += (now - when) * r; when = now; }
    const src = ctx.createBufferSource();
    src.buffer = c.ab; src.playbackRate.value = r;
    const g = ctx.createGain();
    src.connect(g); g.connect(output().input);
    if (offset > 0) { g.gain.setValueAtTime(0, when); g.gain.linearRampToValueAtTime(1, when + 0.006); }
    src.start(when, Math.max(0, offset));
    const node = { src, g, end: when + (c.ab.duration - offset) / r };
    live.push(node);
    src.onended = () => { live = live.filter(x => x !== node); };
    const srcStart = Math.max(pass.from, info.a);
    pieces.push({ t0: when, t1: node.end - (info.last ? 0 : XF), s0: srcStart, s1: info.b, speed });
    if (pieces.length > 40) pieces.splice(0, pieces.length - 40);
    pass.from = 0;
    if (!info.last) { pass.k++; continue; }
    // end of the pass
    const passEnd = pass.t0 + (hi - lo) / speed;
    if (!L.loop) { pass.done = true; scheduleStopAt(passEnd); return; }
    L.passes++;
    const sp = nextSpeed();
    if (sp !== L.speed) { L.speed = sp; L.onState('speed'); }
    pass = newPass(L.a, L.b, L.a, passEnd + L.gap, L.speed);
    L.onState('pass');
  }
}
const nextSpeed = () => (L.trainer && L.loop ? Math.min(1, Math.round((L.speed + L.trainerStep) * 100) / 100) : L.speed);

let stopAt = 0;
function scheduleStopAt(t) {
  clearInterval(stopAt);
  stopAt = setInterval(() => { if (audio().currentTime >= t) { clearInterval(stopAt); stop(); L.onState('ended'); } }, 100);
}

export function play(from) {
  if (!L.buf) return;
  stopSources();
  const ctx = audio();
  const [lo, hi] = range();
  if (from == null || from < lo || from >= hi - 0.05) from = lo;
  pieces = [];
  pass = newPass(lo, hi, from, ctx.currentTime + 0.1, L.speed);
  L.playing = true;
  clearInterval(timer); clearInterval(stopAt);
  timer = setInterval(tick, 40);
  tick();
  L.onState('play');
}

function stopSources() {
  const ctx = audio(), t = ctx.currentTime;
  for (const n of live) { try { n.g.gain.cancelScheduledValues(t); n.g.gain.setValueAtTime(n.g.gain.value, t); n.g.gain.linearRampToValueAtTime(0, t + 0.015); n.src.stop(t + 0.02); } catch {} }
  live = [];
}
export function stop() {
  stopSources();
  clearInterval(timer); clearInterval(stopAt);
  pass = null; L.playing = false;
  L.onState('stop');
}

// Restart from where we are now (after a speed / pitch / range change).
export function relaunch() {
  if (!L.playing) return;
  const p = position();
  play(p);
}

// Where in the source we are right now (seconds), or null.
export function position() {
  if (!L.playing || !pieces.length) return null;
  const now = audio().currentTime;
  let cur = null;
  for (const p of pieces) if (p.t0 <= now) cur = p;
  if (!cur) return pieces[0].s0;
  return Math.min(cur.s1, cur.s0 + Math.max(0, now - cur.t0) * cur.speed);
}

export function load(buffer) {
  stop(); clearCache();
  // always 2 channels so left/right/no-centre routing works on mono files too
  if (buffer.numberOfChannels === 1) {
    const two = audio().createBuffer(2, buffer.length, buffer.sampleRate);
    two.copyToChannel(buffer.getChannelData(0), 0); two.copyToChannel(buffer.getChannelData(0), 1);
    buffer = two;
  }
  L.buf = buffer;
  return buffer;
}

// Waveform peaks: max |sample| per block, for quick drawing of long files.
export const BLOCK = 256;
export function peaks(buffer) {
  const l = buffer.getChannelData(0), r = buffer.getChannelData(1), n = Math.ceil(buffer.length / BLOCK);
  const p = new Float32Array(n);
  for (let k = 0; k < n; k++) {
    let m = 0; const e = Math.min(buffer.length, (k + 1) * BLOCK);
    for (let i = k * BLOCK; i < e; i++) { const v = Math.abs(l[i]) + Math.abs(r[i]); if (v > m) m = v; }
    p[k] = m * 0.5;
  }
  return p;
}
