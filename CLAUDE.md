# Woodshed — notes for Claude

- Owner: Noah. Phone practice app for swing / jazz guitar: Today (routine, auto practice timer, lessons),
  Licks (licks, technique drills, rhythm drills, player with tab + band), Chords (voicing library + Jam band),
  Tempo (swing metronome, speed + gap trainer), Loop (open/record a track, loop a section, slow it
  down without changing pitch), Tune (mic tuner or reference notes by ear).
- Same setup as ~/Claude/FretFlow / EveryDay / Coffea: installed PWA, no build step, no frameworks, no npm deps.
  Dark, flat look: no gradients, shadows or blur. Brass accent #f0a83a.
- Dev server: `woodshed` in ~/Claude/.claude/launch.json (python http.server 5184).
- Lick data lives in `js/data/licks.js` (token format documented at the top). After changing licks, drills,
  chord shapes or progressions run `node --test tests/data.test.mjs` (add `VERBOSE=1` to print every note with
  its chord degree, and check the musical claims in the `about` text against it).
- Audio: `js/audio.js` (Karplus-Strong guitar/bass, synthesized ride/hat/brush), `js/clock.js` look-ahead
  scheduler with swing, `js/backing.js` comping / walking bass / drums. Mic pitch detection copied from FretFlow.
- Content rule: no copyrighted melodies. Chord progressions and short idioms are fine (The Lick, public-domain
  "shave and a haircut").
- Data in localStorage `woodshed.v1` (js/store.js). Don't change its shape without a migration.
- Verify at phone size (375×812) before handing back. Bump CACHE in sw.js when shipping.
- Loop page: `js/views/loop.js` (UI), `js/looper.js` (engine: source cut into 6 s chunks, each stretched once and
  cached, scheduled back-to-back on the audio clock with 40 ms crossfades; pitch shift = playbackRate with the
  stretch compensating), `js/stretch-worker.js` (WSOLA, pitch-keeping), `js/loopdb.js` (IndexedDB
  'woodshed-loops': 'meta' + 'blobs' stores, audio files never go in localStorage). Loop audio goes straight to
  the destination through an L/R matrix (stereo/left/right/mono/no centre), then a Boost gain (0–24 dB, Auto =
  loudest peak to -1 dBFS, default for newly opened tracks) and a limiter; not through the guitar FX bus.
- Fingerings: `js/fingering.js` picks fretting fingers automatically (DP over hand position; costs for shifts,
  same-finger hops, bends, slides, hammer/pull direction). Pin a finger in the lick data with `@` ("3:7:.5@1",
  double stop "5:3+3:5:1@13") when the solver disagrees with the tip text or the idiom. `node tests/fingers.mjs
  [id|hard]` prints them; the data test checks every pin is playable. Tips that name fingers must match.
