// Everything persists in localStorage 'woodshed.v1'. Never change its shape without a migration.
const KEY = 'woodshed.v1';
const base = () => ({
  v: 1,
  log: {},            // 'YYYY-MM-DD' -> { sec, done: [routine ids] }
  licks: {},          // id -> { fav, best (bpm), plays }
  metro: { bpm: 120, beats: 4, sub: 'swing', swing: 0.62, accent: 'twofour', sound: 'wood', speed: { on: false, step: 4, every: 4, max: 200 }, gap: { on: false, play: 2, mute: 2 } },
  tuner: { mode: 'mic', tuning: 'std', a4: 440, timbre: 'pluck' },
  player: { labels: 'degrees', backing: true, countIn: true, loop: true, call: false, speedUp: false },
  jam: { prog: '251', key: null, comp: 'four', bass: 'walk', drums: 'ride', fam: 'shell', bpm: 140 },
  chords: { root: 0, fam: 'shell' },
  lastTab: 'practice',
});
export let S;
try { S = Object.assign(base(), JSON.parse(localStorage.getItem(KEY) || '{}')); } catch { S = base(); }
// fill nested defaults added later
const d = base();
for (const k of ['metro', 'tuner', 'player', 'jam', 'chords']) S[k] = Object.assign({}, d[k], S[k]);
S.metro.speed = Object.assign({}, d.metro.speed, S.metro.speed);
S.metro.gap = Object.assign({}, d.metro.gap, S.metro.gap);

let t = 0;
export function save() { clearTimeout(t); t = setTimeout(() => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch {} }, 150); }

export const dayKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
export const today = () => (S.log[dayKey()] ||= { sec: 0, done: [] });
export const lickState = id => (S.licks[id] ||= { fav: false, best: 0, plays: 0 });

export function streak() {
  let n = 0; const d = new Date();
  if (!(S.log[dayKey(d)]?.sec >= 60)) d.setDate(d.getDate() - 1); // today not started yet doesn't break it
  while (S.log[dayKey(d)]?.sec >= 60) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
