// Technique drills use the lick format (see licks.js). Rhythm drills point at a comping
// pattern + progression and show a strum grid to play along with.

function spider(start = 5) {
  const up = [], down = [];
  for (let s = 6; s >= 1; s--) for (let k = 0; k < 4; k++) up.push(`${s}:${start + k}:.5`);
  for (let s = 1; s <= 6; s++) for (let k = 3; k >= 0; k--) down.push(`${s}:${start + k}:.5`);
  return [...up, ...down].join(' ');
}

export const TCATS = ['Jazz', 'Blues', 'Sweep picking', 'Strength & dexterity'];

export const TECH = [
  {
    id: 'spider', cat: 'Strength & dexterity', title: 'Chromatic spider', level: 1, bpm: 80, chords: Array(6).fill('—'),
    notes: spider(5),
    about: 'One finger per fret (index on 5, pinky on 8), up all six strings and back down. A warm-up for your fretting hand and for strict alternate picking.',
    tip: 'Down, up, down, up, with no exceptions. Keep each finger hovering just above its fret when it is not playing.',
    click: true,
  },
  {
    id: 'arps', cat: 'Jazz', title: 'Chord-tone arpeggios', level: 1, bpm: 100, chords: ['Dm7', 'G7', 'Cmaj7', 'Cmaj7'],
    notes: '3:7:.5 2:6:.5 1:5:.5 1:8:.5 1:5:.5 2:6:.5 3:7:.5 2:6:.5 ' +
           '4:5:.5 3:4:.5 3:7:.5 2:6:.5 3:7:.5 3:4:.5 4:5:.5 3:4:.5 ' +
           '3:5:.5 2:5:.5 2:8:.5 1:7:.5 2:8:.5 2:5:.5 3:5:.5 2:5:.5 ' +
           '3:5:4',
    about: 'Root, 3rd, 5th and 7th of each chord in a ii–V–I, all in one position. Soloing starts here: if you can find the chord tones, you can always play something that fits.',
    tip: 'Say the names (“root, three, five, seven”) as you play. Then try starting each chord on its 3rd instead.',
  },
  {
    id: 'guide', cat: 'Jazz', title: 'Guide tones', level: 1, bpm: 100, chords: ['Dm7', 'G7', 'Cmaj7', 'Cmaj7', 'Dm7', 'G7', 'Cmaj7', 'Cmaj7'],
    notes: '4:3+3:5:4 4:3+3:4:4 4:2+3:4:4 r:4 5:3+4:3:4 5:2+4:3:4 5:2+4:2:4 r:4',
    about: 'Just the 3rd and 7th of each chord. Two notes are enough to spell out the changes, and each one moves by a half step or not at all. This is how jazz players hear the chords go by.',
    tip: 'Turn the guitar backing off in the player so you only hear bass and drums. Your two notes are the chords now.',
    comp: 'none',
  },
  {
    id: 'enclose-drill', cat: 'Jazz', title: 'Enclosure drill', level: 2, bpm: 90, chords: ['Cmaj7', 'Cmaj7'],
    notes: '3:7:1/3 3:4:1/3 3:5:1/3 2:6:1/3 2:4:1/3 2:5:1/3 1:5:1/3 2:7:1/3 2:8:1/3 1:8:1/3 1:6:1/3 1:7:1/3 ' +
           '1:8:1/3 1:6:1/3 1:7:1/3 1:5:1/3 2:7:1/3 2:8:1/3 2:6:1/3 2:4:1/3 2:5:1/3 3:7:1/3 3:4:1/3 3:5:1/3',
    about: 'Every chord tone of Cmaj7 (C, E, G, B) surrounded: the scale note above, the half step below, then the target, as triplets. Up, then back down.',
    tip: 'The target note should land squarely on the beat. Accent it slightly.',
  },
  {
    id: 'octave-drill', cat: 'Jazz', title: 'Octave shapes', level: 2, bpm: 90, chords: ['C6', 'F6', 'C6', 'G7'],
    notes: '5:3+3:5:1@13 5:5+3:7:1@13 5:7+3:9:1@13 4:5+2:8:1@14 ' +
           '6:1+4:3:1@13 6:3+4:5:1@13 6:5+4:7:1@13 5:3+3:5:1@13 ' +
           '5:3+3:5:1@13 5:7+3:9:1@13 4:5+2:8:1@14 4:7+2:10:1@14 ' +
           '6:3+4:5:1@13 5:2+3:4:1@13 5:5+3:7:1@13 4:5+2:8:1@14',
    about: 'Melody in octaves through the three shapes: strings 6+4, 5+3 (two frets apart) and 4+2 (three frets apart, because of the B string).',
    tip: 'Strum through the muted middle string. Only the two octave notes should sound.',
  },
  // ---- blues technique -------------------------------------------------------------------
  {
    id: 'bend-tune', cat: 'Blues', title: 'Bend in tune', level: 1, bpm: 70, chords: ['A7', 'A7', 'A7'], groove: 'shuffle',
    notes: '3:9:1 3:7:1b2@3 3:7:1u 3:5:1 2:10:1 2:8:1b2@3 2:8:1u 2:5:1 3:6:1 3:5:1b@3 3:5:1u 4:7:1',
    about: 'Play the target note first, then bend up to match it: E then D bent to E, A then G bent to A, C♯ then C bent a half step. Then release back down. Out-of-tune bends are the most common blues mistake, and this fixes them.',
    tip: 'Bend with the ring finger, with the middle and index behind it pushing too. Push the string toward the ceiling and turn your wrist, as if turning a key.',
  },
  {
    id: 'vibrato', cat: 'Blues', title: 'Wide vibrato', level: 1, bpm: 70, chords: ['A7', 'A7'], groove: 'slow',
    notes: '3:7:2v 2:8:2v 2:10:1v 1:8:1b2 1:8:2u',
    about: 'Long notes with a wide, even vibrato, then vibrato on top of a bend. Albert King, B.B. King and Stevie all had a vibrato you could recognise from one note: it is your voice on the guitar.',
    tip: 'Make the vibrato from the wrist, not the finger, and keep it even: about five or six wobbles a second, in time with the band.',
  },
  {
    id: 'pent-boxes', cat: 'Blues', title: 'Pentatonic boxes 1 and 2', level: 1, bpm: 90, chords: ['A7', 'A7', 'A7', 'A7'], groove: 'shuffle',
    notes: '6:5:.5 6:8:.5 5:5:.5 5:7:.5 4:5:.5 4:7:.5 3:5:.5 3:7:.5 2:5:.5 2:8:.5 1:5:.5 1:8:.5 ' +
           '1:10:.5 1:8:.5 2:10:.5 2:8:.5 3:9:.5 3:7:.5 4:10:.5 4:7:.5 5:10:.5 5:7:.5 6:10:.5 6:8:.5 6:5:4',
    about: 'A minor pentatonic up the first box (5th fret), then down the second box (7th to 10th). Most blues licks live in these two boxes, and the second one is where Albert King and Stevie played their biggest bends.',
    tip: 'Say the note names as you go: A C D E G. Then find the A notes in each box without looking.',
  },
  {
    id: 'bend-pull', cat: 'Blues', title: 'Bend, release, pull-off', level: 2, bpm: 90, chords: ['A7', 'A7'], groove: 'shuffle',
    notes: '3:7:.5b2 3:7:.5u 3:5:.5p 4:7:.5 3:7:.5b2 3:7:.5u 3:5:.5p 4:7:.5 2:8:.5b2 2:8:.5u 2:5:.5p 3:7:.5 2:8:.5b2 2:8:.5u 2:5:.5p 3:7:.5',
    about: 'Pick once, bend up, let it down, pull off to the index: three notes from one pick stroke. Stevie and every Texas player used this to keep lines flowing at speed.',
    tip: 'Only the bend and the last note of each group are picked. Keep the release smooth and pull off sideways so the low note rings.',
  },
  {
    id: 'third-hammer', cat: 'Blues', title: 'Major/minor 3rd hammer', level: 2, bpm: 110, chords: ['E7', 'E7', 'A7', 'A7'], groove: 'shuffle',
    notes: '3:0:.5 3:1:.5h 2:0:.5 1:0:.5 3:0:.5 3:1:.5h 2:0:.5 1:0:.5 4:2:.5 3:0:.5 3:1:.5h 2:0:.5 3:1:.5 4:2:.5 6:0:1 ' +
           '3:5:.5 3:6:.5h 2:5:.5 1:5:.5 3:5:.5 3:6:.5h 2:5:.5 1:5:.5 4:7:.5 3:5:.5 3:6:.5h 2:5:.5 3:6:.5 4:7:.5 5:0:1',
    about: 'Hammer the minor 3rd up to the major 3rd over and over: open G to G♯ for E7, then the same move at the 5th fret for A7. This one small hammer-on is all over Stevie’s rhythm fills.',
    tip: 'In open position the index hammers the G♯ (it is the same finger as in an open E chord); at the 5th fret the middle does it. Keep the hammering finger close to the string and let the other strings ring.',
  },
  {
    id: 'maj-min-pent', cat: 'Blues', title: 'Major and minor pentatonic', level: 2, bpm: 90, chords: ['A7', 'A7', 'A7', 'A7'], groove: 'shuffle',
    notes: '6:5:.5 6:8:.5 5:5:.5 5:7:.5 4:5:.5 4:7:.5 3:5:.5 3:7:.5 2:5:.5 2:8:.5 1:5:.5 1:8:.5 ' +
           '6:2:.5 6:5:.5 5:2:.5 5:4:.5 4:2:.5 4:4:.5 3:2:.5 3:4:.5 2:2:.5 2:5:.5 1:2:.5 1:5:.5 6:5:4',
    about: 'The same A, two scales: A minor pentatonic at the 5th fret (A C D E G, gritty) and A major pentatonic three frets lower (A B C♯ E F♯, sweet). Blues players, Stevie most of all, switch between them all the time over a dominant 7th chord.',
    tip: 'Play it with the band and listen to how different the two bars sound over the same A7.',
  },
  {
    id: 'trill-ladder', cat: 'Blues', title: 'Trill speed ladder', level: 2, bpm: 60, chords: ['E7', 'E7', 'E7', 'E7'], groove: 'slow',
    notes: '1:12:.5 1:15:.5h 1:12:.5p 1:15:.5h 1:12:.5p 1:15:.5h 1:12:.5p 1:15:.5h ' +
           '1:12:1/3 1:15:1/3h 1:12:1/3p 1:15:1/3h 1:12:1/3p 1:15:1/3h 1:12:1/3p 1:15:1/3h 1:12:1/3p 1:15:1/3h 1:12:1/3p 1:15:1/3h ' +
           '1:12:1/4 1:15:1/4h 1:12:1/4p 1:15:1/4h 1:12:1/4p 1:15:1/4h 1:12:1/4p 1:15:1/4h 1:12:1/4p 1:15:1/4h 1:12:1/4p 1:15:1/4h 1:12:1/4p 1:15:1/4h 1:12:1/4p 1:15:1/4h ' +
           '1:12:4v',
    about: 'A trill between E and G (the root and minor 3rd), getting faster every bar: 8th notes, triplets, then 16ths. Pick only the first note of each bar; hammer-ons and pull-offs do the rest.',
    tip: 'Keep the index planted at the 12th fret. If the notes get quieter, pull off a little sideways to pluck the string.',
  },
  {
    id: 'pent-threes', cat: 'Blues', title: 'Pentatonic in threes', level: 2, bpm: 80, chords: ['A7', 'A7', 'A7'], groove: 'shuffle',
    notes: '1:8:1/3 1:5:1/3 2:8:1/3 1:5:1/3 2:8:1/3 2:5:1/3 2:8:1/3 2:5:1/3 3:7:1/3 2:5:1/3 3:7:1/3 3:5:1/3 ' +
           '3:7:1/3 3:5:1/3 4:7:1/3 3:5:1/3 4:7:1/3 4:5:1/3 4:7:1/3 4:5:1/3 5:7:1/3 4:5:1/3 5:7:1/3 5:5:1/3 ' +
           '5:7:1/3 5:5:1/3 6:8:1/3 5:5:1/3 6:8:1/3 6:5:1/3 6:5:2',
    about: 'Down the A minor pentatonic in groups of three: three notes down, step back one, three more. Sequences like this are how blues players build fast runs that don’t sound like a scale. Each group is one triplet beat.',
    tip: 'Accent the first note of every group. Alternate pick strictly, down-up-down, up-down-up.',
  },
  {
    id: 'blues-scale', cat: 'Blues', title: 'Blues scale, box 1', level: 1, bpm: 90, chords: ['A7', 'A7', 'A7', 'A7'], groove: 'shuffle',
    notes: '6:5:.5 6:8:.5 5:5:.5 5:6:.5 5:7:.5 4:5:.5 4:7:.5 3:5:.5 3:7:.5 3:8:.5 2:5:.5 2:8:.5 1:5:.5 1:8:.5 1:5:1 ' +
           '1:8:.5 1:5:.5 2:8:.5 2:5:.5 3:8:.5 3:7:.5 3:5:.5 4:7:.5 4:5:.5 5:7:.5 5:6:.5 5:5:.5 6:8:.5 6:5:.5 6:5:1',
    about: 'The minor pentatonic plus one note, the ♭5 (E♭): A C D E♭ E G. The ♭5 is a passing note: slip through it on the way between D and E, never sit on it. Stevie used it constantly in his fast runs.',
    tip: 'Index at the 5th fret, ring on the 7th, pinky on the 8th; the E♭ on the A and G strings goes to the middle finger.',
  },
  {
    id: 'blues-arps', cat: 'Blues', title: 'Blues chord arpeggios', level: 2, bpm: 90, chords: ['A7', 'D7', 'A7', 'E7'], groove: 'shuffle',
    notes: '6:5:.5 5:4:.5 5:7:.5 4:5:.5 4:7:.5 3:6:.5 2:5:.5 3:6:.5 ' +
           '5:5:.5 4:4:.5 4:7:.5 3:5:.5 3:7:.5 2:7:.5 1:5:.5 2:7:.5 ' +
           '6:5:.5 5:4:.5 5:7:.5 4:5:.5 4:7:.5 3:6:.5 2:5:.5 3:6:.5 ' +
           '5:7:.5 4:6:.5 3:4:.5 3:7:.5 2:5:.5 1:4:.5 2:5:.5 1:4:.5',
    about: 'Root, 3rd, 5th and ♭7 of each chord of the blues, all around the 5th fret: A7 (A C♯ E G), D7 (D F♯ A C), E7 (E G♯ B D). The pentatonic box gets you through the blues; the chord tones make each change sound on purpose.',
    tip: 'Find the 3rd of each chord (C♯, F♯, G♯) and remember where it lives. Those three notes are what the band is playing.',
  },
  {
    id: 'vib-fingers', cat: 'Blues', title: 'Vibrato with every finger', level: 1, bpm: 70, chords: ['A7', 'A7'], groove: 'slow',
    notes: '2:5:1v@1 2:6:1v@2 2:7:1v@3 2:8:1v@4 2:8:1v@4 2:7:1v@3 2:6:1v@2 2:5:1v@1',
    about: 'Most players only have vibrato on one finger. Stevie and B.B. King could make any note sing. Hold each note for a beat and shake it with a different finger each time, index to pinky and back.',
    tip: 'Make the vibrato come from the wrist rocking, not the finger wiggling. The weak fingers get help from the ones behind them on the string.',
  },
  // ---- sweep picking ----------------------------------------------------------------------
  {
    id: 'sweep-3', cat: 'Sweep picking', title: 'Three-string sweeps', level: 3, bpm: 60, chords: ['Am', 'F', 'C', 'G'],
    notes: '3:14:1/3 2:13:1/3 1:12:1/3 1:12:1/3 2:13:1/3 3:14:1/3 3:14:1/3 2:13:1/3 1:12:1/3 1:12:1/3 2:13:1/3 3:14:1/3 3:14:1/3 2:13:1/3 1:13:1/3 1:13:1/3 ' +
           '2:13:1/3 3:14:1/3 3:14:1/3 2:13:1/3 1:13:1/3 1:13:1/3 2:13:1/3 3:14:1/3 3:12:1/3 2:13:1/3 1:12:1/3 1:12:1/3 2:13:1/3 3:12:1/3 3:12:1/3 2:13:1/3 ' +
           '1:12:1/3 1:12:1/3 2:13:1/3 3:12:1/3 3:16:1/3 2:15:1/3 1:15:1/3 1:15:1/3 2:15:1/3 3:16:1/3 3:16:1/3 2:15:1/3 1:15:1/3 1:15:1/3 2:15:1/3 3:16:1/3',
    about: 'Sweep picking plays one note per string with a single stroke of the pick, like a slow-motion strum. Start with three strings: each triad up (down-down-down) then back down (up-up-up). Am, F, C and G all live around the 12th fret.',
    tip: 'Let the pick fall through the strings in one motion; don’t pick each note separately. Lift each fretting finger as soon as its note has sounded, or the notes blur into a chord. Where two notes share a fret, roll one finger across both strings.',
  },
  {
    id: 'sweep-5', cat: 'Sweep picking', title: 'Five-string minor sweeps', level: 4, bpm: 50, chords: ['Am', 'Dm', 'Am'],
    notes: '5:12:.25@1 4:14:.25@3 3:14:.25@3 2:13:.25@2 1:12:.25@1 1:17:.25s@1 1:12:.25s@1 2:13:.25@2 3:14:.25@3 4:14:.25@3 5:12:.5@1 r:1 5:5:.25@1 4:7:.25@3 3:7:.25@3 2:6:.25@2 ' +
           '1:5:.25@1 1:10:.25s@1 1:5:.25s@1 2:6:.25@2 3:7:.25@3 4:7:.25@3 5:5:.5@1 r:1 5:12:.25@1 4:14:.25@3 3:14:.25@3 2:13:.25@2 1:12:.25@1 1:17:.75s@1 r:2',
    about: 'The classic five-string minor arpeggio: root on the A string, up through A E A C E, slide up to the top A, and sweep back down. The same shape moves to D minor at the 5th fret.',
    tip: 'Index on the A string, ring rolling across the D and G strings, middle on the B, index again on the top string where it slides up and back. Down-strokes all the way up, up-strokes all the way down. Practise at half speed until every note is separate.',
  },
  {
    id: 'sweep-dim', cat: 'Sweep picking', title: 'Diminished sweeps', level: 4, bpm: 56, chords: ['A7b9', 'A7b9', 'A7b9', 'A7b9'],
    notes: '4:2:.25 3:3:.25 2:2:.25 1:3:.25 1:3:.25 2:2:.25 3:3:.25 4:2:.25 4:5:.25 3:6:.25 2:5:.25 1:6:.25 1:6:.25 2:5:.25 3:6:.25 4:5:.25 ' +
           '4:8:.25 3:9:.25 2:8:.25 1:9:.25 1:9:.25 2:8:.25 3:9:.25 4:8:.25 4:11:.25 3:12:.25 2:11:.25 1:12:.25 1:12:.25 2:11:.25 3:12:.25 4:11:.25 ' +
           '4:8:.25 3:9:.25 2:8:.25 1:9:.25 1:9:.25 2:8:.25 3:9:.25 4:8:.25 4:5:.25 3:6:.25 2:5:.25 1:6:.25 1:6:.25 2:5:.25 3:6:.25 4:5:.25 ' +
           '4:2:.25 3:3:.25 2:2:.25 1:3:.25 1:3:.25 2:2:.25 3:3:.25 4:2:.25 4:2:2',
    about: 'A diminished 7th arpeggio on four strings (E B♭ C♯ G), moved up three frets at a time: the shape repeats every minor 3rd. Over A7 it gives the A7♭9 sound that gypsy-jazz players sweep through constantly.',
    tip: 'One shape, four positions, never a stretch. Sweep down through the four strings, then back up, in one motion each.',
  },
  // ---- strength & dexterity ---------------------------------------------------------------
  {
    id: 'perms', cat: 'Strength & dexterity', title: 'Finger permutations', level: 2, bpm: 60, chords: Array(4).fill('—'),
    notes: '6:5:.25@1 6:7:.25@3 6:6:.25@2 6:8:.25@4 5:5:.25@1 5:7:.25@3 5:6:.25@2 5:8:.25@4 4:5:.25@1 4:7:.25@3 4:6:.25@2 4:8:.25@4 3:5:.25@1 3:7:.25@3 3:6:.25@2 3:8:.25@4 ' +
           '2:5:.25@1 2:7:.25@3 2:6:.25@2 2:8:.25@4 1:5:.25@1 1:7:.25@3 1:6:.25@2 1:8:.25@4 1:8:.25@4 1:6:.25@2 1:7:.25@3 1:5:.25@1 2:8:.25@4 2:6:.25@2 2:7:.25@3 2:5:.25@1 ' +
           '3:8:.25@4 3:6:.25@2 3:7:.25@3 3:5:.25@1 4:8:.25@4 4:6:.25@2 4:7:.25@3 4:5:.25@1 5:8:.25@4 5:6:.25@2 5:7:.25@3 5:5:.25@1 6:8:.25@4 6:6:.25@2 6:7:.25@3 6:5:.25@1 ' +
           '6:5:.25@1 6:8:.25@4 6:6:.25@2 6:7:.25@3 5:5:.25@1 5:8:.25@4 5:6:.25@2 5:7:.25@3 4:5:.25@1 4:8:.25@4 4:6:.25@2 4:7:.25@3 3:5:.25@1 3:8:.25@4 3:6:.25@2 3:7:.25@3',
    about: 'One finger per fret at the 5th position, but in scrambled orders: 1-3-2-4 across the strings, 4-2-3-1 back, then 1-4-2-3. Breaking the 1-2-3-4 habit is what makes each finger independent.',
    tip: 'Keep every finger hovering just above its fret, never flying off. Alternate pick strictly. When it is clean three times in a row, go up 5 BPM.',
  },
  {
    id: 'spider-walk', cat: 'Strength & dexterity', title: 'Spider walk down the neck', level: 2, bpm: 60, chords: Array(4).fill('—'),
    notes: '6:9:.25@1 6:10:.25@2 6:11:.25@3 6:12:.25@4 5:8:.25@1 5:9:.25@2 5:10:.25@3 5:11:.25@4 4:7:.25@1 4:8:.25@2 4:9:.25@3 4:10:.25@4 3:6:.25@1 3:7:.25@2 3:8:.25@3 3:9:.25@4 ' +
           '2:5:.25@1 2:6:.25@2 2:7:.25@3 2:8:.25@4 1:4:.25@1 1:5:.25@2 1:6:.25@3 1:7:.25@4 1:8:.25@4 1:7:.25@3 1:6:.25@2 1:5:.25@1 2:9:.25@4 2:8:.25@3 2:7:.25@2 2:6:.25@1 ' +
           '3:10:.25@4 3:9:.25@3 3:8:.25@2 3:7:.25@1 4:11:.25@4 4:10:.25@3 4:9:.25@2 4:8:.25@1 5:12:.25@4 5:11:.25@3 5:10:.25@2 5:9:.25@1 6:13:.25@4 6:12:.25@3 6:11:.25@2 6:10:.25@1 ' +
           '6:10:4@1',
    about: 'The chromatic spider, but the hand moves down a fret on every string, from the 9th position on the low E to the 4th on the high E, then climbs back up. Frets get wider lower down, so the stretch grows.',
    tip: 'Shift the whole hand on the first note of each string, thumb behind the neck. Don’t let the pinky collapse at the low frets.',
  },
  {
    id: 'skip-spider', cat: 'Strength & dexterity', title: 'String-skipping spider', level: 3, bpm: 60, chords: Array(4).fill('—'),
    notes: '6:5:.25@1 6:6:.25@2 6:7:.25@3 6:8:.25@4 4:5:.25@1 4:6:.25@2 4:7:.25@3 4:8:.25@4 2:5:.25@1 2:6:.25@2 2:7:.25@3 2:8:.25@4 5:5:.25@1 5:6:.25@2 5:7:.25@3 5:8:.25@4 ' +
           '3:5:.25@1 3:6:.25@2 3:7:.25@3 3:8:.25@4 1:5:.25@1 1:6:.25@2 1:7:.25@3 1:8:.25@4 1:8:.25@4 1:7:.25@3 1:6:.25@2 1:5:.25@1 3:8:.25@4 3:7:.25@3 3:6:.25@2 3:5:.25@1 ' +
           '5:8:.25@4 5:7:.25@3 5:6:.25@2 5:5:.25@1 2:8:.25@4 2:7:.25@3 2:6:.25@2 2:5:.25@1 4:8:.25@4 4:7:.25@3 4:6:.25@2 4:5:.25@1 6:8:.25@4 6:7:.25@3 6:6:.25@2 6:5:.25@1 ' +
           '6:5:4@1',
    about: 'Frets 5 to 8, one finger per fret, but jumping strings: 6, 4, 2, then 5, 3, 1, and back. Skipping strings builds accurate picking and teaches the fingers to land without looking.',
    tip: 'Mute the strings you skip with the side of the picking hand and the underside of the fretting fingers. Slow and silent beats fast and noisy.',
  },
  {
    id: 'weak-trills', cat: 'Strength & dexterity', title: 'Weak-finger trills', level: 2, bpm: 60, chords: Array(4).fill('—'),
    notes: '2:7:.25@3 2:8:.25h@4 2:7:.25p@3 2:8:.25h@4 2:7:.25p@3 2:8:.25h@4 2:7:.25p@3 2:8:.25h@4 2:7:.25p@3 2:8:.25h@4 2:7:.25p@3 2:8:.25h@4 2:7:.25p@3 2:8:.25h@4 2:7:.25p@3 2:8:.25h@4 ' +
           '2:6:.25@2 2:8:.25h@4 2:6:.25p@2 2:8:.25h@4 2:6:.25p@2 2:8:.25h@4 2:6:.25p@2 2:8:.25h@4 2:6:.25p@2 2:8:.25h@4 2:6:.25p@2 2:8:.25h@4 2:6:.25p@2 2:8:.25h@4 2:6:.25p@2 2:8:.25h@4 ' +
           '2:6:.25@2 2:7:.25h@3 2:6:.25p@2 2:7:.25h@3 2:6:.25p@2 2:7:.25h@3 2:6:.25p@2 2:7:.25h@3 2:6:.25p@2 2:7:.25h@3 2:6:.25p@2 2:7:.25h@3 2:6:.25p@2 2:7:.25h@3 2:6:.25p@2 2:7:.25h@3 ' +
           '2:5:.25@1 2:8:.25h@4 2:5:.25p@1 2:8:.25h@4 2:5:.25p@1 2:8:.25h@4 2:5:.25p@1 2:8:.25h@4 2:5:.25p@1 2:8:.25h@4 2:5:.25p@1 2:8:.25h@4 2:5:.25p@1 2:8:.25h@4 2:5:.25p@1 2:8:.25h@4',
    about: 'A bar of 16th-note trills for each of the hardest finger pairs: ring and pinky (3-4), middle and pinky (2-4), middle and ring (2-3), then index and pinky (1-4). Pick only the first note of each bar.',
    tip: 'Hammer from above the string, don’t just press. Pull off with a small sideways flick. If the notes fade, rest: tired tendons are how injuries start.',
  },
  {
    id: 'hammer-only', cat: 'Strength & dexterity', title: 'Hammer-ons from nowhere', level: 3, bpm: 60, chords: Array(2).fill('—'),
    notes: '6:5:.25@1 6:6:.25h@2 6:7:.25h@3 6:8:.25h@4 5:5:.25h@1 5:6:.25h@2 5:7:.25h@3 5:8:.25h@4 4:5:.25h@1 4:6:.25h@2 4:7:.25h@3 4:8:.25h@4 3:5:.25h@1 3:6:.25h@2 3:7:.25h@3 3:8:.25h@4 ' +
           '2:5:.25h@1 2:6:.25h@2 2:7:.25h@3 2:8:.25h@4 1:5:.25h@1 1:6:.25h@2 1:7:.25h@3 1:8:.25h@4 1:8:2@4',
    about: 'Pick the very first note, then never pick again: every other note is hammered, even the first note on each new string (a “hammer-on from nowhere”). Only finger strength makes the notes sound.',
    tip: 'Each finger lands right behind the fret, hard and fast. Keep the volume even: the index notes on each new string are the weak ones.',
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
  { id: 'r-chops', title: 'Chops on 2 and 4', comp: 'chops', prog: 'blues-a', bpm: 110, groove: 'shuffle', bass: 'walk', drums: 'hat',
    grid: ['', '', 'D', '', '', '', 'D', ''], accent: [2, 6],
    about: 'Leave beats 1 and 3 empty and hit only 2 and 4, short and dry, like a snare drum. R&B and jump-blues guitarists lived here, and it trains you to feel the backbeat.',
    tip: 'Strum, then instantly relax your fretting fingers so the chord stops. The silence after the chop is the groove.' },
  { id: 'r-folk', title: 'Folk strum', comp: 'folk', prog: 'doowop', bpm: 96, swing: 0.5, bass: 'two', drums: 'rock',
    grid: ['D', '', 'D', 'U', '', 'U', 'D', 'U'], accent: [0, 2, 6],
    about: 'Down, down-up, (miss), up, down-up. Your hand never stops: it swings down on every beat and up on every “and”, and only touches the strings on the marked strokes. This is the strum on countless Beatles records.',
    tip: 'Say “down, down-up, up-down-up”. The missed down-stroke on beat 3 is what makes it bounce. Use the Open chords.' },
  { id: 'r-travis', title: 'Travis picking', comp: 'travis', prog: 'three-chord', bpm: 80, swing: 0.5, bass: 'none', drums: 'none',
    grid: ['P', 'F', 'T', 'F', 'T', 'F', 'T', 'F'], accent: [0, 2, 4, 6],
    about: 'T = thumb, F = finger, P = pinch (thumb and finger together). The thumb keeps a steady bass on every beat, alternating between the root string and a higher string, while the fingers pick the top strings in between. Chet Atkins and Merle Travis made it famous, and George Harrison learned it from their records.',
    tip: 'Get the thumb going alone first, root then the D or G string, until it runs on autopilot. Then add one finger note on the “and” of beat 2.' },
  { id: 'r-arp', title: 'Ringing arpeggios', comp: 'arp', prog: 'line-minor', bpm: 76, swing: 0.5, bass: 'two', drums: 'none',
    grid: ['1', '2', '3', '4', '5', '4', '3', '2'], accent: [0],
    about: 'Pick the chord one string at a time, low to high and back down, and let every note ring into the next. The inner line falls A, G♯, G, F♯ while the outside of the chord stays put: watch it in the chord box.',
    tip: 'Hold the whole chord shape down before you start picking it. Numbers are the order of the strings from the bass up.' },
  { id: 'r-bossa', title: 'Bossa nova', comp: 'bossa', prog: 'bossa-251', bpm: 120, swing: 0.5, bass: 'two', drums: 'brush',
    grid: ['P', '', '', 'F', 'T', '', 'F', ''], accent: [0, 3, 6],
    about: 'The thumb plays the bass on 1 and 3 while the fingers pluck the top of the chord on a syncopated pattern. Bar one: 1, the “and” of 2, and 4. Bar two: 2 and the “and” of 3. Straight 8ths, light and quiet.',
    tip: 'Play with your fingers, not a pick. Learn the two-bar finger pattern by clapping it while you count, then add the thumb.' },
  { id: 'r-sparse', title: 'Free comping', comp: 'sparse', prog: 'bird', bpm: 150,
    grid: ['D', '', '', 'U', '', '', '', 'U'], accent: [3, 7],
    about: 'Behind a soloist, jazz guitarists don’t play a set pattern: they drop short chords in different spots every bar, answering the melody. The band’s guitar changes its rhythm every bar; this grid is just one example.',
    tip: 'Turn the guitar off and make up your own: two or three short hits per bar, mostly on off-beats. Leave space.' },
];
