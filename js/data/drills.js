// Technique drills use the lick format (see licks.js). Rhythm drills point at a comping
// pattern + progression and show a strum grid to play along with.

function spider(start = 5) {
  const up = [], down = [];
  for (let s = 6; s >= 1; s--) for (let k = 0; k < 4; k++) up.push(`${s}:${start + k}:.5`);
  for (let s = 1; s <= 6; s++) for (let k = 3; k >= 0; k--) down.push(`${s}:${start + k}:.5`);
  return [...up, ...down].join(' ');
}

export const TECH = [
  {
    id: 'spider', title: 'Chromatic spider', level: 1, bpm: 80, chords: Array(6).fill('—'),
    notes: spider(5),
    about: 'One finger per fret (index on 5, pinky on 8), up all six strings and back down. A warm-up for your fretting hand and for strict alternate picking.',
    tip: 'Down, up, down, up, with no exceptions. Keep each finger hovering just above its fret when it is not playing.',
    click: true,
  },
  {
    id: 'arps', title: 'Chord-tone arpeggios', level: 1, bpm: 100, chords: ['Dm7', 'G7', 'Cmaj7', 'Cmaj7'],
    notes: '3:7:.5 2:6:.5 1:5:.5 1:8:.5 1:5:.5 2:6:.5 3:7:.5 2:6:.5 ' +
           '4:5:.5 3:4:.5 3:7:.5 2:6:.5 3:7:.5 3:4:.5 4:5:.5 3:4:.5 ' +
           '3:5:.5 2:5:.5 2:8:.5 1:7:.5 2:8:.5 2:5:.5 3:5:.5 2:5:.5 ' +
           '3:5:4',
    about: 'Root, 3rd, 5th and 7th of each chord in a ii–V–I, all in one position. Soloing starts here: if you can find the chord tones, you can always play something that fits.',
    tip: 'Say the names (“root, three, five, seven”) as you play. Then try starting each chord on its 3rd instead.',
  },
  {
    id: 'guide', title: 'Guide tones', level: 1, bpm: 100, chords: ['Dm7', 'G7', 'Cmaj7', 'Cmaj7', 'Dm7', 'G7', 'Cmaj7', 'Cmaj7'],
    notes: '4:3+3:5:4 4:3+3:4:4 4:2+3:4:4 r:4 5:3+4:3:4 5:2+4:3:4 5:2+4:2:4 r:4',
    about: 'Just the 3rd and 7th of each chord. Two notes are enough to spell out the changes, and each one moves by a half step or not at all. This is how jazz players hear the chords go by.',
    tip: 'Turn the guitar backing off in the player so you only hear bass and drums. Your two notes are the chords now.',
    comp: 'none',
  },
  {
    id: 'enclose-drill', title: 'Enclosure drill', level: 2, bpm: 90, chords: ['Cmaj7', 'Cmaj7'],
    notes: '3:7:1/3 3:4:1/3 3:5:1/3 2:6:1/3 2:4:1/3 2:5:1/3 1:5:1/3 2:7:1/3 2:8:1/3 1:8:1/3 1:6:1/3 1:7:1/3 ' +
           '1:8:1/3 1:6:1/3 1:7:1/3 1:5:1/3 2:7:1/3 2:8:1/3 2:6:1/3 2:4:1/3 2:5:1/3 3:7:1/3 3:4:1/3 3:5:1/3',
    about: 'Every chord tone of Cmaj7 (C, E, G, B) surrounded: the scale note above, the half step below, then the target, as triplets. Up, then back down.',
    tip: 'The target note should land squarely on the beat. Accent it slightly.',
  },
  {
    id: 'octave-drill', title: 'Octave shapes', level: 2, bpm: 90, chords: ['C6', 'F6', 'C6', 'G7'],
    notes: '5:3+3:5:1@13 5:5+3:7:1@13 5:7+3:9:1@13 4:5+2:8:1@14 ' +
           '6:1+4:3:1@13 6:3+4:5:1@13 6:5+4:7:1@13 5:3+3:5:1@13 ' +
           '5:3+3:5:1@13 5:7+3:9:1@13 4:5+2:8:1@14 4:7+2:10:1@14 ' +
           '6:3+4:5:1@13 5:2+3:4:1@13 5:5+3:7:1@13 4:5+2:8:1@14',
    about: 'Melody in octaves through the three shapes: strings 6+4, 5+3 (two frets apart) and 4+2 (three frets apart, because of the B string).',
    tip: 'Strum through the muted middle string. Only the two octave notes should sound.',
  },
  // ---- blues technique -------------------------------------------------------------------
  {
    id: 'bend-tune', title: 'Bend in tune', level: 1, bpm: 70, chords: ['A7', 'A7', 'A7'], groove: 'shuffle',
    notes: '3:9:1 3:7:1b2@3 3:7:1u 3:5:1 2:10:1 2:8:1b2@3 2:8:1u 2:5:1 3:6:1 3:5:1b@3 3:5:1u 4:7:1',
    about: 'Play the target note first, then bend up to match it: E then D bent to E, A then G bent to A, C♯ then C bent a half step. Then release back down. Out-of-tune bends are the most common blues mistake, and this fixes them.',
    tip: 'Bend with the ring finger, with the middle and index behind it pushing too. Push the string toward the ceiling and turn your wrist, as if turning a key.',
  },
  {
    id: 'vibrato', title: 'Wide vibrato', level: 1, bpm: 70, chords: ['A7', 'A7'], groove: 'slow',
    notes: '3:7:2v 2:8:2v 2:10:1v 1:8:1b2 1:8:2u',
    about: 'Long notes with a wide, even vibrato, then vibrato on top of a bend. Albert King, B.B. King and Stevie all had a vibrato you could recognise from one note: it is your voice on the guitar.',
    tip: 'Make the vibrato from the wrist, not the finger, and keep it even: about five or six wobbles a second, in time with the band.',
  },
  {
    id: 'pent-boxes', title: 'Pentatonic boxes 1 and 2', level: 1, bpm: 90, chords: ['A7', 'A7', 'A7', 'A7'], groove: 'shuffle',
    notes: '6:5:.5 6:8:.5 5:5:.5 5:7:.5 4:5:.5 4:7:.5 3:5:.5 3:7:.5 2:5:.5 2:8:.5 1:5:.5 1:8:.5 ' +
           '1:10:.5 1:8:.5 2:10:.5 2:8:.5 3:9:.5 3:7:.5 4:10:.5 4:7:.5 5:10:.5 5:7:.5 6:10:.5 6:8:.5 6:5:4',
    about: 'A minor pentatonic up the first box (5th fret), then down the second box (7th to 10th). Most blues licks live in these two boxes, and the second one is where Albert King and Stevie played their biggest bends.',
    tip: 'Say the note names as you go: A C D E G. Then find the A notes in each box without looking.',
  },
  {
    id: 'bend-pull', title: 'Bend, release, pull-off', level: 2, bpm: 90, chords: ['A7', 'A7'], groove: 'shuffle',
    notes: '3:7:.5b2 3:7:.5u 3:5:.5p 4:7:.5 3:7:.5b2 3:7:.5u 3:5:.5p 4:7:.5 2:8:.5b2 2:8:.5u 2:5:.5p 3:7:.5 2:8:.5b2 2:8:.5u 2:5:.5p 3:7:.5',
    about: 'Pick once, bend up, let it down, pull off to the index: three notes from one pick stroke. Stevie and every Texas player used this to keep lines flowing at speed.',
    tip: 'Only the bend and the last note of each group are picked. Keep the release smooth and pull off sideways so the low note rings.',
  },
  {
    id: 'third-hammer', title: 'Major/minor 3rd hammer', level: 2, bpm: 110, chords: ['E7', 'E7', 'A7', 'A7'], groove: 'shuffle',
    notes: '3:0:.5 3:1:.5h 2:0:.5 1:0:.5 3:0:.5 3:1:.5h 2:0:.5 1:0:.5 4:2:.5 3:0:.5 3:1:.5h 2:0:.5 3:1:.5 4:2:.5 6:0:1 ' +
           '3:5:.5 3:6:.5h 2:5:.5 1:5:.5 3:5:.5 3:6:.5h 2:5:.5 1:5:.5 4:7:.5 3:5:.5 3:6:.5h 2:5:.5 3:6:.5 4:7:.5 5:0:1',
    about: 'Hammer the minor 3rd up to the major 3rd over and over: open G to G♯ for E7, then the same move at the 5th fret for A7. This one small hammer-on is all over Stevie’s rhythm fills.',
    tip: 'In open position the index hammers the G♯ (it is the same finger as in an open E chord); at the 5th fret the middle does it. Keep the hammering finger close to the string and let the other strings ring.',
  },
  {
    id: 'maj-min-pent', title: 'Major and minor pentatonic', level: 2, bpm: 90, chords: ['A7', 'A7', 'A7', 'A7'], groove: 'shuffle',
    notes: '6:5:.5 6:8:.5 5:5:.5 5:7:.5 4:5:.5 4:7:.5 3:5:.5 3:7:.5 2:5:.5 2:8:.5 1:5:.5 1:8:.5 ' +
           '6:2:.5 6:5:.5 5:2:.5 5:4:.5 4:2:.5 4:4:.5 3:2:.5 3:4:.5 2:2:.5 2:5:.5 1:2:.5 1:5:.5 6:5:4',
    about: 'The same A, two scales: A minor pentatonic at the 5th fret (A C D E G, gritty) and A major pentatonic three frets lower (A B C♯ E F♯, sweet). Blues players, Stevie most of all, switch between them all the time over a dominant 7th chord.',
    tip: 'Play it with the band and listen to how different the two bars sound over the same A7.',
  },
  {
    id: 'trill-ladder', title: 'Trill speed ladder', level: 2, bpm: 60, chords: ['E7', 'E7', 'E7', 'E7'], groove: 'slow',
    notes: '1:12:.5 1:15:.5h 1:12:.5p 1:15:.5h 1:12:.5p 1:15:.5h 1:12:.5p 1:15:.5h ' +
           '1:12:1/3 1:15:1/3h 1:12:1/3p 1:15:1/3h 1:12:1/3p 1:15:1/3h 1:12:1/3p 1:15:1/3h 1:12:1/3p 1:15:1/3h 1:12:1/3p 1:15:1/3h ' +
           '1:12:1/4 1:15:1/4h 1:12:1/4p 1:15:1/4h 1:12:1/4p 1:15:1/4h 1:12:1/4p 1:15:1/4h 1:12:1/4p 1:15:1/4h 1:12:1/4p 1:15:1/4h 1:12:1/4p 1:15:1/4h 1:12:1/4p 1:15:1/4h ' +
           '1:12:4v',
    about: 'A trill between E and G (the root and minor 3rd), getting faster every bar: 8th notes, triplets, then 16ths. Pick only the first note of each bar; hammer-ons and pull-offs do the rest.',
    tip: 'Keep the index planted at the 12th fret. If the notes get quieter, pull off a little sideways to pluck the string.',
  },
];

export const RHYTHM = [
  { id: 'r-four', title: 'Four to the bar', comp: 'four', prog: 'turn', bpm: 140,
    grid: ['D', '', 'D', '', 'D', '', 'D', ''], accent: [2, 6],
    about: 'Freddie Green, the Count Basie Orchestra’s guitarist, played like this for 50 years. Short downstrokes on every beat, a little heavier on 2 and 4. Loosen your fretting hand right after each strum so the chord stops.',
    tip: 'Use the 3-note shells from the Chords tab. Lock in with the hi-hat on 2 and 4.' },
  { id: 'r-charleston', title: 'Charleston', comp: 'charleston', prog: '251', bpm: 130,
    grid: ['D', '', '', 'U', '', '', '', ''], accent: [0],
    about: 'A long hit on 1, then a short one on the “and” of 2. It is the most common comping rhythm in swing and bebop.',
    tip: 'Count out loud: “ONE two-AND three four”.' },
  { id: 'r-pompe', title: 'La pompe', comp: 'pompe', prog: 'minor-swing', bpm: 160,
    grid: ['D', 'u', 'D', '', 'D', 'u', 'D', ''], accent: [2, 6],
    about: 'The gypsy-jazz engine: a soft low strum on 1 and 3, a quick upstroke just before 2 and 4, then a sharp downstroke that you choke right away.',
    tip: 'All the drive comes from 2 and 4 being short. Squeeze, then release.' },
  { id: 'r-push', title: 'Push the 4', comp: 'push', prog: 'blues', bpm: 120,
    grid: ['D', '', '', '', '', '', '', 'U'], accent: [7],
    about: 'Hit on beat 1, then again on the “and” of 4, and let it ring into the next bar. The next chord arrives an 8th note early, which gives the time a forward lean.',
    tip: 'On the push, play the NEXT bar’s chord.' },
  { id: 'r-shuffle', title: 'Shuffle 8ths', comp: 'none', prog: 'blues-a', bpm: 110, lick: 'shuffle', groove: 'shuffle',
    grid: ['D', 'D', 'D', 'D', 'D', 'D', 'D', 'D'], accent: [2, 6],
    about: 'The boogie riff over the whole 12-bar blues. Move the shape: A7 on strings 5+4, D7 on 4+3, E7 on 6+5.',
    tip: 'All downstrokes, with your picking hand palm muting the strings. Swing the 8ths hard.' },
];
