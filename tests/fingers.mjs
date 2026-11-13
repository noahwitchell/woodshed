// Prints every lick's fingering: node tests/fingers.mjs [id|hard]
import { LICKS } from '../js/data/licks.js';
import { TECH } from '../js/data/drills.js';
import { parseNotes } from '../js/data/licks.js';
import { fingerNotes } from '../js/fingering.js';
const arg = process.argv[2];
for (const l of [...LICKS, ...TECH]) {
  if (arg === 'hard' ? !(l.level >= 3) : arg && l.id !== arg) continue;
  const n = parseNotes(l.notes), f = fingerNotes(n);
  console.log(`\n${l.id} (L${l.level ?? '-'})`);
  console.log(n.map((x, i) => x.rest ? 'r' : x.p.map(q => `${q.s}:${q.f}`).join('+') + (x.tech || '') + '=' + (f[i].shift ? '»' : '') + f[i].k.join('') + `[${f[i].P}]`).join(' '));
}
