// Chord box diagram (SVG). frets: 6 entries, string 6 → 1, null = muted.
import { fretMidi, degreeLabel, degreeKind } from './theory.js';

export function chordBox(frets, chord, { size = 1, labels = true, rootFret = null } = {}) {
  const used = frets.filter(f => f != null && f > 0);
  const lo = used.length ? Math.min(...used) : 1, hi = used.length ? Math.max(...used) : 1;
  const span = Math.max(4, hi - lo + 1);
  const base = hi <= 4 ? 1 : lo;
  const W = 108, H = 128, x0 = 28, y0 = 26, gw = 70, gh = 88;
  const sx = i => x0 + (i * gw) / 5, fy = k => y0 + (k * gh) / span;
  let o = `<svg class="cbox" viewBox="0 0 ${W} ${H}" width="${W * size}" height="${H * size}">`;
  if (base === 1) o += `<rect class="cb-nut" x="${x0 - 1}" y="${y0 - 4}" width="${gw + 2}" height="4"/>`;
  else o += `<text class="cb-base" x="${x0 - 18}" y="${fy(0.5) + 4}">${base}</text>`;
  for (let i = 0; i < 6; i++) o += `<line class="cb-str" x1="${sx(i)}" x2="${sx(i)}" y1="${y0}" y2="${y0 + gh}"/>`;
  for (let k = 0; k <= span; k++) o += `<line class="cb-fret" x1="${x0}" x2="${x0 + gw}" y1="${fy(k)}" y2="${fy(k)}"/>`;
  frets.forEach((f, i) => {
    const s = 6 - i, x = sx(i);
    if (f == null) { o += `<text class="cb-x" x="${x}" y="${y0 - 9}">×</text>`; return; }
    const m = fretMidi(s, f);
    const lab = chord ? degreeLabel(m, chord) : '';
    const kind = chord ? (lab === 'R' ? 'root' : degreeKind(m, chord)) : 'tone';
    if (f === 0) { o += `<circle class="cb-open k-${kind}" cx="${x}" cy="${y0 - 12}" r="5"/>`; return; }
    const y = fy(f - base + 0.5);
    o += `<circle class="cb-dot k-${kind}" cx="${x}" cy="${y}" r="7.6"/>`;
    if (labels) o += `<text class="cb-lab" x="${x}" y="${y + 3.4}">${lab}</text>`;
  });
  o += '</svg>';
  return o;
}
