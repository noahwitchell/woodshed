// Chord pad: tap a chord name in a chart to hear it and see how to finger it.
// Shows the box diagram with finger numbers, the notes and their jobs, and buttons to strum,
// arpeggiate (one string at a time, to check every note rings) and try another shape.
import { h } from './ui.js';
import * as A from './audio.js';
import { voicingsFor, fingersFor } from './data/chords.js';
import { chordBox } from './diagram.js';
import { QUAL, prettyChord, pcName, degreeLabel, fretMidi } from './theory.js';

export function chordPad({ fam = () => 'shell', keyPc = () => 0 } = {}) {
  const el = h('div', { class: 'chord-pad' });
  let sym = null, list = [], idx = 0;

  const v = () => list[idx];
  const strum = () => { const x = v(); if (x) A.strum(x.midis, A.now() + 0.02, { vel: 0.7, len: 2.4, spread: 0.035 }); };
  const arp = () => {
    const x = v(); if (!x) return;
    const t = A.now() + 0.02;
    x.midis.forEach((m, i) => A.pluck(m, t + i * 0.32, { vel: 0.65, len: 1.6 }));
  };

  function paint() {
    const x = v();
    if (!x) { el.replaceChildren(h('div', { class: 'cp-info' }, h('div', { class: 'cp-name' }, prettyChord(sym || '')), h('div', { class: 'cp-sub' }, 'No shape for this chord yet.'))); return; }
    const fingers = fingersFor(x.frets, x.shape);
    const where = x.shape.fam === 'open' ? 'open position' : `root on the ${x.shape.rs === 6 ? '6th' : '5th'} string, fret ${x.rf}`;
    // notes low → high, each with its job in the chord
    const notes = [];
    x.frets.forEach((f, i) => { if (f != null) { const m = fretMidi(6 - i, f); notes.push([pcName(m, keyPc()), degreeLabel(m, x.chord)]); } });
    el.replaceChildren(
      h('div', { html: chordBox(x.frets, x.chord, { size: 1.05, fingers }) }),
      h('div', { class: 'cp-info' },
        h('div', { class: 'cp-name' }, prettyChord(sym)),
        h('div', { class: 'cp-sub' }, `${QUAL[x.chord.q].name} · ${where}`),
        h('div', { class: 'cp-notes' }, ...notes.flatMap(([n, d], i) => [i ? ' ' : '', n.replace('b', '♭').replace('#', '♯'), h('i', {}, d)])),
        h('div', { class: 'cp-sub' }, 'Orange numbers = fingers: 1 index … 4 pinky.'),
        h('div', { class: 'cp-btns' },
          h('button', { onclick: strum }, 'Strum'),
          h('button', { onclick: arp }, 'One string at a time'),
          list.length > 1 ? h('button', { onclick: () => { idx = (idx + 1) % list.length; paint(); strum(); } }, `Other shape (${idx + 1}/${list.length})`) : null)),
    );
  }

  // show a chord; sound = also strum it (a tap), keep = keep the chosen shape when it is the same chord
  el.select = (s, { sound = false } = {}) => {
    if (s !== sym) { sym = s; list = voicingsFor(s, fam(), 5); idx = 0; paint(); }
    if (sound) strum();
  };
  el.refresh = () => { const s = sym; sym = null; if (s) el.select(s); };
  el.current = () => sym;
  return el;
}

// A chord chart whose chord names are buttons. onTap(sym, button) is called on a tap.
export function tapChart(bars, onTap) {
  const chart = h('div', { class: 'chart' }, ...bars.map((b, i) => h('div', { class: 'bar', 'data-bar': i },
    ...(Array.isArray(b) ? b : [b]).map(c => h('button', { class: 'cc', 'data-sym': c, onclick: e => {
      chart.querySelectorAll('.cc.sel').forEach(x => x.classList.remove('sel'));
      e.currentTarget.classList.add('sel');
      onTap(c, e.currentTarget);
    } }, prettyChord(c))))));
  return chart;
}

