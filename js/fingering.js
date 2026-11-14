// Fretting-hand fingering for a lick: 1 = index … 4 = pinky, 0 = open string.
// Dynamic programming over (hand position, finger per note). The hand sits at position P
// (index finger over fret P, one finger per fret); the index may reach back one fret and the
// pinky may stretch one fret up. Costs favour staying in position, shifting during long
// notes or rests, sliding with the same finger, hammering up / pulling off down the fingers,
// and bending with the ring finger (backed up by the others); a release stays on the bending finger.
// A token can pin fingers with "@": "3:7:.5@1", double stop "3:6+2:8:1@24" (one digit per
// '+' part, 0 = leave it to the solver).

const MAXP = 19;

// Every way to finger one note (or double stop) at hand position P.
function options(n, P) {
  const parts = n.p;
  const per = parts.map((q, i) => {
    if (q.f === 0) return [{ k: 0, dev: 0 }];
    const pin = n.pin?.[i];
    const out = [];
    for (let k = 1; k <= 4; k++) {
      if (pin && pin !== k) continue;
      const dev = q.f - (P + k - 1);
      if (dev === 0 || (k === 1 && dev === -1) || (k === 4 && dev === 1) || (Math.abs(dev) === 1 && parts.some((o, j) => j !== i && o.f === q.f))) out.push({ k, dev });
    }
    return out;
  });
  const res = [];
  const walk = (i, acc) => {
    if (i === parts.length) {
      // fingers must run the same way as frets; same finger only for a barre on one fret
      for (let a = 0; a < acc.length; a++) for (let b = a + 1; b < acc.length; b++) {
        const A = acc[a], B = acc[b], fa = parts[a].f, fb = parts[b].f;
        if (!A.k || !B.k) continue;
        if (A.k === B.k && fa !== fb) return;
        if (fa !== fb && (fa - fb) * (A.k - B.k) <= 0) return;
      }
      res.push(acc);
      return;
    }
    for (const o of per[i]) walk(i + 1, [...acc, o]);
  };
  walk(0, []);
  return res;
}

function noteCost(n, opt) {
  let c = 0;
  opt.forEach(o => {
    if (o.dev) c += 0.7;
    if (o.k === 4) c += 0.15;
  });
  const k0 = opt[0].k;
  if (n.tech === 'b' || n.tech === 'b2' || n.tech === 'b3') c += k0 === 3 ? 0 : k0 === 2 ? 0.4 : k0 === 4 ? 1.8 : 2.5;
  else if (n.tech === 'u') c += k0 === 3 ? 0 : k0 === 2 ? 0.3 : k0 === 4 ? 1.2 : 1.8;
  // quarter-tone curl: any finger nudges it, the index and ring do it best
  else if (n.tech === 'q') c += k0 === 1 || k0 === 3 ? 0 : 0.3;
  // double stops: a barre over a skipped string, or a gap of frets wider than the gap of fingers
  for (let a = 0; a < opt.length; a++) for (let b = a + 1; b < opt.length; b++) {
    const A = opt[a], B = opt[b], qa = n.p[a], qb = n.p[b];
    if (!A.k || !B.k) continue;
    if (A.k === B.k && Math.abs(qa.s - qb.s) > 1) c += 1.5;
    if (Math.abs(qa.f - qb.f) > Math.abs(A.k - B.k)) c += 1;
  }
  return c;
}

function moveCost(prev, cur, prevOpt, opt, P0, P1, gap) {
  const allOpen = n => n.p.every(q => q.f === 0);
  let c = 0;
  const dP = Math.abs(P1 - P0);
  // time to move: long notes and rests make shifts easy; open strings free the hand too
  const ease = allOpen(cur) || allOpen(prev) ? 0.25 : gap >= 1 ? 0.45 : gap >= 0.5 ? 0.8 : 1.15;
  const sl = cur.tech === 's' && prev.p.length === 1 && cur.p.length === 1 && prev.p[0].s === cur.p[0].s;
  if (sl) {
    // a slide is the shift: same finger glides along the string
    c += prevOpt[0].k === opt[0].k && opt[0].k ? 0.1 * dP : 1.5 + 0.6 * dP;
  } else if (dP) {
    c += (1.2 + 0.45 * dP) * ease;
  }
  if ((cur.tech === 'h' || cur.tech === 'p') && prev.p.length === 1 && cur.p.length === 1) {
    const a = prevOpt[0].k, b = opt[0].k;
    if (cur.tech === 'h' && b <= a) c += 10;
    if (cur.tech === 'p' && a && b >= a) c += 10;
    if (dP) c += 3;
  }
  // releasing a bend: the finger that bent it lets it down, without moving the hand
  if (cur.tech === 'u' && prev.p.length === 1 && prev.p[0].s === cur.p[0].s && prev.p[0].f === cur.p[0].f) {
    if (prevOpt[0].k !== opt[0].k) c += 10;
    if (dP) c += 3;
  }
  // same finger, same fret, next string: a roll (fine slowly, awkward fast)
  if (!sl && prev.p.length === 1 && cur.p.length === 1) {
    const a = prevOpt[0], b = opt[0], qa = prev.p[0], qb = cur.p[0];
    if (a.k && a.k === b.k && qa.s !== qb.s) c += qa.f === qb.f ? (gap >= 1 ? 0.3 : 0.9) : 1.5;
    // same finger hopping to another fret on the same string (not a written slide)
    if (a.k && a.k === b.k && qa.s === qb.s && qa.f !== qb.f) c += gap >= 1 ? 0.8 : a.k === 1 ? 1.6 : 2.4;
  }
  return c;
}

// notes: parsed lick notes. Returns [{ k: [finger per part], shift: bool }] (null for rests).
export function fingerNotes(notes) {
  const idx = notes.map((n, i) => (n.rest ? -1 : i)).filter(i => i >= 0);
  if (!idx.length) return notes.map(() => null);
  // gap before each sounding note = time since the previous sounding note started
  const gapOf = j => notes[idx[j]].b - notes[idx[j - 1]].b;
  let layer = [];
  for (let P = 1; P <= MAXP; P++) for (const opt of options(notes[idx[0]], P)) layer.push({ P, opt, cost: noteCost(notes[idx[0]], opt), back: null });
  const layers = [layer];
  for (let j = 1; j < idx.length; j++) {
    const n = notes[idx[j]], prev = notes[idx[j - 1]], gap = gapOf(j);
    const next = [];
    for (let P = 1; P <= MAXP; P++) for (const opt of options(n, P)) {
      const nc = noteCost(n, opt);
      let best = null, bc = Infinity;
      for (const s of layer) {
        const c = s.cost + moveCost(prev, n, s.opt, opt, s.P, P, gap);
        if (c < bc) { bc = c; best = s; }
      }
      if (best) next.push({ P, opt, cost: bc + nc, back: best });
    }
    if (!next.length) return notes.map(() => null);   // unplayable pin: show nothing
    layer = next; layers.push(layer);
  }
  let s = layer.reduce((a, b) => (b.cost < a.cost ? b : a));
  const chosen = [];
  for (; s; s = s.back) chosen.unshift(s);
  const out = notes.map(() => null);
  let lastP = null, lastAt = null;   // lastAt: finger -> fret on the last fretted note
  chosen.forEach((st, j) => {
    const n = notes[idx[j]];
    const fretted = n.p.some(q => q.f > 0);
    const at = {}; st.opt.forEach((o, i) => { if (o.k) at[o.k] = n.p[i].f; });
    // the hand moved: new position, or a finger from the last note now sits on another fret
    const shift = fretted && lastP != null && (st.P !== lastP || Object.keys(at).some(k => lastAt[k] != null && lastAt[k] !== at[k]));
    if (fretted) { lastP = st.P; lastAt = at; }
    out[idx[j]] = { k: st.opt.map(o => o.k), shift, P: st.P };
  });
  return out;
}
