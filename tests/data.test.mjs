// node --test tests/  — checks every lick/drill adds up to whole bars, frets are playable,
// and every chord voicing spells only its own chord. Run with VERBOSE=1 to print note names.
import test from 'node:test';
import assert from 'node:assert/strict';
import { LICKS, parseNotes, chordTimeline, chordAt } from '../js/data/licks.js';
import { TECH, RHYTHM } from '../js/data/drills.js';
import { PROGS } from '../js/data/progressions.js';
import { checkShapes, voicingFor } from '../js/data/chords.js';
import { fingerNotes } from '../js/fingering.js';
import { fretMidi, midiName, parseChord, degreeLabel } from '../js/theory.js';

const all = [...LICKS, ...TECH];

test('every lick fills its bars exactly', () => {
  for (const l of all) {
    const n = parseNotes(l.notes);
    const total = n.reduce((a, x) => a + x.d, 0);
    assert.ok(Math.abs(total - l.chords.length * 4) < 1e-6, `${l.id}: ${total} beats vs ${l.chords.length} bars`);
    for (const x of n) for (const q of x.p) {
      assert.ok(q.s >= 1 && q.s <= 6 && q.f >= 0 && q.f <= 17, `${l.id}: bad note ${q.s}:${q.f}`);
    }
    // no note crosses a bar line except long holds starting on a beat
    if (process.env.VERBOSE) {
      const tl = chordTimeline(l.chords);
      console.log(`\n${l.title}`);
      console.log(n.map(x => x.rest ? '–' : x.p.map(q => {
        const m = fretMidi(q.s, q.f), c = parseChord(chordAt(tl, x.b).sym);
        return `${midiName(m)}${c ? '(' + degreeLabel(m, c) + ')' : ''}`;
      }).join('+')).join(' '));
    }
  }
});

test('chords parse', () => {
  for (const l of LICKS) for (const c of l.chords.flat()) assert.ok(parseChord(c), `${l.id}: ${c}`);
  for (const p of PROGS) for (const c of p.bars.flat()) {
    assert.ok(parseChord(c), `${p.id}: ${c}`);
    assert.ok(voicingFor(c, 'shell'), `${p.id}: no voicing for ${c}`);
    assert.ok(voicingFor(c, 'four'), `${p.id}: no four-note voicing for ${c}`);
  }
});

test('the band can comp every lick chord', () => {
  for (const l of LICKS) for (const c of l.chords.flat()) for (const f of ['shell', 'four']) {
    assert.ok(voicingFor(c, f), `${l.id}: no ${f} voicing for ${c}`);
  }
});

test('voicings spell their chords', () => {
  assert.deepEqual(checkShapes(), []);
});

test('rhythm drills point at real things', () => {
  for (const r of RHYTHM) {
    assert.ok(PROGS.find(p => p.id === r.prog), r.id);
    assert.equal(r.grid.length, 8);
  }
});

test('every lick and drill can be fingered (pins are playable)', () => {
  for (const l of all) {
    const n = parseNotes(l.notes), f = fingerNotes(n);
    n.forEach((x, i) => {
      if (x.rest) return;
      assert.ok(f[i] && f[i].k.length === x.p.length, `${l.id}: no fingering for note ${i}`);
      if (x.pin) x.pin.forEach((k, j) => assert.ok(!k || f[i].k[j] === k, `${l.id}: pin ignored on note ${i}`));
    });
  }
});
