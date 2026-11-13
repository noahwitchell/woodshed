// Metronome: swing feel, accents on 2 & 4, tap tempo, speed trainer, gap trainer.
import { h, seg, stepper, toggle, icon } from '../ui.js';
import { S, save } from '../store.js';
import { T, onTransport } from '../clock.js';
import * as A from '../audio.js';
import { tempoName } from '../theory.js';

let el, bpmEl, nameEl, dots, playBtn, statusEl, slider, raf = 0;
const M = () => S.metro;

function program() {
  const m = M();
  let bpm = m.bpm, bar = 0;
  return {
    next() {
      const per = m.beats;
      const gapCycle = m.gap.play + m.gap.mute;
      const muted = m.gap.on && (bar % gapCycle) >= m.gap.play;
      let nb = null;
      if (m.speed.on && bar > 0 && bar % m.speed.every === 0) { bpm = Math.min(m.speed.max, bpm + m.speed.step); nb = bpm; }
      const ev = [];
      if (!muted) for (let k = 0; k < per; k++) {
        const lvl = m.accent === 'one' ? (k === 0 ? 2 : 1) : m.accent === 'twofour' ? (k % 2 ? 2 : 0.8) : 1;
        ev.push({ b: k, play: t => A.click(t, lvl, m.sound) });
        if (m.sound === 'kit' && k % 2) ev.push({ b: k, play: t => A.hat(t, 0.7) });
        if (m.sub === 'eighth' || m.sub === 'swing') ev.push({ b: k + 0.5, swing: m.sub === 'swing', play: t => A.click(t, 0.5, m.sound) });
        if (m.sub === 'triplet') { ev.push({ b: k + 1 / 3, play: t => A.click(t, 0.5, m.sound) }); ev.push({ b: k + 2 / 3, play: t => A.click(t, 0.5, m.sound) }); }
        if (m.sub === 'sixteenth') [0.25, 0.5, 0.75].forEach(o => ev.push({ b: k + o, play: t => A.click(t, 0.5, m.sound) }));
      }
      const s = { len: per, events: ev, bar: bar, muted, tag: 'metro' };
      if (nb) s.bpm = nb;
      bar++;
      return s;
    },
  };
}

function start() {
  T.start(program(), { bpm: M().bpm, swing: M().sub === 'swing' ? M().swing : 0.5, owner: 'metro' });
}
function restartIfPlaying() { if (T.playing && T.owner === 'metro') start(); }

// tap tempo
let taps = [];
function tap() {
  const n = performance.now();
  taps = taps.filter(t => n - t < 2500); taps.push(n);
  A.click(A.now() + 0.005, 1, M().sound);
  if (taps.length >= 2) {
    const iv = []; for (let i = 1; i < taps.length; i++) iv.push(taps[i] - taps[i - 1]);
    setBpm(60000 / (iv.reduce((a, b) => a + b, 0) / iv.length));
  }
}

function setBpm(b) {
  b = Math.max(30, Math.min(300, Math.round(b)));
  M().bpm = b; save();
  if (T.playing && T.owner === 'metro') T.setBpm(b);
  paint();
}

function paint() {
  const b = T.playing && T.owner === 'metro' ? T.bpm : M().bpm;
  bpmEl.textContent = b; nameEl.textContent = tempoName(b);
  slider.value = M().bpm;
  playBtn.replaceChildren(icon(T.playing && T.owner === 'metro' ? 'stop' : 'play'));
  playBtn.classList.toggle('on', T.playing && T.owner === 'metro');
  dots.replaceChildren(...Array.from({ length: M().beats }, (_, k) => h('i', { class: 'dot' + ((M().accent === 'one' && k === 0) || (M().accent === 'twofour' && k % 2) ? ' acc' : '') })));
  el.querySelector('.swing-row').classList.toggle('dim', M().sub !== 'swing');
}

function loop() {
  raf = requestAnimationFrame(loop);
  const w = T.playing && T.owner === 'metro' ? T.where() : null;
  const k = w ? Math.floor(w.local) : -1;
  dots.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('on', i === k && !w.seg.muted));
  if (w) {
    const m = M();
    const parts = [];
    if (m.gap.on) parts.push(w.seg.muted ? '<b class="mute">silent: keep time</b>' : `bar ${(w.seg.bar % (m.gap.play + m.gap.mute)) + 1} of ${m.gap.play}`);
    if (m.speed.on) parts.push(`speed trainer → ${m.speed.max}`);
    statusEl.innerHTML = parts.join(' · ');
  } else statusEl.innerHTML = '';
}

export function mount(root) {
  el = h('section', { class: 'view metro' });
  const m = M();
  bpmEl = h('div', { class: 'bpm' }); nameEl = h('div', { class: 'bpm-name' });
  slider = h('input', { type: 'range', min: 30, max: 300, value: m.bpm, class: 'slider', oninput: e => setBpm(+e.target.value) });
  dots = h('div', { class: 'beat-dots' });
  statusEl = h('div', { class: 'metro-status' });
  playBtn = h('button', { class: 'play-big', onclick: () => { if (T.playing && T.owner === 'metro') T.stop(); else start(); } });
  const nudge = (d, label) => h('button', { class: 'pill', onclick: () => setBpm((T.owner === 'metro' && T.playing ? T.bpm : M().bpm) + d) }, label);

  const sw = h('input', { type: 'range', min: 50, max: 75, value: Math.round(m.swing * 100), class: 'slider small', oninput: e => {
    m.swing = +e.target.value / 100; save(); swVal.textContent = swingLabel(m.swing); if (T.owner === 'metro') T.swing = M().sub === 'swing' ? m.swing : 0.5;
  } });
  const swVal = h('span', { class: 'sw-val' }, swingLabel(m.swing));

  el.append(
    h('div', { class: 'metro-top' },
      h('div', { class: 'bpm-wrap' }, bpmEl, h('div', { class: 'bpm-unit' }, 'BPM'), nameEl),
      dots, statusEl,
    ),
    h('div', { class: 'row center gap' }, nudge(-5, '−5'), nudge(-1, '−1'), playBtn, nudge(1, '+1'), nudge(5, '+5')),
    slider,
    h('div', { class: 'row center' }, h('button', { class: 'pill wide', onclick: tap }, 'Tap tempo')),
    h('div', { class: 'card' },
      h('div', { class: 'field' }, h('label', {}, 'Beats'), seg([[2, '2'], [3, '3'], [4, '4'], [5, '5'], [6, '6'], [7, '7']], m.beats, v => { m.beats = +v; save(); paint(); restartIfPlaying(); })),
      h('div', { class: 'field' }, h('label', {}, 'Feel'), seg([['quarter', '♩'], ['eighth', '♪♪'], ['swing', 'Swing'], ['triplet', '3'], ['sixteenth', '16ths']], m.sub, v => { m.sub = v; save(); paint(); restartIfPlaying(); })),
      h('div', { class: 'field swing-row' }, h('label', {}, 'Swing'), sw, swVal),
      h('div', { class: 'field' }, h('label', {}, 'Accent'), seg([['twofour', '2 & 4'], ['one', 'Beat 1'], ['none', 'None']], m.accent, v => { m.accent = v; save(); paint(); restartIfPlaying(); })),
      h('div', { class: 'field' }, h('label', {}, 'Sound'), seg([['wood', 'Wood'], ['click', 'Click'], ['beep', 'Beep'], ['kit', 'Ride']], m.sound, v => { m.sound = v; save(); restartIfPlaying(); })),
    ),
    h('div', { class: 'card' },
      h('div', { class: 'card-head' }, toggle('Speed trainer', m.speed.on, v => { m.speed.on = v; save(); restartIfPlaying(); })),
      h('p', { class: 'dim small' }, 'Starts at your tempo and speeds up as you go. Learn a lick slowly, then let this push it up.'),
      h('div', { class: 'field' }, h('label', {}, 'Add'), stepper({ value: m.speed.step, min: 1, max: 20, fmt: v => `+${v} BPM`, onChange: v => { m.speed.step = v; save(); } })),
      h('div', { class: 'field' }, h('label', {}, 'Every'), stepper({ value: m.speed.every, min: 1, max: 16, fmt: v => `${v} bar${v > 1 ? 's' : ''}`, onChange: v => { m.speed.every = v; save(); } })),
      h('div', { class: 'field' }, h('label', {}, 'Up to'), stepper({ value: m.speed.max, min: 40, max: 300, step: 5, fmt: v => `${v} BPM`, onChange: v => { m.speed.max = v; save(); } })),
    ),
    h('div', { class: 'card' },
      h('div', { class: 'card-head' }, toggle('Gap trainer', m.gap.on, v => { m.gap.on = v; save(); restartIfPlaying(); })),
      h('p', { class: 'dim small' }, 'The click drops out for a few bars while you keep playing. When it comes back, are you still on the beat?'),
      h('div', { class: 'field' }, h('label', {}, 'Play'), stepper({ value: m.gap.play, min: 1, max: 8, fmt: v => `${v} bar${v > 1 ? 's' : ''}`, onChange: v => { m.gap.play = v; save(); } })),
      h('div', { class: 'field' }, h('label', {}, 'Silent'), stepper({ value: m.gap.mute, min: 1, max: 8, fmt: v => `${v} bar${v > 1 ? 's' : ''}`, onChange: v => { m.gap.mute = v; save(); } })),
    ),
    h('p', { class: 'hint', html: '<b>Swing tip:</b> put the click on 2 and 4 and feel those as the strong beats. That is where the hi-hat goes in a swing band.' }),
  );
  root.append(el);
  onTransport(paint);
  paint();
  return el;
}

export function swingLabel(r) {
  const p = Math.round(r * 100);
  return p <= 52 ? 'Straight' : p < 60 ? `Light ${p}%` : p <= 69 ? `Triplet ${p}%` : `Hard ${p}%`;
}

export function show() { cancelAnimationFrame(raf); loop(); paint(); }
export function hide() { cancelAnimationFrame(raf); }
