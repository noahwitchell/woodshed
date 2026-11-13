// Loop: open or record a track, mark a section (in / out), and loop it, slowed down without
// changing pitch. Tracks and their saved sections live in IndexedDB (js/loopdb.js).
import { h, icon, seg, stepper, toggle } from '../ui.js';
import { audio, micSession } from '../audio.js';
import { getMicStream } from '../pitch.js';
import { T } from '../clock.js';
import * as E from '../looper.js';
import * as DB from '../loopdb.js';

const { L } = E;
const MIN_LOOP = 0.1;
let el, track = null, pk = null, zoom = 'all', rec = null, status = '';
let ui = {};            // live elements of the player screen
let raf = 0;

const fmt = s => { s = Math.max(0, s || 0); const m = Math.floor(s / 60); return `${m}:${(s - m * 60).toFixed(2).padStart(5, '0')}`; };
const fmtS = s => { s = Math.max(0, Math.round(s || 0)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };
const decode = ab => new Promise((res, rej) => { const p = audio().decodeAudioData(ab, res, rej); if (p && p.then) p.then(res, rej); });

// ---- library --------------------------------------------------------------------------
async function paintLib() {
  track = null; ui = {};
  const tracks = await DB.listTracks().catch(() => []);
  if (track) return;                                  // opened something meanwhile
  const file = h('input', { type: 'file', accept: 'audio/*,video/mp4,video/quicktime,.m4a,.mp3,.wav,.aif,.aiff,.aac,.flac', hidden: true,
    onchange: e => { importFile(e.target.files[0]); e.target.value = ''; } });
  el.replaceChildren(...[
    h('p', { class: 'about' }, 'Learn a part from a recording. Open a song or record one, mark the section you are learning, and loop it. Slow it down as far as you like: the pitch stays put.'),
    h('div', { class: 'loop-add' },
      h('button', { class: 'btn primary', onclick: () => file.click() }, icon('folder'), 'Open audio file'),
      h('button', { class: 'btn' + (rec ? ' rec-on' : ''), onclick: () => (rec ? stopRec() : startRec()) }, icon(rec ? 'stop' : 'mic'), rec ? 'Stop' : 'Record'),
      file),
    rec ? h('div', { class: 'rec-panel' }, h('span', { class: 'rec-dot' }), h('b', { class: 'rec-time' }, '0:00'), h('div', { class: 'rec-meter' }, h('i'))) : null,
    status ? h('p', { class: 'hint center' }, status) : null,
    h('h2', {}, 'Your tracks'),
    tracks.length
      ? h('div', { class: 'tracks' }, ...tracks.map(t => h('div', { class: 'trk' },
          h('button', { class: 'trk-body', onclick: () => openTrack(t) },
            h('b', {}, t.name),
            h('span', {}, [fmtS(t.dur), t.sections?.length ? `${t.sections.length} section${t.sections.length > 1 ? 's' : ''}` : null].filter(Boolean).join(' · '))),
          h('button', { class: 'icon-btn', title: 'Delete', onclick: async () => { if (confirm(`Delete “${t.name}” from Woodshed?`)) { await DB.deleteTrack(t.id); paintLib(); } } }, icon('trash')))))
      : h('p', { class: 'hint' }, 'Nothing here yet. Files stay on this phone: open one from the Files app (MP3, M4A, WAV and most voice memos), or tap Record and hold the phone up to a speaker.'),
  ].filter(Boolean));
}

function setStatus(s) { status = s; if (!track) paintLib(); }

async function importFile(f) {
  if (!f) return;
  setStatus('Opening…');
  try {
    const buf = await decode(await f.arrayBuffer());
    const meta = await DB.addTrack(f.name.replace(/\.[^.]+$/, ''), new Blob([f], { type: f.type }), buf.duration);
    status = '';
    openTrack(meta, buf);
  } catch (e) {
    setStatus('Couldn’t read that file. MP3, M4A, WAV and AIFF work best.');
  }
}

// ---- recording -------------------------------------------------------------------------
async function startRec() {
  if (T.playing) T.stop();
  E.stop();
  let stream;
  try { stream = await getMicStream(); }
  catch { setStatus('The microphone is blocked. Allow it for this app in Settings, then try again.'); return; }
  const mime = ['audio/mp4', 'audio/webm;codecs=opus', 'audio/webm'].find(t => window.MediaRecorder?.isTypeSupported?.(t)) || '';
  let mr;
  try { mr = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined); }
  catch { stream.getTracks().forEach(t => t.stop()); micSession(false); setStatus('Recording isn’t supported in this browser.'); return; }
  const parts = [];
  mr.ondataavailable = e => { if (e.data && e.data.size) parts.push(e.data); };
  // level meter on its own context (iOS rebuilds the playback one around mic use)
  const mctx = new (window.AudioContext || window.webkitAudioContext)();
  mctx.resume().catch(() => {});
  const an = mctx.createAnalyser(); an.fftSize = 1024;
  const sink = mctx.createGain(); sink.gain.value = 0;
  mctx.createMediaStreamSource(stream).connect(an); an.connect(sink); sink.connect(mctx.destination);
  rec = { mr, stream, mctx, an, t0: performance.now(), data: new Float32Array(an.fftSize) };
  mr.onstop = async () => {
    const r = rec; rec = null;
    r.stream.getTracks().forEach(t => t.stop());
    try { r.mctx.close(); } catch {}
    micSession(false);
    const blob = new Blob(parts, { type: mr.mimeType || mime || 'audio/mp4' });
    if (!blob.size) { setStatus('Nothing was recorded.'); return; }
    setStatus('Saving…');
    try {
      const buf = await decode(await blob.arrayBuffer());
      const d = new Date();
      const name = `Recording ${d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} ${d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}`;
      const meta = await DB.addTrack(name, blob, buf.duration);
      status = '';
      openTrack(meta, buf);
    } catch { setStatus('Couldn’t read the recording back. Try again.'); }
  };
  mr.start(1000);
  status = '';
  paintLib();
  const meter = () => {
    if (!rec) return;
    rec.an.getFloatTimeDomainData(rec.data);
    let m = 0; for (const v of rec.data) m = Math.max(m, Math.abs(v));
    const bar = el.querySelector('.rec-meter i'), tm = el.querySelector('.rec-time');
    if (bar) bar.style.width = `${Math.min(100, Math.sqrt(m) * 100)}%`;
    if (tm) tm.textContent = fmtS((performance.now() - rec.t0) / 1000);
    requestAnimationFrame(meter);
  };
  meter();
}
function stopRec() { if (rec && rec.mr.state !== 'inactive') rec.mr.stop(); }

// ---- player ----------------------------------------------------------------------------
async function openTrack(meta, buf) {
  if (T.playing) T.stop();
  track = meta;
  el.replaceChildren(h('p', { class: 'hint center' }, 'Loading…'));
  try {
    if (!buf) buf = await decode(await (await DB.getBlob(meta.id)).arrayBuffer());
  } catch { track = null; setStatus('Couldn’t open that track.'); return; }
  E.load(buf);
  pk = E.peaks(L.buf);
  const s = meta.state || {}, dur = L.buf.duration;
  L.a = Math.min(s.a ?? 0, dur - MIN_LOOP); L.b = Math.min(s.b ?? dur, dur);
  if (L.b - L.a < MIN_LOOP) { L.a = 0; L.b = dur; }
  L.loop = s.loop ?? false; L.speed = s.speed ?? 1; L.semis = s.semis ?? 0; L.cents = s.cents ?? 0;
  L.gap = s.gap ?? 0; L.trainer = s.trainer ?? false; L.cursor = s.cursor ?? 0; L.passes = 0;
  E.setChannels(s.chan || 'stereo');
  E.setBoost(s.boost ?? E.autoBoost(pk));
  zoom = L.loop && (L.a > 0 || L.b < dur) ? 'loop' : 'all';
  meta.opened = Date.now(); DB.putMeta(meta).catch(() => {});
  paintPlayer();
}

let saveT = 0;
function saveState() {
  if (!track) return;
  clearTimeout(saveT);
  saveT = setTimeout(() => {
    track.state = { a: L.a, b: L.b, loop: L.loop, speed: L.speed, semis: L.semis, cents: L.cents, gap: L.gap, chan: L.chan, boost: L.boost, trainer: L.trainer, cursor: L.cursor };
    DB.putMeta(track).catch(() => {});
  }, 300);
}

let relT = 0;
function relaunchSoon(ms = 220) { clearTimeout(relT); relT = setTimeout(() => E.relaunch(), ms); }

function viewRange() {
  const dur = L.buf.duration;
  if (zoom === 'all') return [0, dur];
  const pad = Math.max(0.3, (L.b - L.a) * 0.12);
  return [Math.max(0, L.a - pad), Math.min(dur, L.b + pad)];
}
let view = [0, 1];

function drawWave() {
  const cv = ui.cv; if (!cv) return;
  const W = cv.clientWidth, H = cv.clientHeight, dpr = window.devicePixelRatio || 1;
  if (!W) return;
  cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
  const g = cv.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0);
  g.clearRect(0, 0, W, H);
  const [v0, v1] = view, sr = L.buf.sampleRate, n = L.buf.length;
  const l = L.buf.getChannelData(0), r = L.buf.getChannelData(1);
  const vals = new Float32Array(W);
  let mx = 0.05;
  for (let x = 0; x < W; x++) {
    const i0 = Math.floor((v0 + (x / W) * (v1 - v0)) * sr), i1 = Math.max(i0 + 1, Math.floor((v0 + ((x + 1) / W) * (v1 - v0)) * sr));
    let m = 0;
    if (i1 - i0 > E.BLOCK * 2) { for (let k = Math.floor(i0 / E.BLOCK); k < Math.min(pk.length, Math.ceil(i1 / E.BLOCK)); k++) if (pk[k] > m) m = pk[k]; }
    else for (let i = Math.max(0, i0); i < Math.min(n, i1); i++) { const v = (Math.abs(l[i]) + Math.abs(r[i])) * 0.5; if (v > m) m = v; }
    vals[x] = m; if (m > mx) mx = m;
  }
  const mid = H / 2, sc = (H / 2 - 4) / mx;
  const xa = tx(L.a), xb = tx(L.b);
  for (let x = 0; x < W; x++) {
    const hgt = Math.max(1, vals[x] * sc);
    g.fillStyle = L.loop && x >= xa && x <= xb ? '#f0a83a' : '#5d6270';
    g.fillRect(x, mid - hgt, 1, hgt * 2);
  }
}
const tx = t => ((t - view[0]) / (view[1] - view[0])) * (ui.cv?.clientWidth || 1);
const tt = x => view[0] + (x / (ui.cv?.clientWidth || 1)) * (view[1] - view[0]);

function placeMarks() {
  if (!ui.cv) return;
  const W = ui.cv.clientWidth;
  const xa = tx(L.a), xb = tx(L.b);
  ui.region.style.left = `${xa}px`; ui.region.style.width = `${Math.max(0, xb - xa)}px`;
  ui.region.classList.toggle('off', !L.loop);
  ui.hA.style.left = `${xa}px`; ui.hB.style.left = `${xb}px`;
  ui.hA.hidden = xa < -12 || xa > W + 12; ui.hB.hidden = xb < -12 || xb > W + 12;
  ui.cur.style.left = `${tx(L.cursor)}px`; ui.cur.hidden = L.loop;
  ui.inS.set(L.a); ui.outS.set(L.b);
  ui.t0.textContent = fmtS(view[0]); ui.t1.textContent = fmtS(view[1]);
  ui.len.textContent = `Loop ${(L.b - L.a).toFixed(2)} s`;
}

function refreshView() { view = viewRange(); drawWave(); placeMarks(); }

function setA(v) { L.a = Math.max(0, Math.min(v, L.b - MIN_LOOP)); afterRange(); }
function setB(v) { L.b = Math.min(L.buf.duration, Math.max(v, L.a + MIN_LOOP)); afterRange(); }
function afterRange(redraw = true) {
  if (redraw) { drawWave(); placeMarks(); }
  saveState();
  if (L.playing && L.loop) relaunchSoon(300);
}

function dragger(elm, onMove, onEnd) {
  elm.addEventListener('pointerdown', e => {
    e.preventDefault(); e.stopPropagation();
    elm.setPointerCapture(e.pointerId);
    const box = ui.cv.getBoundingClientRect(), x0 = e.clientX;
    const move = ev => onMove(ev.clientX - box.left, ev.clientX - x0);
    const up = () => { elm.removeEventListener('pointermove', move); elm.removeEventListener('pointerup', up); elm.removeEventListener('pointercancel', up); onEnd && onEnd(); };
    elm.addEventListener('pointermove', move); elm.addEventListener('pointerup', up); elm.addEventListener('pointercancel', up);
  });
}

function paintPlayer() {
  const dur = L.buf.duration;
  ui = {};
  ui.cv = h('canvas', { class: 'wave-cv' });
  ui.region = h('div', { class: 'wave-region' });
  ui.hA = h('div', { class: 'wave-h in' }, h('span', {}, 'IN'));
  ui.hB = h('div', { class: 'wave-h out' }, h('span', {}, 'OUT'));
  ui.head = h('div', { class: 'wave-head', hidden: true });
  ui.cur = h('div', { class: 'wave-cur' });
  const box = h('div', { class: 'wave' }, ui.cv, ui.region, ui.cur, ui.head, ui.hA, ui.hB);

  // tap the waveform: loop off = play from there; loop on = move the nearer marker there
  box.addEventListener('pointerdown', e => {
    if (e.target !== box && e.target !== ui.cv && e.target !== ui.cur) return;
    const bx = box.getBoundingClientRect(), t = Math.max(0, Math.min(dur, tt(e.clientX - bx.left)));
    if (L.loop) { if (Math.abs(t - L.a) < Math.abs(t - L.b)) setA(t); else setB(t); return; }
    L.cursor = t; placeMarks(); saveState();
    if (L.playing) E.play(t);
  });
  dragger(ui.hA, x => { L.a = Math.max(0, Math.min(tt(x), L.b - MIN_LOOP)); drawWave(); placeMarks(); }, () => afterRange(false));
  dragger(ui.hB, x => { L.b = Math.min(dur, Math.max(tt(x), L.a + MIN_LOOP)); drawWave(); placeMarks(); }, () => afterRange(false));
  let ra = 0, rb = 0;
  ui.region.addEventListener('pointerdown', () => { ra = L.a; rb = L.b; }, { capture: true });
  dragger(ui.region, (x, dx) => {
    if (!L.loop) return;
    const d = (dx / ui.cv.clientWidth) * (view[1] - view[0]);
    const len = rb - ra, a = Math.max(0, Math.min(dur - len, ra + d));
    L.a = a; L.b = a + len; drawWave(); placeMarks();
  }, () => afterRange(false));

  ui.t0 = h('span'); ui.t1 = h('span'); ui.len = h('span', { class: 'wave-len' });
  ui.pos = h('b', { class: 'loop-pos' }, fmt(L.loop ? L.a : L.cursor));
  ui.info = h('span', { class: 'dim small' }, '');

  const nudge = (label, get, set) => stepper({ value: get(), min: 0, max: dur, step: 0.01, fmt, onChange: v => set(Math.round(v * 100) / 100) });
  ui.inS = nudge('In', () => L.a, setA);
  ui.outS = nudge('Out', () => L.b, setB);
  const here = () => E.position() ?? (L.loop ? L.a : L.cursor);
  const setIn = () => {
    const p = here();
    L.a = Math.max(0, Math.min(p, dur - MIN_LOOP));
    if (L.b - L.a < MIN_LOOP) L.b = dur;          // Out was before the new In: open it up to the end
    afterRange();
  };
  const setOut = () => {
    const p = here();
    if (p - L.a < MIN_LOOP) return;
    L.b = p;
    if (!L.loop) { L.loop = true; ui.loopTog.set(true); }
    zoom = 'loop'; ui.zoom.set('loop'); refreshView(); saveState();
    if (L.playing) E.play(L.a);
  };

  ui.play = h('button', { class: 'play-big', onclick: () => {
    if (L.playing) { const p = E.position(); E.stop(); if (!L.loop && p != null) { L.cursor = p; placeMarks(); saveState(); } return; }
    if (T.playing) T.stop();
    E.play(L.loop ? null : L.cursor);
  } }, icon('play'));
  ui.loopTog = toggle('Loop', L.loop, v => {
    L.loop = v;
    if (v && L.a <= 0.001 && L.b >= dur - 0.001) zoom = 'all';
    refreshView(); saveState();
    if (L.playing) E.play(v ? L.a : E.position());
  });
  ui.zoom = seg([['all', 'Whole track'], ['loop', 'Zoom to loop']], zoom, v => { zoom = v; refreshView(); }, 'small');

  const pct = v => `${Math.round(v * 100)}%`;
  ui.speed = stepper({ value: Math.round(L.speed * 100), min: 25, max: 150, step: 5, fmt: v => `${v}%`, onChange: v => { L.speed = v / 100; saveState(); relaunchSoon(); paintInfo(); } });
  const quick = seg([[50, '50%'], [70, '70%'], [85, '85%'], [100, '100%']], Math.round(L.speed * 100), v => { L.speed = v / 100; ui.speed.set(+v); saveState(); relaunchSoon(60); paintInfo(); }, 'small');
  ui.quick = quick;
  ui.boost = stepper({ value: L.boost, min: 0, max: 24, step: 1, fmt: v => `+${v} dB`, onChange: v => { E.setBoost(v); saveState(); } });
  const semis = stepper({ value: L.semis, min: -12, max: 12, step: 1, fmt: v => (v > 0 ? `+${v}` : `${v}`) + ' semis', onChange: v => { L.semis = v; saveState(); relaunchSoon(); } });
  const cents = stepper({ value: L.cents, min: -50, max: 50, step: 5, fmt: v => (v > 0 ? `+${v}` : `${v}`) + ' cents', onChange: v => { L.cents = v; saveState(); relaunchSoon(); } });

  ui.secs = h('div', { class: 'secs' });

  el.replaceChildren(
    h('div', { class: 'ph-head' },
      h('button', { class: 'icon-btn', onclick: () => { E.stop(); paintLib(); } }, icon('back')),
      h('div', { class: 'ph-title' },
        h('b', { class: 'trk-name', onclick: rename }, track.name),
        h('span', { class: 'dim small' }, `${fmtS(dur)} · tap the name to rename`))),
    box,
    h('div', { class: 'wave-axis' }, ui.t0, ui.len, ui.t1),
    h('p', { class: 'hint small wave-hint' }, ''),
    h('div', { class: 'row center' }, ui.zoom),
    h('div', { class: 'loop-transport' },
      h('button', { class: 'icon-btn', title: 'Back to the start', onclick: () => { if (!L.loop) { L.cursor = 0; placeMarks(); saveState(); } if (L.playing) E.play(L.loop ? L.a : 0); } }, icon('rewind')),
      ui.play,
      ui.loopTog),
    h('div', { class: 'center' }, ui.pos, h('br'), ui.info),
    h('div', { class: 'card' },
      h('div', { class: 'field' }, h('label', {}, 'Boost'), ui.boost,
        h('button', { class: 'btn small-btn', onclick: () => { const v = E.autoBoost(pk); E.setBoost(v); ui.boost.set(v); saveState(); } }, 'Auto')),
      h('p', { class: 'hint small' }, 'Turns up quiet recordings past what the phone volume can do. Auto brings the loudest part up to full; a limiter stops it distorting.')),
    h('div', { class: 'card inout' },
      h('div', { class: 'io-row' }, h('label', {}, 'In'), ui.inS, h('button', { class: 'btn small-btn', onclick: setIn }, 'Set')),
      h('div', { class: 'io-row' }, h('label', {}, 'Out'), ui.outS, h('button', { class: 'btn small-btn', onclick: setOut }, 'Set')),
      h('p', { class: 'hint small' }, 'Play it, tap ', h('b', {}, 'Set'), ' for In where the part starts and ', h('b', {}, 'Set'), ' for Out where it ends. Then drag the markers or use − / + to trim (each tap is 1/100 s).')),
    h('div', { class: 'card' },
      h('div', { class: 'field' }, h('label', {}, 'Speed'), ui.speed),
      quick,
      toggle('Speed up 5% each loop (to 100%)', L.trainer, v => { L.trainer = v; saveState(); }),
      h('div', { class: 'field' }, h('label', {}, 'Gap'), seg([[0, 'None'], [1, '1 s'], [2, '2 s'], [4, '4 s']], L.gap, v => { L.gap = +v; saveState(); })),
      h('p', { class: 'hint small' }, 'A gap between repeats gives you a moment to reset your hands.')),
    h('div', { class: 'card' },
      h('div', { class: 'field' }, h('label', {}, 'Key'), semis),
      h('div', { class: 'field' }, h('label', {}, 'Fine'), cents),
      h('p', { class: 'hint small' }, 'Move the recording into a key that suits you, or fine-tune it to your guitar: lots of old records run a little sharp or flat.'),
      h('div', { class: 'field col' }, h('label', {}, 'Hear'),
        seg([['stereo', 'Stereo'], ['left', 'Left'], ['right', 'Right'], ['mono', 'Mono'], ['side', 'No centre']], L.chan, v => { E.setChannels(v); saveState(); }, 'chips')),
      h('p', { class: 'hint small' }, 'Left or Right isolates a guitar panned to one side. No centre removes whatever is in the middle of the mix, often the vocal or lead, so you can play that part yourself.')),
    h('h2', {}, 'Sections'),
    ui.secs,
    h('button', { class: 'btn wide', onclick: saveSection }, 'Save this section'),
  );
  paintSecs(); paintInfo();
  requestAnimationFrame(() => { refreshView(); hintText(); });
  paintTransport();
}

function hintText() {
  const p = el.querySelector('.wave-hint'); if (!p) return;
  p.textContent = L.loop ? 'Drag IN and OUT, or drag the shaded part to move the whole loop. Tap the waveform to move the nearer marker.' : 'Tap the waveform to play from there. Turn on Loop to repeat a section.';
}

function paintInfo() {
  if (!ui.info) return;
  const bits = [];
  if (L.loop && L.playing) bits.push(`repeat ${L.passes + 1}`);
  if (L.speed !== 1) bits.push(`${Math.round(L.speed * 100)}% speed`);
  if (L.semis || L.cents) bits.push('pitch shifted');
  ui.info.textContent = bits.join(' · ') || ' ';
  ui.quick?.set(Math.round(L.speed * 100));
}

function paintTransport() {
  if (!ui.play) return;
  ui.play.classList.toggle('on', L.playing);
  ui.play.replaceChildren(icon(L.playing ? 'stop' : 'play'));
  hintText();
}

function paintSecs() {
  if (!ui.secs) return;
  const list = track.sections || [];
  ui.secs.replaceChildren(...(list.length ? list.map((s, i) => h('div', { class: 'sec' + (Math.abs(s.a - L.a) < 0.005 && Math.abs(s.b - L.b) < 0.005 && L.loop ? ' on' : '') },
    h('button', { class: 'sec-body', onclick: () => {
      L.a = s.a; L.b = s.b; L.loop = true; ui.loopTog.set(true); zoom = 'loop'; ui.zoom.set('loop'); refreshView(); saveState(); paintSecs();
      if (L.playing) E.play(L.a);
    } }, h('b', {}, s.name), h('span', {}, `${fmt(s.a)} – ${fmt(s.b)}`)),
    h('button', { class: 'icon-btn', title: 'Remove', onclick: () => { list.splice(i, 1); saveState(); paintSecs(); } }, icon('trash'))))
    : [h('p', { class: 'hint' }, 'Save sections you are working on (“intro lick”, “bars 9–16”) to jump back to them later.')]));
}

function saveSection() {
  const n = (track.sections ||= []).length + 1;
  const name = prompt('Name this section', `Section ${n}`);
  if (name == null) return;
  track.sections.push({ name: name.trim() || `Section ${n}`, a: L.a, b: L.b });
  if (!L.loop) { L.loop = true; ui.loopTog.set(true); refreshView(); }
  saveState(); paintSecs();
}

function rename() {
  const name = prompt('Rename track', track.name);
  if (!name || !name.trim()) return;
  track.name = name.trim(); saveState();
  el.querySelector('.trk-name').textContent = track.name;
}

function frame() {
  raf = 0;
  if (!ui.head) return;
  const p = E.position();
  if (p != null && L.playing) {
    ui.head.hidden = false;
    ui.head.style.left = `${tx(p)}px`;
    ui.pos.textContent = fmt(p);
  } else {
    ui.head.hidden = true;
    ui.pos.textContent = fmt(L.loop ? L.a : L.cursor);
  }
  if (L.playing) raf = requestAnimationFrame(frame);
}

L.onState = what => {
  if (what === 'speed') { ui.speed?.set(Math.round(L.speed * 100)); saveState(); }
  if (what === 'ended' && track) { /* played to the end with Loop off */ }
  paintTransport(); paintInfo(); paintSecs();
  if (L.playing && !raf) raf = requestAnimationFrame(frame);
  if (!L.playing) frame();
};

export function mount(root) {
  el = h('section', { class: 'view loop' });
  root.append(el);
  paintLib();
  window.addEventListener('resize', () => { if (track && ui.cv) refreshView(); });
  return el;
}
export function show() { if (!track) paintLib(); else if (ui.cv) refreshView(); }
export function hide() { E.stop(); stopRec(); }
export const busy = () => L.playing || !!rec;
