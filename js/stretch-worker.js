// Time stretch that keeps the pitch (WSOLA: waveform-similarity overlap-add).
// In:  { id, chans: [Float32Array...], speed, sr }   speed 0.5 = half as fast, same pitch
// Out: { id, chans: [Float32Array...] }               length = input length / speed
// Runs in a worker so long sections don't freeze the page.

self.onmessage = e => {
  const { id, chans, speed, sr } = e.data;
  const out = wsola(chans, speed, sr);
  self.postMessage({ id, chans: out }, out.map(c => c.buffer));
};

function wsola(chans, speed, sr) {
  const n = chans[0].length;
  const N = 2 * Math.round(sr * 0.023);          // ~46 ms frames
  const Hs = N / 2;                                // 50% overlap on the output side
  const Ha = Hs * speed;                           // input hop
  const tol = Math.round(sr * 0.011);              // search ±11 ms for the best-matching frame
  const outLen = Math.max(1, Math.floor(n / speed));
  const win = new Float32Array(N);
  for (let i = 0; i < N; i++) win[i] = 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / N);

  // mono guide signal for the similarity search
  let mono = chans[0];
  if (chans.length > 1) {
    mono = new Float32Array(n);
    for (let c = 0; c < chans.length; c++) { const x = chans[c]; for (let i = 0; i < n; i++) mono[i] += x[i]; }
  }
  const at = i => (i >= 0 && i < n ? mono[i] : 0);

  const out = chans.map(() => new Float32Array(outLen + N));
  const norm = new Float32Array(outLen + N);
  const STEP = 4;                                   // correlate on every 4th sample (plenty for this job)
  let prev = 0;
  for (let k = 0, o = 0; o < outLen; k++, o += Hs) {
    const nominal = Math.round(k * Ha);
    let pos = nominal;
    if (k > 0) {
      // the frame that would naturally follow the previous one
      const target = prev + Hs;
      let best = -Infinity;
      const lo = Math.max(-nominal, -tol), hi = tol;
      for (let d = lo; d <= hi; d += 2) {
        const c = nominal + d;
        let dot = 0, en = 1e-9;
        for (let i = 0; i < Hs; i += STEP) { const v = at(c + i); dot += v * at(target + i); en += v * v; }
        const score = dot / Math.sqrt(en);
        if (score > best) { best = score; pos = c; }
      }
    }
    for (let ch = 0; ch < chans.length; ch++) {
      const x = chans[ch], y = out[ch];
      for (let i = 0; i < N; i++) { const j = pos + i; if (j >= 0 && j < n) y[o + i] += win[i] * x[j]; }
    }
    for (let i = 0; i < N; i++) norm[o + i] += win[i];
    prev = pos;
  }
  return out.map(y => {
    const r = new Float32Array(outLen);
    for (let i = 0; i < outLen; i++) r[i] = y[i] / Math.max(norm[i], 1e-3);
    return r;
  });
}
