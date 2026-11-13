// Notes, chord symbols, intervals, guitar fretboard maths.
export const SHARP = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
export const FLAT = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
// Jazz keys are mostly flat keys: spell with flats except where sharps read better.
export const KEY_NAMES = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
const SHARP_KEYS = new Set([2, 4, 6, 7, 9, 11]);
export const pcName = (pc, keyPc = 0) => (SHARP_KEYS.has(((keyPc % 12) + 12) % 12) ? SHARP : FLAT)[((pc % 12) + 12) % 12];
export const midiName = (m, keyPc) => pcName(m, keyPc) + (Math.floor(m / 12) - 1);
export const NAME_PC = { C: 0, 'B#': 0, 'C#': 1, Db: 1, D: 2, 'D#': 3, Eb: 3, E: 4, Fb: 4, F: 5, 'E#': 5, 'F#': 6, Gb: 6, G: 7, 'G#': 8, Ab: 8, A: 9, 'A#': 10, Bb: 10, B: 11, Cb: 11 };

// Standard tuning, string 6 (low E) … string 1 (high E).
export const STD = [40, 45, 50, 55, 59, 64]; // index 0 = string 6
export const openMidi = (s, tuning = STD) => tuning[6 - s];
export const fretMidi = (s, f, tuning = STD) => openMidi(s, tuning) + f;

export const QUAL = {
  '':     { iv: [0, 4, 7], name: 'major' },
  'm':    { iv: [0, 3, 7], name: 'minor' },
  'maj7': { iv: [0, 4, 7, 11], name: 'major 7' },
  '7':    { iv: [0, 4, 7, 10], name: 'dominant 7' },
  'm7':   { iv: [0, 3, 7, 10], name: 'minor 7' },
  'm7b5': { iv: [0, 3, 6, 10], name: 'half-diminished' },
  'dim7': { iv: [0, 3, 6, 9], name: 'diminished 7' },
  '6':    { iv: [0, 4, 7, 9], name: 'major 6' },
  'm6':   { iv: [0, 3, 7, 9], name: 'minor 6' },
  '9':    { iv: [0, 4, 7, 10, 14], name: 'dominant 9' },
  '13':   { iv: [0, 4, 10, 21], name: 'dominant 13' },
  '7b9':  { iv: [0, 4, 7, 10, 13], name: 'dominant 7♭9' },
  '7#9':  { iv: [0, 4, 7, 10, 15], name: 'dominant 7♯9' },
  '6/9':  { iv: [0, 4, 7, 9, 14], name: 'six-nine' },
  'm9':   { iv: [0, 3, 7, 10, 14], name: 'minor 9' },
};
export const isDominant = q => ['7', '9', '13', '7b9', '7#9'].includes(q);

export function parseChord(sym) {
  const m = /^([A-G][b#]?)(.*)$/.exec(sym || '');
  if (!m || !(m[2] in QUAL)) return null;
  return { root: NAME_PC[m[1]], q: m[2], rootName: m[1] };
}
export const chordPcs = c => QUAL[c.q].iv.map(i => (c.root + i) % 12);

// Pretty chord symbol for display (♭ ♯ ° ø).
export function prettyChord(sym) {
  return (sym || '').replace(/^([A-G])b/, '$1♭').replace(/^([A-G])#/, '$1♯')
    .replace('m7b5', 'm7♭5').replace('dim7', '°7').replace('7b9', '7♭9').replace('7#9', '7♯9');
}

// Transpose a chord symbol by n semitones, spelled for the new key.
export function transposeChord(sym, n, keyPc = 0) {
  const c = parseChord(sym); if (!c) return sym;
  return pcName(c.root + n, keyPc) + c.q;
}

// Name a note's job inside a chord: R 3 5 ♭7, tensions 9 11 13, blue notes.
export function degreeLabel(midi, chord) {
  if (!chord) return '';
  const d = (((midi - chord.root) % 12) + 12) % 12;
  const has = i => QUAL[chord.q].iv.some(x => x % 12 === i);
  const dom = isDominant(chord.q);
  switch (d) {
    case 0: return 'R';
    case 1: return '♭9';
    case 2: return '9';
    case 3: return '♭3';
    case 4: return '3';
    case 5: return '11';
    case 6: return has(6) ? '♭5' : '♯11';
    case 7: return '5';
    case 8: return has(7) ? '♭13' : '♯5';
    case 9: return chord.q === 'dim7' ? '°7' : chord.q === '13' ? '13' : '6';
    case 10: return '♭7';
    case 11: return '7';
  }
}
// chord tone (R 3 5 7 6), tension, or other — for colouring
export function degreeKind(midi, chord) {
  if (!chord) return 'none';
  const d = (((midi - chord.root) % 12) + 12) % 12;
  if (QUAL[chord.q].iv.filter(x => x < 12).includes(d)) return 'tone';
  if ([2, 5, 9].includes(d)) return 'tension';
  return 'color';
}

export const TEMPO_NAMES = [[0, 'Ballad'], [80, 'Slow swing'], [110, 'Medium'], [150, 'Medium-up'], [190, 'Up-tempo'], [240, 'Burnin’']];
export const tempoName = b => TEMPO_NAMES.filter(([x]) => b >= x).pop()[1];
