// Chords: a voicing library you can strum, and Jam: loop a progression with a swinging band.
import { h, seg, chips, stepper, icon } from '../ui.js';
import { S, save } from '../store.js';
import { T, onTransport } from '../clock.js';
import * as A from '../audio.js';
import { FAMILIES, SHAPES, place, midisOf, fingersFor } from '../data/chords.js';
import { PROGS, COMPS, STYLES, progById } from '../data/progressions.js';
import { chordBox } from '../diagram.js';
import { chordPad, tapChart } from '../chordpad.js';
import { compEvents, bassEvents, drumEvents, clickEvents } from '../backing.js';
import { chordTimeline } from '../data/licks.js';
import { KEY_NAMES, NAME_PC, QUAL, pcName, prettyChord, transposeChord } from '../theory.js';

let el, libEl, jamEl, raf = 0, part = 'lib';
const OWNER = 'jam';
const J = () => S.jam, C = () => S.chords;

// ---- library ------------------------------------------------------------------------
function paintLib() {
  const c = C();
  const fam = FAMILIES.find(f => f.id === c.fam);
  const grid = h('div', { class: 'chord-grid' });
  const keyName = pcName(c.root, c.root);
  SHAPES.filter(s => s.fam === c.fam).forEach(s => {
    const p = place(s, c.root, 5); if (!p) return;
    const chord = { root: c.root, q: s.q };
    const sym = keyName + s.q;
    grid.append(h('button', { class: 'chord-card', onclick: e => {
      const t = A.now() + 0.02;
      A.strum(midisOf(p.frets), t, { vel: 0.7, len: 2.2, spread: 0.03 });
      e.currentTarget.classList.add('hit'); const b = e.currentTarget; setTimeout(() => b.classList.remove('hit'), 300);
    } }, h('div', { class: 'cc-name' }, prettyChord(sym)), h('div', { class: 'cc-sub' }, `${QUAL[s.q].name} · ${s.f ? 'open' : `root on ${s.rs === 6 ? '6th' : '5th'}`}`), h('div', { html: chordBox(p.frets, chord, { fingers: fingersFor(p.frets, s) }) })));
  });
  if (!grid.childElementCount) grid.append(h('p', { class: 'hint' }, `No open chords in ${keyName.replace('b', '♭')}. Try C, D, E, F, G, A or B.`));
  libEl.replaceChildren(
    chips(KEY_NAMES.map((k, i) => [i, k.replace('b', '♭').replace('#', '♯')]), c.root, v => { c.root = +v; save(); paintLib(); }, 'keys'),
    seg(FAMILIES.map(f => [f.id, f.name]), c.fam, v => { c.fam = v; save(); paintLib(); }, 'grow'),
    h('p', { class: 'hint' }, fam.blurb),
    grid,
    h('p', { class: 'dim small center' }, 'Tap a chord to hear it. Dots show each note’s job: R = root, 3, 5, ♭7 / 7, and colour tones like 9 and 13. Orange numbers under the strings are fingers (1 index … 4 pinky). × = don’t play that string.'),
  );
}

const jamSwing = () => COMPS.find(c => c.id === J().comp)?.swing ?? J().swing ?? 0.62;

// ---- jam ----------------------------------------------------------------------------
function jamBars() {
  const j = J(), p = progById(j.prog);
  const key = j.key && j.keyFor === p.id ? j.key : p.key;
  const n = NAME_PC[key] - NAME_PC[p.key];
  return { key, bars: p.bars.map(b => Array.isArray(b) ? b.map(c => transposeChord(c, n, NAME_PC[key])) : transposeChord(b, n, NAME_PC[key])) };
}

function jamProgram() {
  const j = J();
  const { bars } = jamBars();
  const tl = chordTimeline(bars), L = bars.length * 4;
  let cycle = 0, first = true;
  return {
    next() {
      if (first) { first = false; return { len: 4, tag: 'count', events: clickEvents(4, { sound: 'wood' }) }; }
      const ev = [
        ...compEvents(tl, j.comp, { fam: COMPS.find(c => c.id === j.comp)?.fam || j.fam, seed: cycle + 1 }),
        ...bassEvents(tl, j.bass, { seed: cycle + 1 }),
        ...drumEvents(L, j.drums),
      ];
      cycle++;
      return { len: L, tag: 'jam', events: ev, cycle };
    },
  };
}

let jamFrame = null;
function paintJam() {
  const j = J(), p = progById(j.prog);
  const { key, bars } = jamBars();
  const tl = chordTimeline(bars);
  const now = h('div', { class: 'jam-now' }), next = h('div', { class: 'jam-next' });
  const compFam = () => COMPS.find(c => c.id === j.comp)?.fam || j.fam;
  const pad = chordPad({ fam: () => (j.comp === 'pompe' ? 'four' : compFam()), keyPc: () => NAME_PC[key] });
  const chart = tapChart(bars, sym => pad.select(sym, { sound: true }));
  const playBtn = h('button', { class: 'play-big', onclick: () => {
    if (T.playing && T.owner === OWNER) T.stop();
    else T.start(jamProgram(), { bpm: j.bpm, swing: jamSwing(), owner: OWNER });
  } });
  const bpmStep = stepper({ value: j.bpm, min: 40, max: 300, step: 5, fmt: v => `${v} BPM`, onChange: v => { j.bpm = v; save(); if (T.owner === OWNER && T.playing) T.setBpm(v); } });
  const restart = () => { save(); const was = T.playing && T.owner === OWNER; paintJam(); if (was) T.start(jamProgram(), { bpm: j.bpm, swing: jamSwing(), owner: OWNER }); };
  const keySel = h('select', { class: 'select', onchange: e => { j.key = e.target.value; j.keyFor = p.id; restart(); } },
    ...KEY_NAMES.map(k => h('option', { value: k, selected: k === key }, k.replace('b', '♭').replace('#', '♯'))));
  let lastSym = null;
  const show = (sym, nsym) => {
    if (sym === lastSym) return; lastSym = sym;
    now.textContent = prettyChord(sym); next.textContent = nsym ? `next: ${prettyChord(nsym)}` : '';
    pad.select(sym);
  };
  show(tl[0].sym, tl[1]?.sym);
  jamEl.replaceChildren(
    seg(STYLES.map(x => [x, x]), p.style, v => { const first = PROGS.find(x => x.style === v); j.prog = first.id; restart(); }, 'grow'),
    chips(PROGS.filter(x => x.style === p.style).map(x => [x.id, x.name]), j.prog, v => { j.prog = v; restart(); }),
    h('p', { class: 'hint' }, p.about),
    h('div', { class: 'jam-stage' }, h('div', { class: 'jam-names' }, now, next)),
    chart,
    h('p', { class: 'dim small center' }, 'Tap a chord to hear it and see the fingering. While the band plays, the shape follows along.'),
    pad,
    h('div', { class: 'row center gap' }, playBtn),
    h('div', { class: 'row center gap wrap' }, bpmStep, h('div', { class: 'field' }, h('label', {}, 'Key'), keySel)),
    h('div', { class: 'card' },
      h('div', { class: 'field col' }, h('label', {}, 'Guitar'), chips(COMPS.map(c => [c.id, c.name]), j.comp, v => { j.comp = v; restart(); })),
      h('p', { class: 'dim small' }, COMPS.find(c => c.id === j.comp).blurb),
      h('div', { class: 'field col' }, h('label', {}, 'Chords'), seg(FAMILIES.map(f => [f.id, f.name]), j.fam, v => { j.fam = v; restart(); }, 'grow')),
      h('div', { class: 'field col' }, h('label', {}, 'Bass'), seg([['walk', 'Walking'], ['two', 'In two'], ['boogie', 'Boogie'], ['eighths', 'Rock'], ['none', 'Off']], j.bass, v => { j.bass = v; restart(); }, 'grow')),
      h('div', { class: 'field col' }, h('label', {}, 'Drums'), seg([['ride', 'Ride'], ['brush', 'Brushes'], ['hat', 'Hi-hat'], ['shuffle', 'Shuffle'], ['rock', 'Rock'], ['none', 'Off']], j.drums, v => { j.drums = v; restart(); }, 'grow')),
    ),
    h('p', { class: 'dim small center' }, 'Practise ideas: comp along with the guitar off · solo using only chord tones · play the guide tones (3rds and 7ths) · move a lick from the Licks tab through every chord.'),
  );
  jamFrame = () => {
    const playing = T.playing && T.owner === OWNER;
    playBtn.replaceChildren(icon(playing ? 'stop' : 'play')); playBtn.classList.toggle('on', playing);
    const w = playing ? T.where() : null;
    const beat = w && w.seg.tag === 'jam' ? w.local : -1;
    const bar = beat < 0 ? -1 : Math.floor(beat / 4);
    chart.querySelectorAll('.bar').forEach((b, i) => b.classList.toggle('on', i === bar));
    if (w && w.seg.tag === 'count') { now.textContent = `${Math.floor(w.local) + 1}`; next.textContent = `first: ${prettyChord(tl[0].sym)}`; lastSym = null; }
    else if (beat >= 0) { const i = tl.findIndex(c => beat >= c.b && beat < c.b + c.len); if (i >= 0) show(tl[i].sym, tl[(i + 1) % tl.length].sym); }
  };
}

function loop() { raf = requestAnimationFrame(loop); if (part === 'jam' && jamFrame) jamFrame(); }

export function mount(root) {
  el = h('section', { class: 'view chords' });
  libEl = h('div', { class: 'lib' }); jamEl = h('div', { class: 'jam', hidden: true });
  const sw = seg([['lib', 'Voicings'], ['jam', 'Jam']], part, v => { part = v; libEl.hidden = v !== 'lib'; jamEl.hidden = v !== 'jam'; }, 'grow sub-seg');
  el.append(sw, libEl, jamEl);
  root.append(el);
  paintLib(); paintJam();
  el.sw = sw;
  return el;
}
export function show(opts = {}) {
  if (opts.jam) { part = 'jam'; el.sw.set('jam'); libEl.hidden = true; jamEl.hidden = false; if (opts.prog) { J().prog = opts.prog; save(); paintJam(); } }
  cancelAnimationFrame(raf); loop();
}
export function hide() { cancelAnimationFrame(raf); }
