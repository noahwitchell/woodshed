// Today: practice time (counted automatically while anything plays), a daily routine that
// rotates its drills, lick of the day, and short lessons.
import { h, icon, fmtTime } from '../ui.js';
import { S, save, today, dayKey, streak, lickState } from '../store.js';
import { LICKS } from '../data/licks.js';
import { RHYTHM, TECH } from '../data/drills.js';
import { progById } from '../data/progressions.js';

let el, go;
const dayIndex = () => Math.floor(new Date(dayKey() + 'T12:00:00').getTime() / 864e5);
const JAM_FOR = { 'Swing blues': 'blues-a', 'Gypsy jazz': 'minor-swing', 'Riffs': 'blues-a', 'Turnarounds & endings': 'turn' };
const jamFor = l => l.id === 'minor-251' ? '251m' : l.id === 'the-lick' ? '251' : JAM_FOR[l.cat] || '251';

export function lickOfDay() {
  // favour licks you haven't logged a tempo for yet
  // and the easiest of those first
  const fresh = LICKS.filter(l => !lickState(l.id).best);
  const lo = Math.min(...fresh.map(l => l.level));
  const pool = fresh.length ? fresh.filter(l => l.level === lo) : LICKS;
  return pool[dayIndex() % pool.length];
}

function routine() {
  const d = dayIndex();
  const r = RHYTHM[d % RHYTHM.length];
  const t = [TECH[1], TECH[2], TECH[3], TECH[4]][d % 4];
  const l = lickOfDay();
  return [
    { id: 'tune', min: 1, title: 'Tune up', sub: 'By ear or with the mic', go: () => go('tuner') },
    { id: 'warm', min: 3, title: 'Warm up: chromatic spider', sub: 'Alternate picking, one finger per fret', go: () => go('licks', { tech: 'spider' }) },
    { id: 'rhythm', min: 5, title: `Rhythm: ${r.title}`, sub: progById(r.prog).name, go: () => go('licks', { rhythm: r.id }) },
    { id: 'tech', min: 5, title: t.title, sub: 'Learn where the chord tones are', go: () => go('licks', { tech: t.id }) },
    { id: 'lick', min: 10, title: `Lick of the day: ${l.title}`, sub: `${l.cat} · start slow, then “Your turn”`, go: () => go('licks', { lick: l.id }) },
    { id: 'jam', min: 5, title: 'Jam: use the lick', sub: `Over ${progById(jamFor(l)).name}`, go: () => go('chords', { jam: true, prog: jamFor(l) }) },
  ];
}

const LESSONS = [
  { t: 'What makes it swing?', b: `<p>Three things:</p><ol>
    <li><b>Long-short 8th notes.</b> Swung 8ths are not even. The first is longer, like the first and third notes of a triplet: <i>doo-ba doo-ba</i>. The Swing slider on the Tempo tab sets how far.</li>
    <li><b>2 and 4 are the strong beats.</b> The hi-hat closes on 2 and 4. Snap your fingers on them, and set the metronome accent to <i>2 &amp; 4</i>.</li>
    <li><b>Lay back.</b> Play slightly behind the beat, relaxed, never rushing. Accent the off-beat 8ths now and then.</li></ol>` },
  { t: 'Chord tones are home', b: `<p>Every chord has four home notes: root, 3rd, 5th and 7th. Lines sound “right” when the chord tones land on the beats. The 3rd and 7th matter most: they tell the ear whether a chord is major, minor or dominant.</p>
    <p>Switch the tab to <b>Degrees</b> in any lick to see each note’s job. Green notes are chord tones, blue notes are colour tones (9, 11, 6), amber notes are blue notes and chromatic passing notes.</p>` },
  { t: 'How to learn a lick (6 steps)', b: `<ol>
    <li>Listen to it a few times and sing it before you play it.</li>
    <li>Play it at 60–70% speed with Loop on until it is clean.</li>
    <li>Turn on <b>Your turn</b>: the lick plays, then you answer it.</li>
    <li>Turn on <b>+5 each loop</b> and see how fast you can keep it clean. Log your best tempo.</li>
    <li>Move it to another key with the − / + key buttons.</li>
    <li>Use it in a Jam. Start it on a different beat, change the rhythm, cut it in half. Then it is yours.</li></ol>` },
  { t: 'Who to listen to', b: `<p>Swing and jazz are learned by ear first. Start with:</p><ul>
    <li><b>Django Reinhardt</b>: gypsy jazz, fiery arpeggios, la pompe rhythm.</li>
    <li><b>Charlie Christian</b>: the first great electric jazz guitarist; riffs and swing blues.</li>
    <li><b>Freddie Green</b> (Count Basie Orchestra): the king of four-to-the-bar rhythm.</li>
    <li><b>Wes Montgomery</b>: thumb picking, octaves, soulful blues.</li>
    <li><b>Grant Green</b>, <b>Joe Pass</b>, <b>Jim Hall</b>: bebop lines, chord melody, space.</li></ul>
    <p>Pick one short phrase you love from a record each week and learn it by ear. That is the jazz tradition.</p>` },
  { t: 'Practise slow, practise often', b: `<p>Twenty minutes every day beats two hours on a Sunday. Play slowly enough that you make no mistakes, because your hands learn whatever you repeat, including the mistakes. Speed comes from clean repetition.</p>` },
];

function chart14() {
  const days = [];
  for (let i = 13; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i); days.push({ k: dayKey(d), d }); }
  const max = Math.max(600, ...days.map(x => S.log[x.k]?.sec || 0));
  return h('div', { class: 'days' }, ...days.map(x => {
    const sec = S.log[x.k]?.sec || 0;
    return h('div', { class: 'day' + (x.k === dayKey() ? ' today' : ''), title: `${x.k}: ${fmtTime(sec)}` },
      h('div', { class: 'day-bar' }, h('i', { style: { height: `${Math.max(sec ? 6 : 0, (sec / max) * 100)}%` } })),
      h('span', {}, 'SMTWTFS'[x.d.getDay()]));
  }));
}

export function paint() {
  if (!el) return;
  const td = today();
  const items = routine();
  const doneN = items.filter(i => td.done.includes(i.id)).length;
  const l = lickOfDay();
  el.replaceChildren(
    h('div', { class: 'stats' },
      h('div', { class: 'stat' }, h('b', { class: 'live-time' }, fmtTime(td.sec)), h('span', {}, 'today')),
      h('div', { class: 'stat' }, h('b', {}, String(streak())), h('span', {}, 'day streak')),
      h('div', { class: 'stat' }, h('b', {}, `${doneN}/${items.length}`), h('span', {}, 'routine'))),
    chart14(),
    h('p', { class: 'dim small center' }, 'Time counts by itself whenever the metronome, tuner, a lick or a jam is running.'),
    h('h2', {}, 'Today’s session'),
    h('div', { class: 'routine' }, ...items.map(it => {
      const done = td.done.includes(it.id);
      return h('div', { class: 'rt' + (done ? ' done' : '') },
        h('button', { class: 'rt-check', onclick: () => { const i = td.done.indexOf(it.id); if (i >= 0) td.done.splice(i, 1); else td.done.push(it.id); save(); paint(); } }, done ? icon('check') : ''),
        h('button', { class: 'rt-body', onclick: () => { if (!td.done.includes(it.id)) { td.done.push(it.id); save(); } it.go(); } },
          h('b', {}, it.title), h('span', {}, `${it.min} min · ${it.sub}`)),
        h('span', { class: 'rt-go' }, '›'));
    })),
    h('div', { class: 'lotd' },
      h('div', { class: 'eyebrow' }, 'Lick of the day'),
      h('b', {}, l.title), h('p', {}, l.about),
      h('button', { class: 'btn primary', onclick: () => go('licks', { lick: l.id }) }, 'Learn it')),
    h('h2', {}, 'Lessons'),
    ...LESSONS.map(x => h('details', { class: 'lesson' }, h('summary', {}, x.t), h('div', { html: x.b }))),
  );
}

export function mount(root, nav) {
  go = nav;
  el = h('section', { class: 'view practice' });
  root.append(el);
  paint();
  return el;
}
export function show() { paint(); }
export function hide() {}
export function tickTime() { const t = el?.querySelector('.live-time'); if (t) t.textContent = fmtTime(today().sec); }
