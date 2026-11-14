// Lick library. Notes are written as tokens:  string:fret:beats[tech]
//   "3:7:.5"        string 3, fret 7, an 8th note
//   "3:6:.5h"       hammered on (h), pulled off (p), slid into (s), bent up a half (b) / whole (b2) /
//                   step and a half (b3), quarter-tone curl (q), released from a bend (u: from the bend
//                   on the note before at the same fret, else from a whole step), wide vibrato (v).
//                   Bends held a beat or more get vibrato on top.
//   "3:6+2:8:1"     double stop (two strings at once)
//   "r:1"           rest
//   "3:7:.5@1"      pin the fretting finger (1 index … 4 pinky); "3:6+2:8:1@24" one digit per part.
//                   Unpinned notes are fingered automatically (js/fingering.js).
// Beats: 1 = quarter, .5 = 8th, 1/3 = triplet 8th. Bars are 4/4. Chords: one entry per bar,
// or an array for two chords in a bar.

export const CATS = ['Classics', 'Swing blues', 'Blues', 'SRV', 'Bebop', 'ii–V–I', 'Gypsy jazz', 'Riffs', 'Turnarounds & endings'];

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
    notes: '5:3+3:5:1@13 5:6+3:8:.5@13 5:7+3:9:.5s@13 4:5+2:8:1@14 4:7+2:10:.5@14 4:5+2:8:.5@14 5:7+3:9:1@13 5:3+3:5:3@13',
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
    notes: '3:6+2:8:1@13 3:5+2:7:1@13 3:4+2:6:1@13 3:3+2:5:1@13 3:2+2:4:1@13 3:1+2:3:3@13',
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
    notes: '1:15:1/3@4 1:14:1/3@3 1:13:1/3@2 1:12:1/3@3 1:11:1/3@2 1:10:1/3@1 2:14:1/3@4 2:13:1/3@3 2:12:1/3@2 2:11:1/3@2 2:10:1/3@1 3:13:1/3@4 2:10:.5 2:6:.5 3:7:.5 4:9:.5 4:7:.5 5:8:.5 5:5:1',
    about: 'Twelve chromatic notes straight down in triplets. Because each triplet is three half steps, the beats land on G, E, C♯ and B♭, the notes of A7♭9. Then down a Dm6 arpeggio.',
    tip: 'Each triplet spans three frets: finger it 4-3-2, shift down, 3-2-1, then the same on string 2. Shift on the beat, where the accent hides it, and keep the picking even.',
  },
  // ---- more gypsy jazz ------------------------------------------------------------------
  {
    id: 'sliding-sixths', title: 'Sliding sixths', cat: 'Gypsy jazz', level: 2, bpm: 140, key: 'D minor',
    chords: ['A7', 'Dm6'],
    notes: '3:9+1:9:1.5@23 3:8+1:8:.5@23 3:7+1:7:.5@23 3:6+1:6:1.5@23 3:7+1:7:1@23 3:10+1:10:1s@23 3:7+1:7:2@23',
    about: 'Two notes a sixth apart (strings 3 and 1), sliding down a fret at a time from E and C♯ (the 5th and 3rd of A7) to D and B, the root and 6th of Dm6. Sweet, vocal, and very Django.',
    tip: 'Pluck the two notes with pick and middle finger (hybrid picking), or pick string 3 and let the pick graze string 2 muted under your finger.',
  },
  {
    id: 'gm6-cascade', title: 'Gm6 cascade, D7 climb', cat: 'Gypsy jazz', level: 3, bpm: 180, key: 'G minor',
    chords: ['Gm6', 'D7'],
    notes: '1:15:.5 1:12:.5 2:15:.5 2:11:.5 3:12:.5 3:9:.5 4:12:.5 4:8:.5 4:7:.5 3:5:.5 3:7:.5 2:7:.5 2:10:2',
    about: 'Down a Gm6 arpeggio (G E D B♭) two octaves from the top of the neck, then straight back up D7 (A C D F♯ A). Big position shifts at speed, the way Django covered the neck.',
    tip: 'Going down, use upstrokes and let the pick rest on the next string. Going up, use downstrokes. That is the gypsy rest stroke.',
  },
  {
    id: 'minor-turn', title: 'Minor i – ♭VI7 – V7', cat: 'Gypsy jazz', level: 3, bpm: 170, key: 'A minor',
    chords: [['Am6', 'F7'], ['E7b9', 'Am6']],
    notes: '4:7:.5 3:5:.5 2:5:.5 2:7:.5 1:5:.5 2:6:.5 3:8:.5 3:5:.5 3:4:.5 3:7:.5 2:6:.5 2:9:.5 2:10:2',
    about: 'The gypsy minor turnaround: Am6, F7, E7♭9, back home. Each chord gets its own arpeggio, and the moves between them are tiny: F♯ to A, C to B, G♯ to A.',
    tip: 'This turnaround is everywhere in gypsy jazz. Once you have the line, play the Am6, F7 and E7 chords along with it on the Chords page.',
  },
  {
    id: 'minor-251-gypsy', title: 'Gypsy minor ii–V–i', cat: 'Gypsy jazz', level: 3, bpm: 170, key: 'D minor',
    chords: [['Em7b5', 'A7b9'], 'Dm6'],
    notes: '5:7:.5 4:5:.5 4:8:.5 3:7:.5 2:5:.5 2:8:.5 1:6:.5 1:9:.5 1:10:1.5 1:7:.5 1:5:.5 2:6:.5 3:7:1',
    about: 'Straight up Em7♭5, keep climbing through A7♭9 (E G B♭ C♯, a diminished shape), and the top C♯ steps up to D. Then down Dm6 with its bright 6th (B).',
    tip: 'All in 5th position except the top: shift up two frets so fingers 3 and 4 take the C♯ and D, then come straight back down. Get the whole climb under one hand before you push the tempo.',
  },
  {
    id: 'six-nine', title: 'Major 6/9 arpeggio', cat: 'Gypsy jazz', level: 3, bpm: 180, key: 'G',
    chords: ['G6', 'G6'],
    notes: '6:3:.5 5:2:.5 5:5:.5 4:2:.5 4:5:.5 3:2:.5 3:4:.5 2:3:.5 2:5:.5 1:3:.5 1:5:.5 1:7:.5 1:5:.5 1:3:.5 2:5:1',
    about: 'G B D E A: the major 6/9 sound that makes gypsy jazz in a major key glow. Up two octaves and a bit in 3rd position, then back to E.',
    tip: 'Mostly two notes per string, so it falls under the fingers. Accent beat 1 of each bar and let the rest float.',
  },
  {
    id: 'harmonic-minor', title: 'Harmonic minor run', cat: 'Gypsy jazz', level: 3, bpm: 170, key: 'A minor',
    chords: ['E7b9', 'Am6'],
    notes: '1:13:.5 1:12:.5 1:10:.5 2:13:.5 2:12:.5 2:10:.5 3:13:.5 3:10:.5 3:9:.5 3:11:.5 2:10:.5 2:13:.5 1:12:2',
    about: 'A harmonic minor scale, straight down over E7♭9. Starting on F puts F, D, B and G♯ on the beats: the diminished chord inside E7♭9. Then up Am6.',
    tip: 'The G♯ to F step (an augmented 2nd) is the exotic sound. Make sure you can hear it.',
  },
  {
    id: 'octaves-dm', title: 'Django octaves', cat: 'Gypsy jazz', level: 3, bpm: 140, key: 'D minor',
    chords: ['Dm6', 'A7'],
    notes: '5:5+3:7:.5@13 5:8+3:10:.5@13 4:7+2:10:1@14 4:9+2:12:.5@14 4:7+2:10:1.5@14 4:5+2:8:.5@14 5:8+3:10:.5@13 5:7+3:9:1@13 5:4+3:6:.5@13 5:7+3:9:1.5@13',
    about: 'Django played melodies in octaves to cut through the band. Up Dm6 (D F A B), then down A7 to its 3rd (C♯) and back to E.',
    tip: 'Fret the low note with your 1st finger and the high note with your 3rd or 4th. Strum through the muted string in between.',
  },
  {
    id: 'three-over-four', title: 'Three against four', cat: 'Gypsy jazz', level: 3, bpm: 170, key: 'A minor',
    chords: ['Am6', 'Am6'],
    notes: '2:10:.5 2:13:.5 1:12:.5 2:10:.5 2:13:.5 1:12:.5 2:10:.5 2:13:.5 1:12:.5 2:10:.5 2:13:.5 1:12:.5 2:10:.5 2:13:.5 1:12:1',
    about: 'A three-note figure (A C E) played in 8th notes, so it starts on a different part of the beat every time. Repeating a short pattern against the beat like this builds tension.',
    tip: 'Keep tapping your foot on the beat. If your foot follows the pattern instead, slow down.',
  },
  {
    id: 'aug-five', title: 'Augmented over the V', cat: 'Gypsy jazz', level: 4, bpm: 160, key: 'D minor',
    chords: ['A7', 'Dm6'],
    notes: '6:5:1/3 5:4:1/3 5:8:1/3 4:7:1/3 3:6:1/3 3:10:1/3 2:10:1/3 1:9:1/3 1:13:1/3 1:17:1/3 1:13:1/3 1:9:1/3 1:10:1 2:12:.5 2:10:.5 3:10:.5 3:7:1.5',
    about: 'An A augmented arpeggio (A C♯ F) over A7, three octaves up in triplets. The F is the ♭13. Augmented chords split the octave into equal steps, so the same shape repeats every 4 frets. C♯ resolves up to D.',
    tip: 'Learn the first three notes, then move the shape up 4 frets and repeat. Turn on Degrees to see the ♭13 stand out.',
  },
  {
    id: 'dim-thirds', title: 'Diminished in minor 3rds', cat: 'Gypsy jazz', level: 4, bpm: 160, key: 'G minor',
    chords: ['D7b9', 'Gm6'],
    notes: '4:4:1/3 4:7:1/3 3:5:1/3 4:7:1/3 3:5:1/3 3:8:1/3 3:5:1/3 3:8:1/3 2:7:1/3 3:8:1/3 2:7:1/3 2:10:1/3 2:11:1 2:8:.5 2:5:.5 3:7:.5 4:8:.5 4:5:1',
    about: 'A diminished arpeggio (F♯ A C E♭) played as a rising sequence: three notes up, start one note higher, three up again. Over D7♭9 those are the 3rd, 5th, ♭7 and ♭9. The top A resolves to B♭, the 3rd of Gm6.',
    tip: 'Sequences train your hands and ears at once. Say the pattern “1 2 3, 2 3 4, 3 4 5” as you play.',
  },
  {
    id: 'triplet-enclose', title: 'Triplet enclosures', cat: 'Gypsy jazz', level: 4, bpm: 160, key: 'A minor',
    chords: ['Am6', 'Am6'],
    notes: '4:7:1/3 3:6:1/3 3:4:1/3 3:5:1/3 2:6:1/3 2:4:1/3 2:5:1/3 2:8:1/3 2:6:1/3 2:7:1/3 1:6:1/3 1:4:1/3 1:5:1 2:7:.5 2:5:.5 3:5:.5 4:7:1.5',
    about: 'Each Am6 note (A C E F♯) lands on a beat, and the two notes before it surround the next target from above and below. Four enclosures in a row, all in triplets.',
    tip: 'Hear each group as “chord tone, then a wind-up into the next one”. Accent the beats.',
  },
  {
    id: 'pedal-e', title: 'Pedal-note line', cat: 'Gypsy jazz', level: 4, bpm: 180, key: 'A minor',
    chords: ['Am6', 'Am6'],
    notes: '2:13:.5 1:12:.5 2:12:.5 1:12:.5 2:10:.5 1:12:.5 2:9:.5 1:12:.5 2:8:.5 1:12:.5 2:7:.5 1:12:.5 2:6:.5 1:12:.5 2:5:.5 1:12:.5',
    about: 'A line creeps down the B string (C B A G♯ G F♯ F E) while a high E rings in between every note. The repeated note works as a drone and makes a simple line sound fast and busy.',
    tip: 'Strict alternate picking: down on the B string, up on the high E. Keep the E the same volume every time.',
  },
  {
    id: 'f-triplet-turn', title: 'I – ♯I° – ii – V in triplets', cat: 'Gypsy jazz', level: 4, bpm: 160, key: 'F',
    chords: [['F6', 'F#dim7'], ['Gm7', 'C7']],
    notes: '5:8:1/3 4:7:1/3 4:10:1/3 3:7:1/3 3:10:1/3 2:10:1/3 1:8:1/3 1:11:1/3 1:14:1/3 1:11:1/3 1:8:1/3 2:10:1/3 2:8:1/3 2:11:1/3 1:10:1/3 1:13:1/3 1:10:1/3 1:8:1/3 2:11:1/3 2:8:1/3 2:5:1/3 3:5:1/3 3:7:1/3 3:9:1/3',
    about: 'The swing turnaround again, but every chord is a run of six triplets: up F6, up and back down F♯°7, up and back down Gm7, then down C7 and back up to its 3rd (E), which leads to F when it loops.',
    tip: 'Two beats per chord at 160 is fast. Practise each two-beat chunk on its own with Loop, then join them.',
  },
  // ---- blues: the players Stevie Ray Vaughan learned from ------------------------------
  {
    id: 'curl-release', title: 'Curls and a release', cat: 'Blues', level: 1, bpm: 100, key: 'A', groove: 'shuffle',
    chords: ['A7', 'A7'],
    notes: '1:8:.5q 1:5:.5 2:8:.5 2:5:.5 3:7:.5b2 3:7:.5u 3:5:.5 4:7:.5 6:5:.5 6:8:.5q 5:5:.5 5:7:.5 4:5:.5 4:6:.5h 4:7:1',
    about: 'The basic moves of blues lead in the A minor pentatonic box. A curl nudges the minor 3rd (C) a quarter tone sharp, so it sits between minor and major: the “blue” note. The bend pushes D up to E and the release lets it back down without picking again.',
    tip: 'A curl is tiny: push the string a hair, never a full half step. Then make the release smooth enough that the note seems to sink back down.',
  },
  {
    id: 'bb-box', title: 'B.B. King box', cat: 'Blues', level: 1, bpm: 63, key: 'A', groove: 'slow',
    chords: ['A7', 'A7'],
    notes: '2:10:.5 1:9:.5 1:10:.5 1:12:.5 1:10:1v 2:12:1b2 2:12:.5u 2:10:.5 3:11:.5 2:10:.5 2:10:2v',
    about: 'B.B. King lived in this little box above the root: A on the B string with the 3rd (C♯), 4th, 5th and 6th around it. Instead of the minor 3rd he bends the 9th (B) a whole step up to C♯, which is sweet rather than gritty. It is the “major” side of the blues that Stevie mixed with Albert King’s minor side.',
    tip: 'B.B.’s vibrato comes from the wrist, as if turning a doorknob, with the index finger as the pivot. Put vibrato on every long note.',
  },
  {
    id: 'albert-bends', title: 'Albert King big bends', cat: 'Blues', level: 2, bpm: 60, key: 'A', groove: 'slow',
    chords: ['A7', 'A7'],
    notes: '2:8:1b2 2:8:.5u 3:9:.5 2:8:1q 3:9:1v 3:9:1b3 3:9:.5u 3:7:.5 4:7:2v',
    about: 'Albert King was Stevie’s biggest hero. He played left-handed on a guitar strung for a right-hander, so he pulled his bends down toward the floor, and they were huge: here the ♭7 (G) climbs to the root, and the 5th (E) climbs a step and a half to the ♭7. He played few notes and made each one cry.',
    tip: 'For the step-and-a-half bend, put your ring finger on the note with the middle and index behind it on the same string, and push with all three. Check the pitch: it should match G at the 12th fret of the G string.',
  },
  {
    id: 'freddie-mm', title: 'Freddie King major to minor', cat: 'Blues', level: 1, bpm: 120, key: 'E', groove: 'shuffle',
    chords: ['E7', 'E7'],
    notes: '3:11:.5 3:13:.5s 2:12:.5 1:12:.5 2:14:.5 2:12:.5 3:13:1 3:12:1/3q 4:14:1/3 3:12:1/3 4:14:1 r:2',
    about: 'Freddie King played bright, punchy major-pentatonic lines (E F♯ G♯ B C♯) and then switched to the minor 3rd for the bite. Stevie took a lot of his attack from Freddie, who wore a plastic thumb pick and a metal pick on his index finger.',
    tip: 'Hear the change: the first bar is all major (G♯ and C♯), then the curled G in bar two is the minor sound. Pick hard. Freddie never played anything softly.',
  },
  {
    id: 'collins-stabs', title: 'Albert Collins stabs', cat: 'Blues', level: 2, bpm: 130, key: 'A', groove: 'shuffle',
    chords: ['A7', 'A7'],
    notes: 'r:.5 1:15:.5b2 r:.5 1:15:.5b2 r:.5 1:12:.5 2:15:.5 1:12:.5 2:13:.5q 2:15:.5 2:13:.5 3:14:2.5v',
    about: 'Albert Collins, “the Master of the Telecaster”, played with his bare thumb and index finger, snapping the strings, and kept his notes short and stinging with lots of space in between. Stevie recorded with him and loved how much noise a few notes could make.',
    tip: 'Let go of each bend the moment you hit it so the note stops dead in the rest. The silence is half the lick.',
  },
  {
    id: 'otis-minor', title: 'Otis Rush minor slow burn', cat: 'Blues', level: 2, bpm: 60, key: 'A minor', groove: 'slow',
    chords: ['Am7', 'Am7'],
    notes: 'r:1/3 2:5:1/3 1:5:1/3 1:8:2b2 1:8:1/3u 1:5:1/3 2:8:1/3 2:5:1/3 3:7:1/3 3:5:1/3 4:7:3v',
    about: 'Otis Rush played minor blues from Chicago’s West Side: long singing bends and a fast, shaky vibrato. Stevie named his band Double Trouble after an Otis Rush song. The minor 3rd (C) bends up to the 4th (D) and hangs there.',
    tip: 'Hold the bend for two full beats with vibrato on top. Keep the pitch at D while it shakes: you wiggle around the bent note, not below it.',
  },
  {
    id: 'buddy-shriek', title: 'Buddy Guy repeating bends', cat: 'Blues', level: 2, bpm: 120, key: 'E', groove: 'shuffle',
    chords: ['E7', 'E7'],
    notes: '2:15:.5b2 1:12:.5 2:15:.5b2 1:12:.5 2:15:.5b2 1:12:.5 2:15:1b2 2:15:.5u 2:12:.5 3:14:.5 3:12:.5q 4:14:2v',
    about: 'Buddy Guy whips the same bend over and over, each one against the high E, until it sounds like shouting. Stevie loved it so much he played this kind of thing whenever a solo needed to get louder.',
    tip: 'Bend D up to E so it matches the open-sounding E at the 12th fret of the top string. The two notes should be the same pitch.',
  },
  {
    id: 'hendrix-thirds', title: 'Hendrix-style 3rds', cat: 'Blues', level: 2, bpm: 66, key: 'E', groove: 'slow',
    chords: ['E7', 'E7'],
    notes: '3:7+2:7:.5@32 3:9+2:9:.5@32 3:11+2:10:.5@32 3:9+2:9:.5@32 3:7+2:7:.5@32 3:6+2:5:.5@21 3:4+2:3:1@21 4:2+3:1:2v@21 r:2',
    about: 'Jimi Hendrix filled the gaps in his songs with pretty double stops on the G and B strings, sliding through the E scale in 3rds. Stevie played Hendrix tunes in almost every show and borrowed this R&B fill style for his ballads.',
    tip: 'Keep one shape (middle on the B string, ring on the G) and slide it from spot to spot, then switch to index and middle for the last three. It should sound like a singer, not a scale.',
  },
  {
    id: 'burrell-minor', title: 'Kenny Burrell minor blues', cat: 'Blues', level: 2, bpm: 130, key: 'C minor',
    chords: ['Cm7', 'Cm7'],
    notes: '1:11:.5 1:8:.5p 2:11:.5 2:8:.5 3:10:.5 3:11:.5h 3:10:.5 3:8:.5 4:10:.5 4:8:.5 5:10:.5 6:11:.5 6:8:2',
    about: 'Kenny Burrell was a jazz guitarist who played the blues with a clean, warm tone, and Stevie recorded one of his tunes. The ♭5 (G♭) gets a quick hammer-on from the 4th: the blues scale in a jazz setting.',
    tip: 'Play it lighter than the other blues licks, with a rounder tone (pick near the neck). Swing the 8ths.',
  },
  {
    id: 'sliding-boxes', title: 'Sliding up the boxes', cat: 'Blues', level: 2, bpm: 110, key: 'A', groove: 'shuffle',
    chords: ['A7', 'A7'],
    notes: '4:5:.5@1 4:7:.5@3 3:5:.5@1 3:7:.5@3 3:9:.5s@3 2:8:.5 2:10:.5s 1:8:.5 1:10:.5 1:12:.5s 1:10:.5 2:10:.5 1:8:2v',
    about: 'The pentatonic scale comes in five boxes up the neck. Slides connect them, so a line can climb from the 5th fret to the 12th without a jump. Stevie and the Kings slid between boxes all the time to reach the high notes.',
    tip: 'Each slide uses the same finger from one fret to the next. Count which finger lands where; the fingering numbers show the shifts in brass.',
  },
  {
    id: 'chuck-ds', title: 'Rock ’n’ roll double stops', cat: 'Blues', level: 2, bpm: 150, key: 'A', groove: 'shuffle',
    chords: ['A7', 'A7'],
    notes: '3:7+2:5:1/3b2 3:7+2:5:1/3b2 3:7+2:5:1/3b2 3:7+2:5:1/3b2 3:7+2:5:1/3b2 3:7+2:5:1/3b2 3:7+2:5:1/3b2 3:7+2:5:1/3b2 3:7+2:5:1/3b2 2:5+1:5:1 3:5:.5 3:6:.5h 4:7:.5 4:5:.5 5:7:.5 6:5:1.5',
    about: 'T-Bone Walker’s double stops became the sound of rock ’n’ roll: bend the G string up to E while the B string holds E, and pick both fast in triplets. Chuck Berry built a career on it, and every Texas player since has used it to kick off a solo.',
    tip: 'Keep the bend up for the whole run of triplets; only the pick moves. Then flatten your index across the top two strings for the A and E.',
  },
  // ---- Stevie Ray Vaughan --------------------------------------------------------------
  {
    id: 'srv-texas-ds', title: 'Texas double stops', cat: 'SRV', level: 1, bpm: 110, key: 'A', groove: 'shuffle',
    chords: ['A7', 'A7'],
    notes: '3:5+2:5:.5 3:6+2:5:.5h 3:5+2:5:.5 3:6+2:5:.5h 2:5+1:5:1 3:7:.5 3:5:.5 4:7:.5 3:5:.5 4:5:.5 5:7:.5 6:5:2v',
    about: 'Stevie’s shuffles are full of this: hold E on the B string and hammer the G string from the minor 3rd (C) to the major 3rd (C♯). The minor-to-major rub is the blues in two notes.',
    tip: 'Flatten your index across both strings at the 5th fret, then hammer the middle finger at the 6th. Let both notes ring.',
  },
  {
    id: 'srv-open-growl', title: 'Open E growl', cat: 'SRV', level: 1, bpm: 110, key: 'E', groove: 'shuffle',
    chords: ['E7', 'E7'],
    notes: '5:0:.5 5:2:.5h 4:0:.5 4:2:.5h 3:0:.5 3:1:.5h 4:2:.5 r:.5 6:0:.5 6:3:.5q 6:0:.5 5:2:.5 5:0:.5 6:3:.5 6:0:1',
    about: 'Stevie played in E so he could use the open strings: they ring loud, they let the hand move freely, and the low E gives a shuffle its weight. He tuned down a half step and used very heavy strings, so in real life this sounds in E♭ and growls.',
    tip: 'Hammer-ons from open strings need a strong finger. Hit the fret hard, right behind the fret wire.',
  },
  {
    id: 'srv-walkup', title: 'Walk up to the IV', cat: 'SRV', level: 1, bpm: 120, key: 'E', groove: 'shuffle',
    chords: ['E7', 'A7'],
    notes: '6:0:1 6:0:.5 6:2:.5 6:3:.5 6:4:.5h 5:0:1 5:0+4:2:.5 5:0+4:2:.5 5:0+4:4:.5 5:0+4:4:.5 5:0+4:5:.5 5:0+4:5:.5 5:0+4:4:.5 5:0+4:4:.5',
    about: 'A Texas shuffle trick for changing chords: walk up the low E string (E, F♯, G, G♯) into the open A, then rock the boogie pattern (5th, 6th, ♭7) over the new chord.',
    tip: 'Palm-mute everything lightly with the edge of your picking hand, and use downstrokes only.',
  },
  {
    id: 'srv-avalanche', title: 'Open-string avalanche', cat: 'SRV', level: 2, bpm: 100, key: 'E', groove: 'shuffle',
    chords: ['E7', 'E7'],
    notes: '1:3:1/3 1:0:1/3p 2:3:1/3 2:0:1/3p 3:2:1/3 3:0:1/3p 4:2:1/3 4:0:1/3p 5:2:1/3 5:0:1/3p 6:3:1/3 6:0:1/3p 6:3:.5q 6:0:.5 5:0:.5 5:2:.5h 6:0:2',
    about: 'Pull off to an open string, pick the next one, pull off again, all the way down the E minor pentatonic in triplets. The pull-offs do half the work, so it sounds much faster than your picking hand is going.',
    tip: 'Pick only the first note on each string; the second is a pull-off. Flick the finger sideways off the string so the open note sounds loud.',
  },
  {
    id: 'srv-unison', title: 'Unison bend at the 12th', cat: 'SRV', level: 2, bpm: 110, key: 'E', groove: 'shuffle',
    chords: ['E7', 'E7'],
    notes: '3:14+2:12:1b2 3:14+2:12:.5u 1:12:.5 2:15:.5 2:12:.5 3:14:.5 3:12:.5 4:14:.5 4:12:.5 5:14:.5 4:12:.5 4:14:2v',
    about: 'Bend the G string up a whole step until it matches the B string’s note, and play both together. As the bend arrives the two notes “lock” into one fat, wobbly pitch. Stevie used it to make a single note sound huge.',
    tip: 'Ring finger bends the G string at the 14th; index holds B at the 12th. Listen for the beating to stop: that means the bend is in tune.',
  },
  {
    id: 'srv-turnaround', title: 'Open E turnaround', cat: 'SRV', level: 2, bpm: 110, key: 'E', groove: 'shuffle',
    chords: ['E7', 'B7'],
    notes: '1:0:1/3 2:3:1/3 3:4:1/3 1:0:1/3 2:2:1/3 3:3:1/3 1:0:1/3 2:1:1/3 3:2:1/3 1:0:1/3 2:0:1/3 3:1:1/3 5:2+4:1+3:2+2:0:2 r:2',
    about: 'The high E rings over the top while two notes slide down a fret at a time underneath, landing on B7, the chord that sends the 12-bar back to the start. Every Texas shuffle ends its chorus with something like this.',
    tip: 'Pick down, down, down for each triplet (E string, then the pair) and keep the open E ringing the whole time.',
  },
  {
    id: 'srv-repeat-bend', title: 'Repeating bend triplets', cat: 'SRV', level: 2, bpm: 100, key: 'E', groove: 'shuffle',
    chords: ['E7', 'E7'],
    notes: '3:14:1/3b2 2:12:1/3 1:12:1/3 3:14:1/3b2 2:12:1/3 1:12:1/3 3:14:1/3b2 2:12:1/3 1:12:1/3 3:14:1/3b2 2:12:1/3 1:12:1/3 3:14:1/3b2 3:14:1/3u 3:12:1/3 4:14:1v r:2',
    about: 'Bend, then the B and E above it, round and round in triplets. Albert King did it slowly; Stevie sped it up and made it roll. The bend must snap up fast because it only lasts a third of a beat.',
    tip: 'Keep your index barred lightly across the 12th fret the whole time, and let the ring finger do the bending.',
  },
  {
    id: 'srv-major-minor', title: 'Major box, minor box', cat: 'SRV', level: 2, bpm: 110, key: 'A', groove: 'shuffle',
    chords: ['A7', 'A7'],
    notes: '2:10:.5 1:9:.5 2:10:.5 2:12:.5b2 2:12:.5u 2:10:.5 3:11:.5 2:10:.5 1:8:.5q 1:5:.5 2:8:.5 2:5:.5 3:7:.5b2 3:5:.5 4:7:1v',
    about: 'Stevie mixed B.B. King’s sweet major box (bar one: C♯, F♯ and the 9th) with Albert King’s gritty minor box (bar two: C, G and bends to the 4th). Switching between them in one phrase is the heart of his style.',
    tip: 'Shift down from the 10th fret to the 8th on the beat between the bars. Look ahead to where your index lands.',
  },
  {
    id: 'srv-pent-avalanche', title: 'Pentatonic triplet cascade', cat: 'SRV', level: 3, bpm: 110, key: 'E', groove: 'shuffle',
    chords: ['E7', 'E7'],
    notes: '1:15:1/3 1:12:1/3p 2:15:1/3 2:12:1/3p 3:14:1/3 3:12:1/3p 4:14:1/3 4:12:1/3p 5:14:1/3 5:12:1/3p 6:15:1/3 6:12:1/3p 6:12:.5 6:15:.5q 5:12:.5 5:14:.5 4:12:.5 4:14:1.5v',
    about: 'The open-string avalanche moved up to the 12th fret, where there are no open strings to help: now you pull off to your index finger. Stevie flew down the neck like this in his fastest shuffles.',
    tip: 'Keep the index barred at the 12th so it is already waiting for every pull-off. Start at 70 bpm.',
  },
  {
    id: 'srv-slow-sigh', title: 'Slow blues sigh', cat: 'SRV', level: 3, bpm: 60, key: 'E', groove: 'slow',
    chords: ['E7', 'E7'],
    notes: '2:15:1b2 2:15:1/3u 2:12:1/3 3:14:1/3 3:12:1/3q 4:14:1/3 3:12:1/3 4:14:1v 1:12:1/6 1:15:1/6 1:12:1/6 2:15:1/6 2:12:1/6 3:14:1/6 3:14:1b2 3:14:.5u 3:12:.5 4:14:1v',
    about: 'Slow blues the way Stevie played it: a big bend that holds and cries, a lazy triplet answer, then a sudden burst of fast notes that falls into another bend. Fast against slow is what makes it exciting.',
    tip: 'Count the slow beat in triplets (1-trip-let, 2-trip-let). The burst in bar two is six notes in one beat: play it loose, it does not have to be perfectly even.',
  },
  {
    id: 'srv-trill', title: 'Trill and shout', cat: 'SRV', level: 3, bpm: 60, key: 'E', groove: 'slow',
    chords: ['E7', 'E7'],
    notes: '1:12:1/6 1:15:1/6h 1:12:1/6p 1:15:1/6h 1:12:1/6p 1:15:1/6h 1:12:1/6p 1:15:1/6h 1:12:1/6p 1:15:1/6h 1:12:1/6p 1:15:1/6h 2:15:1b2 2:15:.5u 2:12:.5 3:14:.5 3:12:.5q 4:14:.5 4:12:.5 5:14:2v',
    about: 'A trill is a fast hammer-on and pull-off between two notes, picked only once. Stevie used trills to build tension on a slow blues before breaking out with a shouting bend.',
    tip: 'Index stays planted on the 12th; the pinky (or ring) hammers and pulls at the 15th. Keep the trill going by flicking the finger off sideways.',
  },
  {
    id: 'srv-flurry', title: 'Slow blues flurry', cat: 'SRV', level: 4, bpm: 58, key: 'A', groove: 'slow',
    chords: ['A7', 'D7'],
    notes: '1:8:1b2 1:8:1/6u 1:5:1/6 2:8:1/6 2:5:1/6 3:7:1/6 3:5:1/6 4:7:1/6 3:5:1/6 4:7:1/6 4:5:1/6 5:7:1/6 4:5:1/6 4:7:1v 2:10:1/3@3 1:10:1/3 2:10:1/3b2 2:10:1/3u 2:8:1/3 3:7:1/3@3 3:7:2b2@3',
    about: 'Bend and burst: a high bend, then twelve fast notes falling down the A minor pentatonic, and over the D7 the line climbs to the root and bends the 5th (A) of D up to its 6th. Stevie loved to land on the IV chord with a bend like this.',
    tip: 'The fast notes are sextuplets, six to a beat. Loop just that one beat at half speed until it sits under the fingers, then join it to the bend.',
  },
  // ---- turnarounds & endings ------------------------------------------------------------
  {
    id: 'a-turnaround', title: 'Blues turnaround in A', cat: 'Turnarounds & endings', level: 1, bpm: 100, key: 'A', groove: 'shuffle',
    chords: ['A7', 'E7'],
    notes: '1:5:1/3@1 2:8:1/3@3 3:9:1/3@4 1:5:1/3@1 2:7:1/3@2 3:8:1/3@3 1:5:1/3@1 2:6:1/3@2 3:7:1/3@3 1:5:1/3@1 2:5:1/3@1 3:6:1/3@2 5:7+4:6+3:7+2:5:2 r:2',
    about: 'The blues turnaround: the top note (A) stays put while the notes under it slide down a fret at a time, then the E7 chord sends the 12-bar back around.',
    tip: 'Keep your index on the A at the 5th fret and let it ring the whole time, while the other fingers walk the pairs down a fret at a time.',
  },
  {
    id: 'slow-ending', title: 'Slow blues ending', cat: 'Turnarounds & endings', level: 1, bpm: 63, key: 'A', groove: 'slow',
    chords: ['A7', ['Bb7', 'A7']],
    notes: '1:5:1/3 2:8:1/3 2:5:1/3 3:7:1/3 3:5:1/3 4:7:1/3 4:5:1/3 5:7:1/3 5:5:1/3 6:8:1/3 6:5:1/3 r:1/3 4:8+3:7+2:6:2 4:7+3:6+2:5:2',
    about: 'How a slow blues says goodbye: run down the pentatonic scale, then slide a chord down a half step from B♭ to A. That last “one fret down” move is the ending everyone knows.',
    tip: 'Let the last chord ring out and add vibrato to it. Then stop: the band will follow you.',
  },
  // ---- batch 2 ----------------------------------------------------------------------------
  {
    id: 'srv-fills', title: 'Rhythm fills in E and A', cat: 'SRV', level: 2, bpm: 100, key: 'E', groove: 'shuffle',
    chords: ['E7', 'A7'],
    notes: '6:0:1 3:1+2:0:.5 3:2+2:3:.5 3:1+2:0:.5 4:2:.5 3:0:.5 3:1:.5h 5:0:1 2:2+1:0:.5 2:3+1:2:.5 2:2+1:0:.5 3:2:.5 3:0:.5 4:2:.5',
    about: 'Stevie rarely just strummed: between chords his fingers kept decorating them, the way Hendrix did. Hit the bass note, then rock a little double stop up to the 4th and ♭7 and back, and finish with a quick line. The same move works on every chord of the blues.',
    tip: 'Keep the chord shape mostly held and let one or two fingers do the moving. It should still sound like rhythm guitar, just busier.',
  },
  {
    id: 'srv-q-and-a', title: 'Question and answer', cat: 'SRV', level: 2, bpm: 60, key: 'E', groove: 'slow',
    chords: ['E7', 'A7'],
    notes: 'r:1 2:15:1b2 2:15:1/3u 2:12:1/3 1:12:1/3 1:12:1v r:1 4:12:1/3 4:14:1/3 3:12:1/3q 4:14:1/3 4:12:1/3 5:14:1/3 5:12:1v',
    about: 'Blues phrasing is like talking: a high, crying “question” in one bar, then a low, settled “answer” in the next. Notice the rest at the start of each bar. Stevie left room for the band to breathe even when he was playing hard.',
    tip: 'Don’t fill the rests. Count them out loud if you have to. The space is what makes the next phrase land.',
  },
  {
    id: 'srv-hammer-climb', title: 'Hammer-on climb', cat: 'SRV', level: 3, bpm: 100, key: 'A', groove: 'shuffle',
    chords: ['A7', 'A7'],
    notes: '6:5:1/3 6:8:1/3h 5:5:1/3 5:7:1/3h 4:5:1/3 4:7:1/3h 3:5:1/3 3:7:1/3h 2:5:1/3 2:8:1/3h 1:5:1/3 1:8:1/3h 1:8:.5b2 1:8:.5u 1:5:.5 2:8:.5 2:5:2v',
    about: 'Up the A minor pentatonic in triplets: pick one note, hammer the next, move to the next string. Half the notes are hammered, so the run sounds smooth and fast with only a light picking hand.',
    tip: 'Index at the 5th fret on every string; the ring hammers the 7th-fret notes and the pinky the 8th-fret ones. Accent the picked notes to keep the triplets even.',
  },
  {
    id: 'srv-oblique', title: 'Oblique bends', cat: 'SRV', level: 2, bpm: 100, key: 'E', groove: 'shuffle',
    chords: ['E7', 'E7'],
    notes: '3:14+2:15:1b2 3:14+2:15:.5u 2:12:.5 3:14+2:15:1b2 3:14:.5u 3:12:.5 4:14:.5 4:12:.5 5:14:.5 5:12:.5 6:15:.5q 6:12:1.5v',
    about: 'Bend one string while the string next to it holds still: the G string climbs from A to B underneath a steady D. The two notes squeeze together as the bend rises. Stevie used it to make a double stop moan.',
    tip: 'Ring finger bends the G string at the 14th, pinky holds the B string at the 15th. Push the G string up without dragging the B string with it.',
  },
  {
    id: 'srv-slow-climb', title: 'Climb to the high root', cat: 'SRV', level: 3, bpm: 60, key: 'A', groove: 'slow',
    chords: ['A7', 'A7'],
    notes: '4:7:1/3 3:5:1/3 3:7:1/3 2:5:1/3 2:8:1/3 1:5:1/3 1:8:1/3 1:10:1/3 1:12:1/3s 1:15:1b2 1:15:1/3u 1:12:1/3 2:15:1/3 2:13:1/3q 2:15:1/3 2:13:1/3 3:14:2v',
    about: 'On a slow blues Stevie would build a solo by climbing: start low in the first box, run up the top string, and arrive at a bend to the high A. Then come back down in the box at the 12th fret.',
    tip: 'The slide on the top string (10th to 12th fret) is the shift: one finger glides and the hand comes with it. Land the bend right on beat 4.',
  },
  {
    id: 'srv-low-blues', title: 'Low-string blues scale', cat: 'SRV', level: 1, bpm: 110, key: 'A', groove: 'shuffle',
    chords: ['A7', 'A7'],
    notes: '6:5:.5 6:8:.5 5:5:.5 5:6:.5h 5:7:.5 6:8:.5 6:5:1 4:7:.5 4:5:.5 5:7:.5 5:6:.5 5:5:.5 6:8:.5 6:5:1v',
    about: 'Down on the low strings with the blues scale: the minor pentatonic plus the ♭5 (E♭), slipped in chromatically between D and E. Stevie’s heavy strings made these low lines sound like a horn section.',
    tip: 'Dig in with the pick and let the low notes growl. Hammer the E♭ with the middle finger and keep going.',
  },
  {
    id: 'srv-sixths', title: 'Sixths down the neck', cat: 'SRV', level: 2, bpm: 66, key: 'E', groove: 'slow',
    chords: ['E7', 'A7'],
    notes: '3:13+1:12:.5@21 3:11+1:10:.5@21 3:9+1:9:.5@23 3:7+1:7:.5@23 3:6+1:5:.5@21 3:4+1:4:1.5v@23 3:4+1:3:.5@21 3:6+1:5:1.5v@21 r:2',
    about: 'Two notes a 6th apart, on the G and high E strings with the B string skipped, walked down the E scale. It is the soul and R&B sound of the ballads Stevie loved; the last pair moves to the 3rd and root of A7.',
    tip: 'Two shapes: when the G-string note is a fret higher use middle and index; on the same fret use middle and ring. Pick the G string and pluck the high E with your picking hand’s middle finger, so the B string never sounds.',
  },
  {
    id: 'twelve-bar-chorus', title: 'Full 12-bar chorus in A', cat: 'Blues', level: 3, bpm: 100, key: 'A', groove: 'shuffle',
    chords: ['A7', 'D7', 'A7', 'A7', 'D7', 'D7', 'A7', 'A7', 'E7', 'D7', 'A7', 'E7'],
    notes: '3:5+2:5:.5 3:6+2:5:.5h 3:5+2:5:.5 3:6+2:5:.5h 2:5+1:5:1 r:1 ' +
           '1:5:.5 2:7:.5 1:5:.5 2:7:.5 3:7:1v r:1 ' +
           'r:.5 1:8:.5q 1:5:.5 2:8:.5 2:5:.5 3:7:.5b2 3:7:.5u 3:5:.5 ' +
           '4:7:2v r:2 ' +
           '2:10:.5 1:10:.5 2:10:1b2 2:10:.5u 2:8:.5 3:7:1v ' +
           '3:7:.5 3:5:.5 4:7:.5 4:4:.5 5:5:2 ' +
           'r:1 2:10:1/3 1:9:1/3 2:10:1/3 2:12:1b2 2:12:1/3u 2:10:1/3 3:11:1/3 ' +
           '2:10:2v r:2 ' +
           '1:10:.5 1:7:.5 2:9:.5 3:9:.5 2:9:1v r:1 ' +
           '2:10:.5 1:10:.5 2:10:.5 2:7:.5 3:7:1v r:1 ' +
           '1:5:1/3@1 2:8:1/3@3 3:9:1/3@4 1:5:1/3@1 2:7:1/3@2 3:8:1/3@3 1:5:1/3@1 2:6:1/3@2 3:7:1/3@3 1:5:1/3@1 2:5:1/3@1 3:6:1/3@2 ' +
           '5:7+4:6+3:7+2:5:2 r:2',
    about: 'A whole chorus of the 12-bar blues built from licks in this library, each one aimed at the chord underneath: Texas double stops, a D7 line on its 3rd (F♯), curls and bends, the B.B. King box, a line that hits E7’s 3rd (G♯), and the turnaround. This is how the licks turn into a solo.',
    tip: 'Watch the chord names: every phrase starts on a note of the new chord. Learn it four bars at a time, then play the whole thing with the band.',
  },
  {
    id: 'lonnie-triplets', title: 'Lonnie Mack triplet runs', cat: 'Blues', level: 3, bpm: 120, key: 'E', groove: 'rock',
    chords: ['E7', 'E7'],
    notes: '1:12:1/3 2:15:1/3 2:12:1/3 1:12:1/3 2:15:1/3 2:12:1/3 3:14:1/3 3:13:1/3p 3:12:1/3p 4:12:1/3 4:14:1/3 3:12:1/3 3:13:.5h 1:12:1.5v r:2',
    about: 'Lonnie Mack’s fast, clean instrumental records from the early 1960s were among the first things Stevie learned as a boy, and years later Stevie co-produced Lonnie’s comeback album. This is his style: rolling triplets with a chromatic slip from A through G♯ to G.',
    tip: 'The pull-offs go A to G♯ to G on one string: ring, middle, index. Pick only the A.',
  },
  {
    id: 'jimmie-less', title: 'Jimmie Vaughan: say less', cat: 'Blues', level: 1, bpm: 120, key: 'A', groove: 'shuffle',
    chords: ['A7', 'A7'],
    notes: 'r:1 3:5:.5 3:6:.5h 2:5:.5 r:.5 1:5:.5 2:7:.5 2:5:.5 3:6:.5 3:4:.5 4:7:1.5 r:1',
    about: 'Stevie’s big brother Jimmie, of the Fabulous Thunderbirds, was his first and biggest influence. Jimmie’s rule: play fewer notes, play them short, and leave space. Major sound (C♯ and F♯) with one hammer from the minor 3rd.',
    tip: 'Play it quieter than you think, with short notes. Lift your fretting fingers right after each note so it stops.',
  },
  {
    id: 'albert-prebend', title: 'Albert King pre-bends', cat: 'Blues', level: 2, bpm: 60, key: 'A', groove: 'slow',
    chords: ['A7', 'A7'],
    notes: '2:8:1u 2:10:.5 1:8:.5q 1:8:1b2 1:8:.5u 2:10:.5 2:8:.5q 3:9:.5 3:7:.5b2 3:7:.5u 4:7:2v',
    about: 'A pre-bend is bent before you pick it, so the note starts high and falls. Albert King opened phrases with them: the first note sounds as A and droops to G. It sounds like a voice sighing.',
    tip: 'Bend silently, check it against A at the 10th fret, then pick and let it down slowly. Use the ring finger with the others pushing behind it.',
  },
  {
    id: 'albert-one-note', title: 'Albert King: one note, three pitches', cat: 'Blues', level: 2, bpm: 90, key: 'A', groove: 'shuffle',
    chords: ['A7', 'A7'],
    notes: 'r:.5 2:8:.5b2 r:.5 2:8:.5b2 2:8:.5u 2:5:.5 3:7:1v r:.5 2:8:.5b 2:8:.5b2 2:8:.5u 2:5:.5 3:7:.5 4:7:1v',
    about: 'Albert King could play a whole chorus on one string spot: G bent up a whole step to A, a half step to G♯, released back to G. Each pitch says something different. Stevie copied this so closely that Albert teased him about it.',
    tip: 'Hit each bend in rhythm. The half bend is the hard one: stop at G♯, not A.',
  },
  {
    id: 'minor-into-iv', title: 'Minor blues: into the iv', cat: 'Blues', level: 1, bpm: 63, key: 'A minor', groove: 'slow',
    chords: ['Am7', 'Dm7'],
    notes: '2:5:.5 2:6:.5h 2:8:.5 1:5:.5 1:8:1b2 1:8:.5u 1:5:.5 2:6:1v 3:7:.5 3:5:.5 4:7:.5 5:8:.5 5:5:1',
    about: 'In a minor blues every chord is minor, so the line can lean on F, the ♭6 of A minor, which becomes the minor 3rd of Dm7 when the chord changes. The bend from C to D pulls toward the new chord.',
    tip: 'Hold the F at the start of bar two with a slow vibrato: it is the note that tells everyone the chord changed.',
  },
  {
    id: 'minor-dorian', title: 'Minor blues with the 6th', cat: 'Blues', level: 2, bpm: 66, key: 'A minor', groove: 'slow',
    chords: ['Am7', 'Am7'],
    notes: '4:7:.5 3:5:.5 3:7:.5 2:5:.5 2:7:.5 2:8:.5 1:5:1v 1:7:.5 1:5:.5 2:7:.5 2:5:.5 3:7:.5b2 3:5:.5 4:7:1v',
    about: 'Add F♯ (the major 6th) to A minor pentatonic and the sound turns smoky and sophisticated: this is the Dorian mode. Otis Rush and B.B. King used it in minor blues, and Stevie did on his jazzier slow tunes.',
    tip: 'The F♯ is on the B string at the 7th fret. Let it stand out a little; it is the colour note.',
  },
  {
    id: 'minor-v', title: 'Minor blues: the V chord', cat: 'Blues', level: 2, bpm: 63, key: 'A minor', groove: 'slow',
    chords: ['E7', 'Am7'],
    notes: '1:8:.5 1:7:.5 1:5:.5 1:4:.5 2:6:.5 2:5:.5 3:7:.5 3:4:.5 3:5:2v r:2',
    about: 'Over E7 in a minor blues, swap the G for G♯: it is E7’s 3rd and leads up to A. Here it runs down from C through G♯, F and D, then lands on C, the minor 3rd of Am7.',
    tip: 'The G♯ is a stretch back with the index (4th fret on the top string). Lean into the C at the end.',
  },
  {
    id: 'freddie-bounce', title: 'Freddie King bounce', cat: 'Blues', level: 1, bpm: 130, key: 'A', groove: 'shuffle',
    chords: ['A7', 'A7'],
    notes: '2:10:.5 1:9:.5 1:12:.5 1:9:.5 2:10:.5 2:12:.5 2:10:.5 3:11:.5 3:9:.5 3:11:.5 2:10:2v r:1',
    about: 'Freddie King’s shuffles bounced on the major pentatonic (A B C♯ E F♯) high up the neck, bright and swinging, like a horn player. Stevie borrowed his drive and his attack.',
    tip: 'Hit every note hard and swing the 8ths. Freddie’s shuffles never sat back.',
  },
  {
    id: 'horn-riff', title: 'Horn-section riff', cat: 'Swing blues', level: 1, bpm: 140, key: 'A', groove: 'shuffle',
    chords: ['A7', 'D7'],
    notes: '6:5:.5 6:8:.5 6:9:.5h 5:7:.5 r:.5 5:7:.5 6:9:1 5:5:.5 5:8:.5 5:9:.5h 4:7:.5 r:.5 4:7:.5 5:9:1',
    about: 'Jump blues bands built their tunes on short horn riffs, and the guitarist doubled them on the low strings. Root, minor 3rd hammered to major 3rd, 5th; then move the whole riff across a string for the IV chord.',
    tip: 'Same fingers, same shape, one string higher for D7. Play it short and punchy like a sax section.',
  },
  {
    id: 'tbone-ninths', title: 'T-Bone ninth-chord slides', cat: 'Swing blues', level: 1, bpm: 130, key: 'A', 
    chords: ['A7', 'D7'],
    notes: '4:4+3:3+2:4+1:4:.5@2133 4:5+3:4+2:5+1:5:.5s@2133 r:1 4:4+3:3+2:4+1:4:.5@2133 4:5+3:4+2:5+1:5:1.5s@2133 ' +
           '4:9+3:8+2:9+1:9:.5@2133 4:10+3:9+2:10+1:10:.5s@2133 r:1 4:9+3:8+2:9+1:9:.5@2133 4:10+3:9+2:10+1:10:1.5s@2133',
    about: 'T-Bone Walker, the father of electric blues guitar, slid into ninth chords from a fret below. The top four strings of a 9th chord (♭7, 9, 5, root) sound jazzy and bright. Stevie’s brother Jimmie and Stevie both used these in shuffles.',
    tip: 'Index on the G string, middle on the D string, ring flattened across the top two strings. Slide the whole shape up one fret.',
  },
  {
    id: 'intro-from-v', title: 'Intro from the V', cat: 'Turnarounds & endings', level: 2, bpm: 100, key: 'A', groove: 'shuffle',
    chords: ['E7', 'A7'],
    notes: '1:12:1/3 2:15:1/3 2:14:1/3 2:13:1/3 2:12:1/3 3:14:1/3 3:13:1/3 3:12:1/3 4:14:1/3 4:12:1/3 4:14:1/3 3:13:1/3 3:14:2v r:2',
    about: 'Lots of blues tunes start on the V chord: the guitar plays a run down from the top, and the band comes in on the I. This one falls chromatically from E through D, C♯, C and B, then climbs E, G♯ into A.',
    tip: 'Use it to count the band in: play it alone, then land on the A with the band.',
  },
  {
    id: 'boogie-e-a', title: 'Boogie rhythm in E and A', cat: 'Riffs', level: 1, bpm: 120, key: 'E', groove: 'shuffle',
    chords: ['E7', 'A7'],
    notes: '6:0+5:2:.5 6:0+5:2:.5 6:0+5:4:.5 6:0+5:4:.5 6:0+5:5:.5 6:0+5:5:.5 6:0+5:4:.5 6:0+5:4:.5 ' +
           '5:0+4:2:.5 5:0+4:2:.5 5:0+4:4:.5 5:0+4:4:.5 5:0+4:5:.5 5:0+4:5:.5 5:0+4:4:.5 5:0+4:4:.5',
    about: 'The boogie rhythm under countless Texas shuffles: open string plus the 5th, 6th and ♭7 above it. Stevie played this kind of thing behind his solos and between his vocal lines.',
    tip: 'Palm-mute the strings lightly and use downstrokes. Index on the 5th, ring on the 6th, pinky on the ♭7.',
  },
];

// ---- parsing --------------------------------------------------------------------------
const num = s => (s.includes('/') ? s.split('/').reduce((a, b) => +a / +b) : +s);

export function parseNotes(str) {
  const out = []; let b = 0;
  for (const tok of str.trim().split(/\s+/)) {
    const at = tok.indexOf('@');
    const pin = at >= 0 ? [...tok.slice(at + 1)].map(Number) : null;
    const t = at >= 0 ? tok.slice(0, at) : tok;
    const i = t.lastIndexOf(':');
    const head = t.slice(0, i), tail = t.slice(i + 1);
    const m = /^([\d.\/]+)(h|p|s|b2|b3|b|q|u|v)?$/.exec(tail);
    if (!m) throw new Error('bad token ' + tok);
    const d = num(m[1]), tech = m[2] || null;
    if (head === 'r') { out.push({ b, d, rest: true, p: [] }); b += d; continue; }
    const p = head.split('+').map(x => { const [s, f] = x.split(':').map(Number); return { s, f }; });
    out.push(pin ? { b, d, tech, p, pin } : { b, d, tech, p });
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
