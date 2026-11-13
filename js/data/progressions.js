// Chord progressions to comp and jam over. Written in a home key; the Jam screen transposes.
// Each bar holds one chord or two (two beats each).
export const PROGS = [
  { id: '251', name: 'ii–V–I major', key: 'C', bars: ['Dm7', 'G7', 'Cmaj7', 'Cmaj7'],
    about: 'The most common move in jazz. The 7th of each chord slides down a half step into the 3rd of the next.' },
  { id: '251m', name: 'ii–V–i minor', key: 'C', bars: ['Dm7b5', 'G7b9', 'Cm6', 'Cm6'],
    about: 'The minor-key version: half-diminished ii, a ♭9 on the V, minor 6 home.' },
  { id: 'turn', name: 'I–vi–ii–V turnaround', key: 'C', bars: [['C6', 'A7'], ['Dm7', 'G7'], ['C6', 'A7'], ['Dm7', 'G7']],
    about: 'Loops forever. The vi chord becomes A7 to pull harder toward Dm7.' },
  { id: 'blues', name: 'Jazz blues', key: 'F', bars: ['F7', 'Bb7', 'F7', ['Cm7', 'F7'], 'Bb7', 'Bdim7', 'F7', 'D7', 'Gm7', 'C7', ['F7', 'D7'], ['Gm7', 'C7']],
    about: 'Twelve bars, dressed up: a ii–V into the IV, a diminished passing chord, and a turnaround at the end.' },
  { id: 'blues-a', name: 'Swing blues', key: 'A', bars: ['A7', 'D7', 'A7', 'A7', 'D7', 'D7', 'A7', 'A7', 'E7', 'D7', 'A7', 'E7'],
    about: 'The plain 12-bar blues that swing bands rode for hours. Good for the shuffle riff and the blues licks.' },
  { id: 'rhythm', name: 'Rhythm changes (A section)', key: 'Bb', bars: [['Bb6', 'G7'], ['Cm7', 'F7'], ['Bb6', 'G7'], ['Cm7', 'F7'], ['Bb6', 'Bb7'], ['Eb6', 'Edim7'], ['Bb6', 'F7'], 'Bb6'],
    about: 'From Gershwin’s “I Got Rhythm”. Hundreds of bebop tunes were written over these changes.' },
  { id: 'minor-swing', name: 'Gypsy minor swing', key: 'A', bars: ['Am6', 'Am6', 'Dm6', 'Dm6', 'E7', 'E7', 'Am6', 'Am6'],
    about: 'The classic gypsy-jazz minor vamp: i, iv and V in A minor. Try the minor 6 and diminished licks over it with la pompe.' },
  { id: 'cycle', name: 'Dominant cycle', key: 'C', bars: ['E7', 'E7', 'A7', 'A7', 'D7', 'D7', 'G7', 'G7', 'C6', 'C6'],
    about: 'Dominant 7ths falling round the circle of 5ths, two bars each (the trick behind “Sweet Georgia Brown”). Great for practising 3rds and 7ths.' },
];
export const progById = id => PROGS.find(p => p.id === id);

export const COMPS = [
  { id: 'four', name: 'Four to the bar', blurb: 'Freddie Green style: short, even downstrokes on every beat. Let go of the chord between strums so it does not ring.' },
  { id: 'charleston', name: 'Charleston', blurb: 'Hit beat 1, then the “and” of 2. The comping rhythm everyone uses.' },
  { id: 'pompe', name: 'La pompe', blurb: 'Gypsy-jazz rhythm: a soft low strum on 1 and 3, then an upstroke and a sharp, choked strum on 2 and 4.' },
  { id: 'push', name: 'Push the 4', blurb: 'Hit the “and” of 4 and let it ring over the bar line, so the next chord arrives early.' },
  { id: 'sparse', name: 'Free comping', blurb: 'Hits on the off-beats that change every bar, the way a pianist comps behind a soloist.' },
  { id: 'none', name: 'No guitar', blurb: 'Just bass and drums, so you can comp or solo yourself.' },
];
