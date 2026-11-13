// Turns chords into a band: comping guitar, walking bass, brushes/ride, plus lick playback.
import * as A from './audio.js';
import { parseChord, chordPcs, fretMidi } from './theory.js';
import { voicingFor } from './data/chords.js';
import { chordTimeline } from './data/licks.js';

// random that changes per cycle but repeats for the same seed
function rng(seed) { let s = seed * 9301 + 49297; return () => ((s = (s * 9301 + 49297) % 233280) / 233280); }

// ---- comping -----------------------------------------------------------------------------
export function compEvents(tl, style, { fam = 'shell', seed = 1, vol = 1 } = {}) {
  if (style === 'none') return [];
  const ev = []; const r = rng(seed);
  let near = 5;
  const voiced = tl.map(c => {
    const v = c.sym === '—' ? null : voicingFor(c.sym, style === 'pompe' ? 'four' : fam, near);
    if (v) near = v.avg;
    return { ...c, v };
  });
  const hit = (b, v, len, vel, up = false) => v && ev.push({ b, len, kind: 'comp', play: (t, dur) => A.strum(v.midis, t, { vel: vel * vol, len: dur, up }) });
  const bars = Math.ceil(tl.reduce((a, c) => Math.max(a, c.b + c.len), 0) / 4);
  const at = b => voiced.find(c => b >= c.b - 1e-6 && b < c.b + c.len - 1e-6) || voiced[voiced.length - 1];
  for (let bar = 0; bar < bars; bar++) {
    const B = bar * 4;
    const nextBar = voiced.find(c => c.b >= B + 4 - 1e-6) || voiced[0];
    if (style === 'four') for (let k = 0; k < 4; k++) hit(B + k, at(B + k).v, 0.42, k % 2 ? 0.5 : 0.42);
    else if (style === 'charleston') { hit(B, at(B).v, 1.2, 0.55); hit(B + 1.5, at(B + 1.5).v, 0.35, 0.45, true); if (at(B + 2).b === B + 2) { hit(B + 2, at(B + 2).v, 1.2, 0.5); hit(B + 3.5, at(B + 3.5).v, 0.35, 0.42, true); } }
    else if (style === 'pompe') for (let k = 0; k < 4; k += 2) {
      const v = at(B + k).v; if (!v) continue;
      const low = v.midis.slice(0, 2);
      ev.push({ b: B + k, len: 0.3, kind: 'comp', play: (t, d) => A.strum(low, t, { vel: 0.38 * vol, len: d }) });
      hit(B + k + 0.5, at(B + k + 0.5).v, 0.08, 0.16, true);
      hit(B + k + 1, at(B + k + 1).v, 0.3, 0.68);
    }
    else if (style === 'push') { hit(B, at(B).v, 1.5, 0.55); hit(B + 3.5, nextBar.v, 1.5, 0.5); }
    else if (style === 'sparse') {
      const spots = [[0, 1.5], [0.5, 0.4], [1.5, 0.4], [2, 1], [2.5, 0.4], [3.5, 1.2]];
      const n = 1 + Math.floor(r() * 3);
      const pick = spots.filter(() => r() < n / spots.length * 1.4).slice(0, n);
      if (!pick.length) pick.push(spots[r() < 0.5 ? 0 : 3]);
      pick.forEach(([o, l]) => hit(B + o, (o === 3.5 ? nextBar : at(B + o)).v, l, 0.45 + r() * 0.15, o % 1 !== 0 && r() < 0.5));
    }
  }
  return ev;
}

// ---- walking bass ------------------------------------------------------------------------
const nearest = (pc, prev, lo = 33, hi = 52) => {
  let best = null;
  for (let m = lo; m <= hi; m++) if (m % 12 === pc && (best == null || Math.abs(m - prev) < Math.abs(best - prev))) best = m;
  return best;
};
export function bassEvents(tl, style = 'walk', { seed = 1, vol = 1 } = {}) {
  if (style === 'none') return [];
  const ev = [], r = rng(seed + 7);
  let prev = 40;
  const note = (b, m, len, vel = 0.8) => ev.push({ b, len, kind: 'bass', play: (t, d) => A.pluck(m, t, { kind: 'b', vel: vel * vol, len: Math.max(0.08, d * 0.92) }) });
  tl.forEach((c, i) => {
    const ch = parseChord(c.sym); if (!ch) return;
    const nx = parseChord(tl[(i + 1) % tl.length].sym) || ch;
    const pcs = chordPcs(ch);
    const root = nearest(ch.root, prev);
    const nextRoot = nearest(nx.root, root);
    if (style === 'two') {
      note(c.b, root, 2, 0.85);
      if (c.len >= 4) note(c.b + 2, nearest(pcs[2], root), 2, 0.75);
      prev = root; return;
    }
    const approach = nextRoot + (r() < 0.5 ? 1 : -1) * (nextRoot === root ? 2 : 1);
    if (c.len <= 2) { note(c.b, root, 1); note(c.b + 1, approach, 1, 0.7); prev = approach; return; }
    // four beats: root, a chord or scale tone, a chord tone, approach note
    const third = nearest(pcs[1], root + 3), fifth = nearest(pcs[2], root + 6);
    const shapes = [[root, third, fifth], [root, fifth, third], [root, root + 2, third], [root, nearest(pcs[3] ?? pcs[2], root - 3), fifth]];
    const line = shapes[Math.floor(r() * shapes.length)];
    line.forEach((m, k) => note(c.b + k, m, 1, k === 0 ? 0.9 : 0.72));
    note(c.b + 3, approach, 1, 0.7);
    prev = approach;
  });
  return ev;
}

// ---- drums -------------------------------------------------------------------------------
export function drumEvents(beats, style = 'ride', { vol = 1 } = {}) {
  if (style === 'none') return [];
  const ev = [];
  for (let b = 0; b < beats; b++) {
    const two = b % 2 === 1;
    if (style === 'ride') {
      ev.push({ b, kind: 'drum', play: t => A.ride(t, (two ? 0.8 : 0.65) * vol) });
      if (two) ev.push({ b: b + 0.5, kind: 'drum', play: t => A.ride(t, 0.42 * vol) });
      if (two) ev.push({ b, kind: 'drum', play: t => A.hat(t, 0.7 * vol) });
      ev.push({ b, kind: 'drum', play: t => A.kick(t, 0.22 * vol) });
    } else if (style === 'brush') {
      ev.push({ b, kind: 'drum', play: t => A.brush(t, (two ? 0.75 : 0.5) * vol, two ? 0.12 : 0.3) });
      if (two) ev.push({ b, kind: 'drum', play: t => A.hat(t, 0.45 * vol) });
    } else if (style === 'hat') {
      if (two) ev.push({ b, kind: 'drum', play: t => A.hat(t, 0.8 * vol) });
    }
  }
  return ev;
}

// ---- click / count-in ------------------------------------------------------------------
export function clickEvents(beats, { sound = 'click', accent = 'one', per = 4 } = {}) {
  const ev = [];
  for (let b = 0; b < beats; b++) {
    const k = b % per;
    const lvl = accent === 'one' ? (k === 0 ? 2 : 1) : accent === 'twofour' ? (k % 2 ? 2 : 0.6) : 1;
    ev.push({ b, kind: 'click', play: t => A.click(t, lvl, sound) });
  }
  return ev;
}

// ---- lick notes ------------------------------------------------------------------------
export function lickEvents(notes, { vol = 1, offset = 0 } = {}) {
  const ev = [];
  let prev = null;
  notes.forEach((n, i) => {
    if (n.rest) { prev = null; return; }
    const midis = n.p.map(q => fretMidi(q.s, q.f));
    const legato = n.tech === 'h' || n.tech === 'p' || n.tech === 's';
    const glide = n.tech === 's' && prev ? prev[0] : null;
    const bend = n.tech === 'b' ? midis[0] + 1 : n.tech === 'b2' ? midis[0] + 2 : null;
    const nextRest = notes[i + 1]?.rest;
    const len = n.d * (nextRest ? 0.95 : 1.05);
    ev.push({
      b: n.b + offset, len, kind: 'lick', idx: i,
      play: (t, d) => midis.forEach((m, k) => A.pluck(m, t + k * 0.008, {
        vel: (legato ? 0.5 : 0.8) * vol, len: d, glideFrom: k === 0 ? glide : null, bendTo: bend,
      })),
    });
    prev = midis;
  });
  return ev;
}

export const timeline = chords => chordTimeline(chords);
