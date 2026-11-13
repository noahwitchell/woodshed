// Look-ahead scheduler shared by the metronome, lick player, drills and jam.
// A "program" hands out segments one after another: { len (beats), events, bpm? , tag? }.
// Each event: { b (beat in segment), len? (beats), swing? (default true), play(t, dur, ev) }.
import { audio, wake } from './audio.js';

// Swing: the off-beat 8th moves from halfway (r = .5, straight) toward the last triplet (.667)
// or beyond. On-beat and 16th grid points move with it; triplets and odd spots are left alone.
export function swingBeat(b, r) {
  const B = Math.floor(b + 1e-9), f = b - B;
  if (r === 0.5 || Math.abs(f * 4 - Math.round(f * 4)) > 1e-6) return b;
  return B + (f <= 0.5 ? (f / 0.5) * r : r + ((f - 0.5) / 0.5) * (1 - r));
}

const listeners = new Set();
export const onTransport = fn => (listeners.add(fn), () => listeners.delete(fn));
const emit = () => listeners.forEach(fn => fn(T));

export const T = {
  playing: false, owner: null, bpm: 120, swing: 0.62,
  segs: [], anchors: [], program: null, cycle: 0, timer: 0,

  start(program, { bpm, swing, owner } = {}) {
    this.stop(true);
    const c = audio();
    if (bpm) this.bpm = bpm;
    if (swing != null) this.swing = swing;
    this.program = program; this.owner = owner || null; this.cycle = 0;
    const t0 = c.currentTime + 0.12;
    this.anchors = [{ beat: 0, time: t0, bpm: this.bpm }];
    this.segs = [];
    this.playing = true;
    wake(true);
    this.tick();
    this.timer = setInterval(() => this.tick(), 25);
    emit();
  },

  stop(quiet) {
    clearInterval(this.timer); this.timer = 0;
    const was = this.playing;
    this.playing = false; this.segs = []; this.program = null; this.owner = null;
    if (was) { wake(false); if (!quiet) emit(); }
  },

  setBpm(bpm) {
    bpm = Math.max(30, Math.min(320, Math.round(bpm)));
    if (!this.playing) { this.bpm = bpm; emit(); return; }
    const c = audio(), B = this.beatAt(c.currentTime + 0.13);
    this.anchors = this.anchors.filter(a => a.beat <= B);
    this.anchors.push({ beat: B, time: this.timeAt(B), bpm });
    this.bpm = bpm; emit();
  },

  timeAt(B) {
    let a = this.anchors[0];
    for (const x of this.anchors) if (x.beat <= B + 1e-9) a = x;
    return a.time + (B - a.beat) * 60 / a.bpm;
  },
  beatAt(t) {
    let a = this.anchors[0];
    for (const x of this.anchors) if (x.time <= t) a = x;
    return a.beat + (t - a.time) * a.bpm / 60;
  },

  tick() {
    if (!this.playing) return;
    const c = audio(), horizon = c.currentTime + 0.16;
    // make sure segments cover the horizon
    for (;;) {
      const last = this.segs[this.segs.length - 1];
      const end = last ? last.start + last.len : 0;
      if (last && this.timeAt(end) > horizon) break;
      const s = this.program.next(this.cycle++);
      if (!s) { if (!last || this.timeAt(end) < c.currentTime) { this.stop(); } return; }
      s.start = end; s.i = 0;
      s.events.sort((a, b) => a.b - b.b);
      if (s.bpm && s.bpm !== this.bpm) {
        this.anchors.push({ beat: end, time: this.timeAt(end), bpm: s.bpm });
        this.bpm = s.bpm; setTimeout(emit, Math.max(0, (this.timeAt(end) - c.currentTime) * 1000));
      }
      this.segs.push(s);
      if (this.segs.length > 6) this.segs.shift();
    }
    for (const s of this.segs) {
      while (s.i < s.events.length) {
        const ev = s.events[s.i];
        const sb = ev.swing === false ? ev.b : swingBeat(ev.b, this.swing);
        const t = this.timeAt(s.start + sb);
        if (t > horizon) break;
        s.i++;
        if (t < c.currentTime - 0.02) continue; // missed (tab was asleep)
        const eb = ev.len ? (ev.swing === false ? ev.b + ev.len : swingBeat(ev.b + ev.len, this.swing)) : sb;
        try { ev.play(Math.max(t, c.currentTime), Math.max(0.02, this.timeAt(s.start + eb) - t), ev, s); } catch (e) { console.error(e); }
      }
    }
  },

  // Where are we now (for drawing)? Returns the segment and the swung-free local beat.
  where() {
    if (!this.playing) return null;
    const c = audio();
    const t = c.currentTime - (c.outputLatency || c.baseLatency || 0);
    const B = this.beatAt(t);
    for (let i = this.segs.length - 1; i >= 0; i--) {
      const s = this.segs[i];
      if (B >= s.start) return B < s.start + s.len ? { seg: s, local: B - s.start, abs: B } : null;
    }
    return null;
  },
};

// Simple helpers for building programs.
export const loopProgram = (fn) => ({ next: fn });
