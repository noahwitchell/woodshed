// Guitar tab as SVG: six lines, fret numbers in time, chord symbols, beat counts, and an
// optional label under each note (note name or its job in the chord).
import { fretMidi, midiName, parseChord, degreeLabel, degreeKind, prettyChord } from './theory.js';
import { chordAt } from './data/licks.js';

const SP = 13;            // string spacing
const TOP = 26;           // room for chord names + technique marks
const LAB = 30;           // label rows under the staff
const FG = 16;            // finger-number row (when shown)

export function renderTab(notes, tl, { bars, width = 360, labels = 'degrees', keyPc = 0, fingers = null } = {}) {
  const fg = fingers ? FG : 0;
  const ROW = TOP + SP * 5 + LAB + 18 + fg;
  // fast lines (more than 8 notes in a bar) get twice the room so the fret numbers don't collide
  const perBar = {}; notes.forEach(n => { if (!n.rest) { const k = Math.floor(n.b / 4 + 1e-9); perBar[k] = (perBar[k] || 0) + 1; } });
  // and bursts faster than triplets (sextuplets) get half a bar per row
  const most = Math.max(0, ...Object.values(perBar));
  const burst = notes.some(n => !n.rest && n.d < 0.3);
  const per = (width >= 640 ? 4 : 2) / (most > 8 ? 2 : 1) / (burst ? 2 : 1);
  const RB = per * 4, SB = Math.min(4, RB), nseg = RB / SB;   // beats per row, per segment, segments per row
  const rows = Math.ceil((bars * 4) / RB - 1e-9);
  const L = 18, R = 6;
  const bw = (width - L - R) / nseg;
  const xOf = b => { const sg = Math.floor(b / SB + 1e-9), k = sg % nseg; return L + k * bw + 12 + ((b - sg * SB) / SB) * (bw - 18); };
  const yRow = b => Math.floor(b / RB + 1e-9) * ROW;
  const sy = s => TOP + (s - 1) * SP;
  let o = `<svg class="tab" viewBox="0 0 ${width} ${rows * ROW}" width="100%" preserveAspectRatio="xMidYMin meet">`;
  for (let r = 0; r < rows; r++) {
    const y0 = r * ROW, n = Math.min(nseg, Math.ceil((bars * 4 - r * RB) / SB - 1e-9));
    const x1 = L + n * bw;
    o += `<g transform="translate(0 ${y0})">`;
    o += `<text class="tab-tab" x="4" y="${sy(1) + 4}">T</text><text class="tab-tab" x="4" y="${sy(3) + 6}">A</text><text class="tab-tab" x="4" y="${sy(5) + 8}">B</text>`;
    for (let s = 1; s <= 6; s++) o += `<line class="tab-str" x1="${L}" x2="${x1}" y1="${sy(s)}" y2="${sy(s)}"/>`;
    for (let k = 0; k <= n; k++) o += `<line class="tab-bar" x1="${L + k * bw}" x2="${L + k * bw}" y1="${sy(1)}" y2="${sy(6)}"/>`;
    // beat counts
    for (let k = 0; k < n; k++) for (let e = 0; e < SB * 2; e++) {
      const b = (r * nseg + k) * SB + e / 2;
      o += `<text class="tab-count${e % 2 ? ' off' : ''}" x="${xOf(b)}" y="${sy(6) + fg + LAB + 12}">${e % 2 ? '&' : (b % 4) + 1}</text>`;
    }
    o += `<line class="tab-head" data-row="${r}" x1="-10" x2="-10" y1="${sy(1) - 8}" y2="${sy(6) + 8}"/>`;
    o += '</g>';
  }
  // chord names
  for (const c of tl) {
    if (c.sym === '—') continue;
    o += `<text class="tab-chord" x="${xOf(c.b) - 6}" y="${yRow(c.b) + 11}">${prettyChord(c.sym)}</text>`;
  }
  // notes
  notes.forEach((n, i) => {
    if (n.rest) return;
    const x = xOf(n.b), y0 = yRow(n.b);
    const chord = parseChord(chordAt(tl, n.b)?.sym);
    o += `<g class="tab-note" data-i="${i}" transform="translate(0 ${y0})">`;
    const sorted = [...n.p].sort((a, b) => a.s - b.s);
    if (n.d >= 1) {
      const rowEnd = (Math.floor(n.b / RB + 1e-9) + 1) * RB;
      const xe = xOf(Math.min(n.b + n.d, rowEnd) - 0.01) - 4;
      if (xe > x + 12) sorted.forEach(q => { o += `<line class="tab-sus" x1="${x + 9}" x2="${xe}" y1="${sy(q.s)}" y2="${sy(q.s)}"/>`; });
    }
    sorted.forEach(q => {
      const m = fretMidi(q.s, q.f);
      const kind = labels === 'degrees' ? degreeKind(m, chord) : 'none';
      const wide = q.f >= 10;
      o += `<rect class="tab-box k-${kind}" x="${x - (wide ? 8.5 : 6.5)}" y="${sy(q.s) - 6.5}" width="${wide ? 17 : 13}" height="13" rx="6.5"/>`;
      o += `<text class="tab-fret" x="${x}" y="${sy(q.s) + 4}">${q.f}</text>`;
    });
    if (n.tech) {
      const mark = { h: 'h', p: 'p', s: '/', b: '½', b2: 'full', b3: '1½', q: '¼', u: 'rel', v: '~~' }[n.tech];
      const up = n.tech[0] === 'b' || n.tech === 'q', y = sy(sorted[0].s);
      o += `<text class="tab-tech" x="${x - (up || n.tech === 'u' || n.tech === 'v' ? 0 : 8)}" y="${y - 9}">${mark}</text>`;
      if (up) o += `<path class="tab-bend" d="M${x + 7} ${y} q${n.tech === 'q' ? '4 0 4 -5' : '6 0 6 -10'}" />`;
      if (n.tech === 'u') o += `<path class="tab-bend" d="M${x + 7} ${y - 8} q5 0 6 8" />`;
    }
    if (labels !== 'frets') {
      sorted.slice(0, 2).forEach((q, k) => {
        const m = fretMidi(q.s, q.f);
        const name = midiName(m, keyPc).replace(/-?\d+$/, '').replace('b', '♭').replace('#', '♯');
        const t = labels === 'degrees' ? (degreeLabel(m, chord) || name) : name;
        const kind = labels === 'degrees' ? degreeKind(m, chord) : 'none';
        o += `<text class="tab-lab k-${kind}" x="${x}" y="${sy(6) + fg + 17 + k * 11}">${t}</text>`;
      });
    }
    // fretting fingers, high string first (brass = the hand moves to a new position here)
    const fk = fingers?.[i];
    if (fk) {
      const t = sorted.map(q => fk.k[n.p.indexOf(q)]).join('');
      o += `<text class="tab-fing${fk.shift ? ' shift' : ''}" x="${x}" y="${sy(6) + 17}">${t}</text>`;
    }
    o += '</g>';
  });
  o += '</svg>';
  return { svg: o, xOf, rows, per, ROW };
}

// Move the playhead and light the sounding note. beat = unswung position in the lick.
export function paintTab(root, view, beat, activeIdx) {
  const svg = root.querySelector('svg.tab'); if (!svg) return;
  root.querySelectorAll('.tab-note.on').forEach(e => { if (+e.dataset.i !== activeIdx) e.classList.remove('on'); });
  if (activeIdx != null) root.querySelector(`.tab-note[data-i="${activeIdx}"]`)?.classList.add('on');
  const row = beat == null ? -1 : Math.floor(beat / (view.per * 4));
  root.querySelectorAll('.tab-head').forEach(l => {
    const on = +l.dataset.row === row;
    l.style.opacity = on ? 0.85 : 0;
    if (on) { const x = view.xOf(beat); l.setAttribute('x1', x); l.setAttribute('x2', x); }
  });
}

// Inverse of swingBeat for drawing: a swung clock position back to the written grid.
export function unswing(b, r) {
  const B = Math.floor(b), f = b - B;
  return B + (f <= r ? (f / r) * 0.5 : 0.5 + ((f - r) / (1 - r)) * 0.5);
}
