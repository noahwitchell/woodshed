// Lick library. Notes are written as tokens:  string:fret:beats[tech]
//   "3:7:.5"        string 3, fret 7, an 8th note
//   "3:6:.5h"       hammered on (h), pulled off (p), slid into (s), bent up a half (b) / whole (b2) step
//   "3:6+2:8:1"     double stop (two strings at once)
//   "r:1"           rest
// Beats: 1 = quarter, .5 = 8th, 1/3 = triplet 8th. Bars are 4/4. Chords: one entry per bar,
// or an array for two chords in a bar.

export const CATS = ['Classics', 'Swing blues', 'Bebop', 'ii–V–I', 'Gypsy jazz', 'Riffs', 'Turnarounds & endings'];

export const LICKS = [
  {
    id: 'the-lick', title: 'The Lick', cat: 'Classics', level: 1, bpm: 140, key: 'D minor',
    chords: ['Dm7', 'Dm7'],
    notes: '3:7:.5 3:9:.5 3:10:.5 2:8:.5 3:9:1 4:10:.5 3:7:2.5 r:2',
    about: 'The most famous seven notes in jazz: D E F G E C D. It turns up in so many solos it became a running joke among jazz players. Learn it, then hide it in your own solos.',
    tip: 'Play it in all 12 keys by moving the whole shape up a fret at a time (use the key buttons). Then try it over G7 and C too: it works over the whole ii–V–I.',
  },
  {
    id: 'bebop-down', title: 'Bebop scale run', cat: 'Bebop', level: 1, bpm: 130, key: 'C',
    chords: ['G7', 'Cmaj7'],
    notes: '1:3:.5 1:2:.5 1:1:.5 1:0:.5 2:3:.5 2:1:.5 2:0:.5 3:2:.5 3:0:1 4:2:3',
    about: 'Charlie Parker’s trick: add one extra chromatic note (F♯, between the root and ♭7) to the scale. With eight notes instead of seven, the chord tones G, F, D and B land on the beat every time.',
    tip: 'Turn on Degrees and watch the chord tones fall on 1, 2, 3 and 4. Say them out loud while you play.',
  },
  {
    id: 'enclosure', title: 'Enclosing the 3rd', cat: 'Bebop', level: 2, bpm: 130, key: 'C',
    chords: ['G7', 'Cmaj7'],
    notes: 'r:1 3:4:.5 3:7:.5 2:6:.5 1:5:.5 2:6:.5 2:4:.5 2:5:2 r:2',
    about: 'Climb a G9 arpeggio (B D F A), then surround the target note E: one note above (F), one below (D♯), then land. Surrounding a target note like this is called an enclosure, and it is the most bebop sound there is.',
    tip: 'The target lands on beat 1 of the new chord. Practise just the last three notes (F, D♯, E) until they flow.',
  },
  {
    id: 'christian', title: 'Sixth-chord swing line', cat: 'Swing blues', level: 1, bpm: 150, key: 'A',
    chords: ['A7', 'A7'],
    notes: '3:5:.5 3:6:.5h 2:5:.5 2:7:.5 1:5:1 2:7:.5 2:5:.5 3:6:1 2:5:.5 3:6:.5 4:7:2',
    about: 'Early electric swing guitar in the style of Charlie Christian: the bluesy minor 3rd hammers onto the major 3rd, and the line leans on the 6th (F♯) for that sunny swing sound.',
    tip: 'Hammer from C to C♯ with your middle finger. Keep the 8th notes lazy: they are swung.',
  },
  {
    id: 'tbone', title: 'Blues bend and 6th', cat: 'Swing blues', level: 2, bpm: 120, key: 'G',
    chords: ['G7', 'G7'],
    notes: '3:3:1b 2:3:.5 1:3:.5 2:5:1 2:3:.5 3:3:.5 4:5:3 r:1',
    about: 'Jump blues guitar in the style of T-Bone Walker: bend the minor 3rd (B♭) up a half step to the major 3rd, then sweeten it with the 6th (E).',
    tip: 'Bend slowly and in tune. Play the target note B unbent first so you know what pitch to aim for.',
  },
  {
    id: 'am6-arp', title: 'Minor 6 arpeggio', cat: 'Gypsy jazz', level: 2, bpm: 160, key: 'A minor',
    chords: ['Am6', 'Am6'],
    notes: '4:7:.5 3:5:.5 2:5:.5 2:7:.5 1:5:.5 1:8:.5 1:7:.5 1:5:.5 2:7:.5 2:5:.5 3:5:.5 3:4:.5 4:7:2',
    about: 'Django Reinhardt built whole solos from minor 6 arpeggios (A C E F♯). This one runs up two octaves’ worth, adds the 9th (B), and walks back down.',
    tip: 'Gypsy pickers use rest strokes: the pick comes to rest on the next string down. Use downstrokes when you change to a higher string.',
  },
  {
    id: 'dim-e7', title: 'Diminished over the V', cat: 'Gypsy jazz', level: 2, bpm: 150, key: 'A minor',
    chords: ['E7b9', 'Am6'],
    notes: '4:6:.5 3:4:.5 3:7:.5 2:6:.5 1:4:.5 1:7:.5 1:4:.5 2:6:.5 2:5:1 3:5:1 4:7:2',
    about: 'Over E7♭9, play a G♯ diminished arpeggio (G♯ B D F): it is the chord’s 3rd, 5th, ♭7 and ♭9. The F falls a half step to E as the chord resolves to A minor.',
    tip: 'Diminished shapes repeat every 3 frets. Slide this whole lick up 3 frets: it still works over E7♭9.',
  },
  {
    id: 'chrom-climb', title: 'Chromatic triplet climb', cat: 'Gypsy jazz', level: 3, bpm: 140, key: 'A minor',
    chords: ['Am6', 'Am6'],
    notes: '2:5:1/3 2:6:1/3 2:7:1/3 2:8:1/3 2:9:1/3 2:10:1/3 1:8:1 1:7:.5 1:5:.5 1:12:2s r:2',
    about: 'A fast chromatic run up from the 5th (E) to the root, in triplets, then a bright slide up to the high E. Fast, flashy and very gypsy.',
    tip: 'Slow it down first. Every note of the triplets should sound equally loud.',
  },
  {
    id: 'two-five-up-down', title: 'Up the ii, down the V', cat: 'ii–V–I', level: 1, bpm: 140, key: 'C',
    chords: [['Dm7', 'G7'], 'Cmaj7'],
    notes: '3:7:.5 2:6:.5 1:5:.5 1:8:.5 1:7:.5 1:5:.5 2:8:.5 2:6:.5 2:5:2 r:2',
    about: 'Climb the Dm7 arpeggio, come back down through G7 starting on its 3rd, and step from F (G7’s ♭7) down to E (Cmaj7’s 3rd). That half step from 7th to 3rd is what makes a ii–V–I sound like it resolves.',
    tip: 'Play only the F and the E, with the backing on. Hear the resolve? Every ii–V–I has it.',
  },
  {
    id: 'minor-251', title: 'Minor ii–V–i', cat: 'ii–V–I', level: 2, bpm: 130, key: 'C minor',
    chords: [['Dm7b5', 'G7b9'], 'Cm6'],
    notes: '3:7:.5 2:6:.5 2:9:.5 1:8:.5 1:7:.5 2:9:.5 2:6:.5 3:7:.5 3:8:2 4:10:2',
    about: 'Dm7♭5 arpeggio up (D F A♭ C), then a B diminished shape down over G7♭9 (B A♭ F D). That lands on E♭, the minor 3rd of C minor. This is the dark sound of minor-key jazz.',
    tip: 'Hear how A♭ belongs to both chords. Hold it a little longer the first few times.',
  },
  {
    id: 'octaves', title: 'Octave melody', cat: 'Classics', level: 2, bpm: 120, key: 'C',
    chords: ['C6', 'C6'],
    notes: '5:3+3:5:1 5:6+3:8:.5 5:7+3:9:.5s 4:5+2:8:1 4:7+2:10:.5 4:5+2:8:.5 5:7+3:9:1 5:3+3:5:3',
    about: 'Wes Montgomery-style octaves: the same note on two strings, two strings apart. Your first finger fretting the low note mutes the string between them, so you can strum all three.',
    tip: 'Pick with your thumb for a warm, round tone. The shape gets one fret wider when the top note moves to the B string.',
  },
  {
    id: 'shuffle', title: 'Boogie shuffle', cat: 'Riffs', level: 1, bpm: 120, key: 'A',
    chords: ['A7', 'A7'],
    notes: '5:0+4:2:.5 5:0+4:2:.5 5:0+4:4:.5 5:0+4:4:.5 5:0+4:2:.5 5:0+4:2:.5 5:0+4:4:.5 5:0+4:4:.5 5:0+4:2:.5 5:0+4:2:.5 5:0+4:4:.5 5:0+4:4:.5 5:0+4:5:.5 5:0+4:5:.5 5:0+4:4:.5 5:0+4:4:.5',
    about: 'The rhythm riff behind thousands of swing and blues tunes. Fret the 5th and 6th over the open A, then reach up to the ♭7.',
    tip: 'Rest the side of your picking hand lightly on the strings near the bridge to mute them. Move it to D7 (strings 4 and 3) and E7 (strings 6 and 5) for a whole blues.',
  },
  {
    id: 'tritones', title: 'Sliding tritones', cat: 'Turnarounds & endings', level: 2, bpm: 110, key: 'A',
    chords: ['A7', 'E7'],
    notes: '3:6+2:8:1 3:5+2:7:1 3:4+2:6:1 3:3+2:5:1 3:2+2:4:1 3:1+2:3:3',
    about: 'The 3rd and ♭7 of A7 (C♯ and G) slide down a fret at a time until they become the 3rd and ♭7 of E7 (G♯ and D). It is the classic way to turn around the end of a blues.',
    tip: 'Keep the same two-finger shape the whole way down. Add the open A string on beat 1 for a bigger sound.',
  },
  {
    id: 'shave', title: 'Shave and a haircut', cat: 'Turnarounds & endings', level: 1, bpm: 130, key: 'C',
    chords: ['C6', ['G7', 'C6']],
    notes: '1:8:1 2:8:.5 2:8:.5 1:5:1 2:8:1 r:1 1:7:1 1:8:1 r:1',
    about: 'The old knock-knock ending (public domain). Swing bands still use it to close a tune with a wink.',
    tip: 'Make the last two notes short and punchy.',
  },
  // ---- harder lines (level 3 = hard, level 4 = Django tier) ----------------------------
  {
    id: 'swing-riff', title: 'C6 swing riff', cat: 'Riffs', level: 1, bpm: 140, key: 'C',
    chords: ['C6', 'C6'],
    notes: '2:5:.5 2:8:.5 1:5:1 2:8:.5 1:5:1.5 2:5:.5 2:8:.5 1:5:.5 1:8:.5 1:5:.5 2:8:.5 2:5:1',
    about: 'A big-band style riff built only from the notes of C6 (C E G A). Riffs like this get repeated over and over by a whole horn section.',
    tip: 'Play it as if you were a trumpet section: short notes, hard accents, lots of swing.',
  },
  {
    id: 'dim-passing', title: 'Diminished passing chord', cat: 'Turnarounds & endings', level: 2, bpm: 150, key: 'C',
    chords: [['C6', 'C#dim7'], ['Dm7', 'G7']],
    notes: '5:3:.5 4:2:.5 4:5:.5 3:2:.5 3:3:.5 2:2:.5 2:5:.5 1:3:.5 1:5:.5 2:6:.5 2:3:.5 3:5:.5 3:4:.5 4:5:.5 4:3:.5 5:5:.5',
    about: 'Spell out each chord of the I – ♯I° – ii – V turnaround: up C6, keep climbing through C♯ diminished, then down Dm7 and G7. The diminished chord is just C6 with the root raised a half step.',
    tip: 'Say the chord name in your head as each new arpeggio starts. That is how you learn to hear the changes.',
  },
  {
    id: 'side-slip', title: 'Side-slip', cat: 'Bebop', level: 3, bpm: 150, key: 'D minor',
    chords: ['Dm7', 'Dm7'],
    notes: '3:7:.5 3:10:.5 2:8:.5 2:10:.5 3:8:.5 3:11:.5 2:9:.5 2:11:.5 2:10:.5 2:8:.5 3:10:.5 3:7:.5 4:10:.5 3:7:1.5',
    about: 'Play a D minor shape, slip the whole shape up a half step for two beats (it sounds “wrong” on purpose), then slide back home. Tension and release, with no new shapes to learn.',
    tip: 'The slipped notes only work if you come back cleanly. Land the return on beat 1 with confidence.',
  },
  {
    id: 'double-enclosure', title: 'Double enclosure', cat: 'Bebop', level: 3, bpm: 170, key: 'C',
    chords: [['Dm7', 'G7'], 'Cmaj7'],
    notes: '3:7:.5 2:6:.5 2:10:.5 1:8:.5 1:7:.5 2:6:.5 3:7:.5 3:8:.5 3:9:.5 2:8:.5 1:7:.5 1:10:.5 1:8:.5 1:7:1.5',
    about: 'Up Dm7, then G7’s 3rd (B) and 7th (F), then a double enclosure into E: the scale note below (D), the half step below (D♯), and land. Then up Em7, which over C sounds like Cmaj9.',
    tip: 'Loop just beat 3 of bar 1 into the next downbeat (B F D D♯ E). Once that flows, the rest is arpeggios.',
  },
  {
    id: 'bird-blues', title: 'Bebop blues line', cat: 'Bebop', level: 3, bpm: 170, key: 'F',
    chords: ['F7', 'Bb7'],
    notes: '1:13:.5 1:12:.5 1:11:.5 1:10:.5 2:13:.5 2:11:.5 2:10:.5 3:12:.5 3:13:.5 3:10:.5 4:12:.5 4:8:.5 4:10:.5 4:12:.5 3:10:1',
    about: 'Charlie Parker-style blues: the F bebop scale straight down, so F, E♭, C and A (all chord tones) fall on the beats. Then A, the 3rd of F7, moves a half step to A♭, the ♭7 of B♭7, and the line walks down B♭7.',
    tip: 'Play the A to A♭ move on its own over the backing first. That one half step is how bebop lines connect chords.',
  },
  {
    id: 'rhythm-a', title: 'Rhythm changes line', cat: 'Bebop', level: 3, bpm: 180, key: 'B♭',
    chords: [['Bb6', 'G7b9'], ['Cm7', 'F7']],
    notes: '4:8:.5 3:7:.5 3:10:.5 2:8:.5 2:9:.5 2:6:.5 3:7:.5 4:9:.5 4:10:.5 3:8:.5 2:8:.5 1:6:.5 1:5:.5 2:6:.5 2:4:.5 3:5:.5',
    about: 'A new chord every two beats, the I–VI–ii–V of “rhythm changes”, the most-played chord sequence in jazz after the blues. Up B♭6, down G7♭9, up Cm7, down F7.',
    tip: 'This one is about stamina at speed. Start it at 120, use Loop and +5 each loop, and stop when it stops being clean.',
  },
  {
    id: 'triplet-blues', title: 'Triplet pull-off cascade', cat: 'Swing blues', level: 3, bpm: 140, key: 'A',
    chords: ['A7', 'D7'],
    notes: '1:8:1/3 1:5:1/3p 2:8:1/3 2:5:1/3p 3:7:1/3 3:5:1/3p 4:7:1/3 4:5:1/3p 5:7:1/3 5:5:1/3p 5:3:1/3p 5:4:1/3h 5:5:.5 4:4:.5 4:7:.5 3:5:.5 3:4:.5 4:7:1.5',
    about: 'The A minor pentatonic box, straight down in triplets with a pull-off on every string, ending with a hammer from C to C♯ (the bluesy minor 3rd to the major 3rd). Then a D7 arpeggio.',
    tip: 'Pick only the first note on each string and let the pull-off sound the second. Keep the pull-offs as loud as the picked notes.',
  },
  {
    id: 'gypsy-251', title: 'Gypsy ii–V–I in G', cat: 'Gypsy jazz', level: 3, bpm: 170, key: 'G',
    chords: [['Am7', 'D7b9'], 'G6'],
    notes: '4:7:.5 3:5:.5 2:5:.5 2:8:.5 1:8:.5 1:5:.5 2:7:.5 2:4:.5 2:3:.5 3:4:.5 2:5:.5 2:3:.5 3:4:.5 3:2:.5 4:5:1',
    about: 'Am7 arpeggio up, then D7♭9 down from its 7th (C A F♯ E♭). The ♭9 (E♭) falls a half step onto D, and the line winds down G6 through its sweet 6th (E) to the root.',
    tip: 'Gypsy style: use downstrokes for every new string, and let the tempo push you. It sounds best a little aggressive.',
  },
  {
    id: 'approach-arp', title: 'Chromatic approach arpeggio', cat: 'Gypsy jazz', level: 3, bpm: 180, key: 'G',
    chords: ['G6', 'G6'],
    notes: '6:3:.5 5:1:.5 5:2:.5 5:4:.5 5:5:.5 4:1:.5 4:2:.5 4:4:.5 4:5:.5 3:3:.5 3:4:.5 2:2:.5 2:3:.5 2:4:.5 2:5:1',
    about: 'A G6 arpeggio (G B D E) up two octaves, with every chord tone approached from a half step below. The chord tones land on the beats and the chromatic notes on the off-beats, a Django favourite.',
    tip: 'Use a slide feel: the chromatic note is a quick lead-in, not a note of its own. Accent the chord tones.',
  },
  {
    id: 'triplet-251', title: 'Triplet ii–V–I', cat: 'ii–V–I', level: 4, bpm: 150, key: 'C',
    chords: [['Dm7', 'G7'], 'Cmaj7'],
    notes: '5:5:1/3 5:8:1/3 4:7:1/3 3:5:1/3 2:5:1/3 2:6:1/3 1:7:1/3 1:5:1/3 2:8:1/3 2:6:1/3 3:7:1/3 3:8:1/3 2:5:1/3 2:8:1/3 1:7:1/3 1:10:1/3 1:8:1/3 1:7:1/3 2:8:2',
    about: 'A whole ii–V–I in triplets: up Dm9, down G7 from its 3rd, a double enclosure (F, D, D♯) into E, then up Cmaj9 and back to G. Continuous triplets at speed are a gypsy jazz signature.',
    tip: 'Accent the first note of each triplet so you never lose beat 1. Slow it to 100 until the position shifts are automatic.',
  },
  {
    id: 'dim-cascade', title: 'Diminished cascade', cat: 'Gypsy jazz', level: 4, bpm: 180, key: 'A minor',
    chords: ['E7b9', 'Am6', 'Am6'],
    notes: '5:2:1/3 5:5:1/3 4:3:1/3 4:6:1/3 3:4:1/3 3:7:1/3 2:6:1/3 2:9:1/3 1:7:1/3 1:10:1/3 1:13:1/3 1:16:1/3 1:17:1 1:12:.5 2:13:.5 2:10:.5 3:11:.5 3:9:.5 4:10:.5 4:7:2 r:2',
    about: 'Django’s trademark: a diminished arpeggio (G♯ B D F) shot up the neck in triplets over E7♭9, moving the same small shape up 3 frets at a time. The top G♯ resolves a half step to A, and the line falls back down Am6.',
    tip: 'Learn one 3-note shape (B D F on strings 5 and 4), then move it. Practise at 100 BPM with Loop on. It only sounds right when every triplet is even.',
  },
  {
    id: 'am6-sweep', title: 'Minor 6 sweep, three octaves', cat: 'Gypsy jazz', level: 4, bpm: 160, key: 'A minor',
    chords: ['Am6', 'Am6'],
    notes: '6:5:1/3 6:8:1/3 5:7:1/3 5:9:1/3 4:7:1/3 4:10:1/3 3:9:1/3 3:11:1/3 2:10:1/3 2:13:1/3 1:12:1/3 1:14:1/3 1:17:1 1:14:1/3 1:12:1/3 2:13:1/3 2:10:1/3 3:11:1/3 3:9:1/3 4:7:1',
    about: 'Am6 (A C E F♯) in triplets from the low A to the high A, three octaves in one bar, two notes per string. Then back down. Pure Django fireworks.',
    tip: 'Sweep: let the pick fall through the strings in one motion on the way up, and use upstrokes on the way down. Mute each string as you leave it.',
  },
  {
    id: 'chrom-cascade', title: 'Chromatic cascade', cat: 'Gypsy jazz', level: 4, bpm: 170, key: 'D minor',
    chords: ['A7b9', 'Dm6'],
    notes: '1:15:1/3 1:14:1/3 1:13:1/3 1:12:1/3 1:11:1/3 1:10:1/3 2:14:1/3 2:13:1/3 2:12:1/3 2:11:1/3 2:10:1/3 3:13:1/3 2:10:.5 2:6:.5 3:7:.5 4:9:.5 4:7:.5 5:8:.5 5:5:1',
    about: 'Twelve chromatic notes straight down in triplets. Because each triplet is three half steps, the beats land on G, E, C♯ and B♭, the notes of A7♭9. Then down a Dm6 arpeggio.',
    tip: 'Fingers 4-3-2-1 on each string, then shift. Keep the shifts silent and the picking even.',
  },
];

// ---- parsing --------------------------------------------------------------------------
const num = s => (s.includes('/') ? s.split('/').reduce((a, b) => +a / +b) : +s);

export function parseNotes(str) {
  const out = []; let b = 0;
  for (const tok of str.trim().split(/\s+/)) {
    const i = tok.lastIndexOf(':');
    const head = tok.slice(0, i), tail = tok.slice(i + 1);
    const m = /^([\d.\/]+)(h|p|s|b2|b)?$/.exec(tail);
    if (!m) throw new Error('bad token ' + tok);
    const d = num(m[1]), tech = m[2] || null;
    if (head === 'r') { out.push({ b, d, rest: true, p: [] }); b += d; continue; }
    const p = head.split('+').map(x => { const [s, f] = x.split(':').map(Number); return { s, f }; });
    out.push({ b, d, tech, p });
    b += d;
  }
  return out;
}

// Chords per beat: [{ b, len, sym }]
export function chordTimeline(chords) {
  const out = [];
  chords.forEach((c, bar) => {
    const list = Array.isArray(c) ? c : [c];
    const each = 4 / list.length;
    list.forEach((sym, k) => out.push({ b: bar * 4 + k * each, len: each, sym }));
  });
  return out;
}
export const chordAt = (tl, b) => tl.find(c => b >= c.b - 1e-6 && b < c.b + c.len - 1e-6) || tl[tl.length - 1];

// Move a lick by n frets (re-keys it). Keeps frets in 0..17; open strings shift too.
export function shiftNotes(notes, n) {
  return notes.map(x => ({ ...x, p: x.p.map(q => ({ s: q.s, f: q.f + n })) }));
}
export const lickById = id => LICKS.find(l => l.id === id);
