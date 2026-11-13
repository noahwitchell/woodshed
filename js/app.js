// Woodshed: tabs, routing and the automatic practice timer.
import { h, icon } from './ui.js';
import { S, save, today } from './store.js';
import { T } from './clock.js';
import * as A from './audio.js';
import { micActive } from './pitch.js';
import * as practice from './views/practice.js';
import * as licks from './views/licks.js';
import * as chords from './views/chords.js';
import * as metro from './views/metronome.js';
import * as tuner from './views/tuner.js';
import * as loop from './views/loop.js';

const TABS = [
  { id: 'practice', label: 'Today', title: 'Today', mod: practice },
  { id: 'licks', label: 'Licks', title: 'Licks & drills', mod: licks },
  { id: 'chords', label: 'Chords', title: 'Chords & jam', mod: chords },
  { id: 'metro', label: 'Tempo', title: 'Metronome', mod: metro },
  { id: 'loop', label: 'Loop', title: 'Loop practice', mod: loop },
  { id: 'tuner', label: 'Tune', title: 'Tuner', mod: tuner },
];

const main = document.querySelector('main');
const nav = document.querySelector('nav.tabs');
const titleEl = document.querySelector('.page-title');
let active = null;

function go(id, opts = {}) {
  const t = TABS.find(x => x.id === id) || TABS[0];
  if (active && active !== t) {
    active.mod.hide && active.mod.hide();
    // leaving a page stops what it was playing, except the metronome (handy while you browse)
    if (T.playing && T.owner !== 'metro' && T.owner !== t.id) T.stop();
  }
  active = t;
  TABS.forEach(x => x.el.classList.toggle('active', x === t));
  nav.querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.id === t.id));
  titleEl.textContent = t.title;
  t.el.scrollTop = 0;
  t.mod.show && t.mod.show(opts);
  S.lastTab = t.id; save();
}

for (const t of TABS) {
  t.el = t.mod.mount(main, go);
  nav.append(h('button', { 'data-id': t.id, onclick: () => go(t.id) }, icon(t.id === 'metro' ? 'metro' : t.id), h('span', {}, t.label)));
}
go(S.lastTab || 'practice');

// Practice time: count every second something is sounding or listening.
setInterval(() => {
  if (document.hidden) return;
  if (T.playing || micActive() || A.droneOn() || tuner.busy() || loop.busy()) {
    today().sec++; save();
    if (active?.id === 'practice') practice.tickTime();
  }
}, 1000);

if ('serviceWorker' in navigator && location.protocol !== 'file:') navigator.serviceWorker.register('sw.js').catch(() => {});
