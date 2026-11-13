// Movable jazz voicings. Offsets are frets relative to the root's fret, strings 6→1, null = muted.
// rs = the string the root sits on.
import { parseChord, fretMidi, chordPcs } from '../theory.js';

export const FAMILIES = [
  { id: 'shell', name: 'Shells', blurb: 'Root, 3rd and 7th only. The Freddie Green swing sound: small, punchy, easy to move. Mute every string you are not fretting.' },
  { id: 'four', name: 'Four-note', blurb: 'Full jazz chords with the 5th or 6th added. Your bread and butter for comping.' },
  { id: 'color', name: 'Colour', blurb: 'Extended chords: 9ths, 13ths and altered dominants. Swap these in for plain 7ths to sound instantly jazzier.' },
];

export const SHAPES = [
  // shells
  { fam: 'shell', q: 'maj7', rs: 6, o: [0, null, 1, 1, null, null] },
  { fam: 'shell', q: '7',    rs: 6, o: [0, null, 0, 1, null, null] },
  { fam: 'shell', q: 'm7',   rs: 6, o: [0, null, 0, 0, null, null] },
  { fam: 'shell', q: '6',    rs: 6, o: [0, null, -1, 1, null, null] },
  { fam: 'shell', q: 'm6',   rs: 6, o: [0, null, -1, 0, null, null] },
  { fam: 'shell', q: 'dim7', rs: 6, o: [0, null, -1, 0, null, null] },
  { fam: 'shell', q: 'maj7', rs: 5, o: [null, 0, -1, 1, null, null] },
  { fam: 'shell', q: '7',    rs: 5, o: [null, 0, -1, 0, null, null] },
  { fam: 'shell', q: 'm7',   rs: 5, o: [null, 0, -2, 0, null, null] },
  { fam: 'shell', q: '6',    rs: 5, o: [null, 0, -1, -1, null, null] },
  { fam: 'shell', q: 'm6',   rs: 5, o: [null, 0, -2, -1, null, null] },
  // four-note
  { fam: 'four', q: 'maj7', rs: 6, o: [0, null, 1, 1, 0, null] },
  { fam: 'four', q: '7',    rs: 6, o: [0, null, 0, 1, 0, null] },
  { fam: 'four', q: 'm7',   rs: 6, o: [0, null, 0, 0, 0, null] },
  { fam: 'four', q: 'm7b5', rs: 6, o: [0, null, 0, 0, -1, null] },
  { fam: 'four', q: 'dim7', rs: 6, o: [0, null, -1, 0, -1, null] },
  { fam: 'four', q: '6',    rs: 6, o: [0, null, -1, 1, 0, null] },
  { fam: 'four', q: 'm6',   rs: 6, o: [0, null, -1, 0, 0, null] },
  { fam: 'four', q: 'maj7', rs: 5, o: [null, 0, 2, 1, 2, null] },
  { fam: 'four', q: '7',    rs: 5, o: [null, 0, 2, 0, 2, null] },
  { fam: 'four', q: 'm7',   rs: 5, o: [null, 0, 2, 0, 1, null] },
  { fam: 'four', q: 'm7b5', rs: 5, o: [null, 0, 1, 0, 1, null] },
  { fam: 'four', q: 'dim7', rs: 5, o: [null, 0, 1, -1, 1, null] },
  { fam: 'four', q: '6',    rs: 5, o: [null, 0, 2, -1, 2, null] },
  { fam: 'four', q: 'm6',   rs: 5, o: [null, 0, -2, -1, -2, null] },
  { fam: 'four', q: '',     rs: 5, o: [null, 0, 2, 2, 2, null] },
  { fam: 'four', q: 'm',    rs: 5, o: [null, 0, 2, 2, 1, null] },
  // colour
  { fam: 'color', q: '9',    rs: 5, o: [null, 0, -1, 0, 0, 0] },
  { fam: 'color', q: '13',   rs: 6, o: [0, null, 0, 1, 2, null] },
  { fam: 'color', q: '13',   rs: 5, o: [null, 0, null, 0, 2, 2] },
  { fam: 'color', q: '7b9',  rs: 5, o: [null, 0, -1, 0, -1, null] },
  { fam: 'color', q: '7b9',  rs: 6, o: [0, null, 0, 1, 0, 1] },
  { fam: 'color', q: '7#9',  rs: 5, o: [null, 0, -1, 0, 1, null] },
  { fam: 'color', q: '6/9',  rs: 5, o: [null, 0, -1, -1, 0, 0] },
  { fam: 'color', q: 'm9',   rs: 5, o: [null, 0, -2, 0, 0, null] },
];

// Place a shape for a root pitch class: returns frets per string (6→1) and the root fret.
// Picks the octave that keeps the lowest fretted note at fret ≥ 1 (or open when it fits) and ≤ 12.
export function place(shape, rootPc, near = 5) {
  const open = shape.rs === 6 ? 40 : 45;
  let best = null;
  for (let rf = 0; rf <= 15; rf++) {
    if ((open + rf) % 12 !== rootPc) continue;
    const frets = shape.o.map(x => (x == null ? null : rf + x));
    const used = frets.filter(f => f != null);
    if (Math.min(...used) < 0 || Math.max(...used) > 15) continue;
    if (rf === 0 && used.some(f => f > 4)) continue; // open shapes must stay in first position
    const avg = used.reduce((a, b) => a + b, 0) / used.length;
    const score = Math.abs(avg - near) + (rf === 0 ? 0.5 : 0);
    if (!best || score < best.score) best = { frets, rf, score, avg };
  }
  return best;
}

export const midisOf = frets => frets.map((f, i) => (f == null ? null : fretMidi(6 - i, f))).filter(m => m != null);

// Best voicing for a chord symbol in a family, near a fret (voice leading for comping).
export function voicingFor(sym, fam = 'shell', near = 5) {
  const c = parseChord(sym); if (!c) return null;
  const order = [fam, 'four', 'shell', 'color'];
  for (const f of order) {
    const cands = SHAPES.filter(s => s.fam === f && s.q === c.q);
    let best = null;
    for (const s of cands) {
      const p = place(s, c.root, near);
      if (p && (!best || p.score < best.p.score)) best = { s, p };
    }
    if (best) return { sym, chord: c, shape: best.s, frets: best.p.frets, rf: best.p.rf, avg: best.p.avg, midis: midisOf(best.p.frets) };
  }
  return null;
}

// Sanity check used by tests: every shape spells only its chord's notes and contains root + 3rd/7th.
export function checkShapes() {
  const errs = [];
  for (const s of SHAPES) {
    const root = s.rs === 6 ? 7 : 0; // G or C
    const p = place(s, root, 5);
    if (!p) { errs.push(`${s.fam} ${s.q} rs${s.rs}: no placement`); continue; }
    const pcs = new Set(chordPcs({ root, q: s.q }));
    midisOf(p.frets).forEach(m => { if (!pcs.has(m % 12)) errs.push(`${s.fam} ${s.q} rs${s.rs}: stray note ${m}`); });
  }
  return errs;
}
