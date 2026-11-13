// Tuner: "Listen" uses the mic and a needle; "By ear" plays a reference note per string.
import { h, seg, stepper, icon } from '../ui.js';
import { S, save } from '../store.js';
import * as A from '../audio.js';
import { T } from '../clock.js';
import { startMic, stopMic, micActive, freqToMidi } from '../pitch.js';
import { midiName, pcName } from '../theory.js';

export const TUNINGS = {
  std:   { name: 'Standard', notes: [40, 45, 50, 55, 59, 64] },
  half:  { name: 'Half step down', notes: [39, 44, 49, 54, 58, 63] },
  dropd: { name: 'Drop D', notes: [38, 45, 50, 55, 59, 64] },
  dadgad:{ name: 'DADGAD', notes: [38, 45, 50, 55, 57, 62] },
  openg: { name: 'Open G', notes: [38, 43, 50, 55, 59, 62] },
};
const TU = () => S.tuner;
const tuning = () => TUNINGS[TU().tuning] || TUNINGS.std;

let el, body, needle, noteEl, centsEl, hzEl, strRow, micBtn, msgEl, earRow, earHint;
let smooth = null, lastSeen = 0, inTuneSince = 0, earOn = -1, earTimer = 0;

// ---- listen (mic) -------------------------------------------------------------------
async function toggleMic() {
  if (micActive()) { stopMic(); paintMic(); return; }
  stopEar(); if (T.playing) T.stop();
  msgEl.textContent = 'Asking for the microphone…';
  try {
    await startMic(onPitch, st => {
      if (st.error) msgEl.textContent = st.error;
      else if (st.dead) msgEl.textContent = 'No sound from the mic. Check the microphone permission in Settings.';
    });
    msgEl.textContent = 'Play one string at a time and let it ring.';
  } catch (e) {
    msgEl.innerHTML = e.name === 'NotAllowedError'
      ? 'Microphone blocked. On iPhone: Settings → Apps → Safari → Microphone → Allow (or Ask), then reopen Woodshed. Or use <b>By ear</b>.'
      : `Couldn’t open the mic (${e.name}). Try <b>By ear</b> instead.`;
  }
  paintMic();
}

function onPitch(f) {
  const n = performance.now();
  if (f && f > 60 && f < 1400) {
    const m = 69 + 12 * Math.log2(f / TU().a4);
    // a jump of more than a semitone resets the smoothing (new string)
    smooth = smooth == null || Math.abs(m - smooth) > 0.6 ? m : smooth * 0.75 + m * 0.25;
    lastSeen = n;
    const near = Math.round(smooth), cents = (smooth - near) * 100;
    noteEl.innerHTML = `${pcName(near).replace('b', '♭').replace('#', '♯')}<small>${Math.floor(near / 12) - 1}</small>`;
    centsEl.textContent = `${cents > 0 ? '+' : ''}${cents.toFixed(0)}¢`;
    hzEl.textContent = `${f.toFixed(1)} Hz`;
    const ang = Math.max(-50, Math.min(50, cents)) * 1.6;
    needle.style.transform = `rotate(${ang}deg)`;
    const good = Math.abs(cents) < 5;
    if (good && !inTuneSince) inTuneSince = n;
    if (!good) inTuneSince = 0;
    el.classList.toggle('in-tune', good && n - inTuneSince > 250);
    el.classList.toggle('flat', cents < -5); el.classList.toggle('sharp', cents > 5);
    // which string?
    const notes = tuning().notes;
    let best = 0; notes.forEach((x, i) => { if (Math.abs(smooth - x) < Math.abs(smooth - notes[best])) best = i; });
    const off = smooth - notes[best];
    strRow.querySelectorAll('.str').forEach((b, i) => {
      b.classList.toggle('near', i === best);
      if (i === best) b.querySelector('.str-hint').textContent = Math.abs(off) < 0.06 ? '✓' : off < 0 ? 'tune up ↑' : 'tune down ↓';
      else b.querySelector('.str-hint').textContent = '';
    });
  } else if (n - lastSeen > 900) {
    el.classList.remove('in-tune', 'flat', 'sharp');
    centsEl.textContent = ''; hzEl.textContent = '';
    needle.style.transform = 'rotate(0deg)';
    noteEl.innerHTML = '<span class="dim">–</span>';
    smooth = null;
  }
}

function paintMic() {
  const on = micActive();
  micBtn.replaceChildren(icon(on ? 'stop' : 'mic'), h('span', {}, on ? 'Stop listening' : 'Start listening'));
  micBtn.classList.toggle('on', on);
  if (!on) { onPitch(null); lastSeen = 0; onPitch(null); }
}

// ---- by ear -------------------------------------------------------------------------
function playRef(i) {
  if (micActive()) { stopMic(); paintMic(); }
  if (T.playing) T.stop();
  clearInterval(earTimer); A.stopDrone();
  if (earOn === i) { earOn = -1; paintEar(); return; }
  earOn = i;
  const m = tuning().notes[i], f = A.midiFreq(m, TU().a4);
  if (TU().timbre === 'pluck') {
    const cents = 1200 * Math.log2(TU().a4 / 440);
    const go = () => A.pluck(m, A.now() + 0.02, { vel: 0.8, len: 2.4, cents });
    go(); earTimer = setInterval(go, 2200);
  } else A.startDrone(f, TU().timbre === 'pure' ? 'pure' : 'tone');
  paintEar();
}
function stopEar() { clearInterval(earTimer); A.stopDrone(); earOn = -1; if (earRow) paintEar(); }
function paintEar() {
  earRow.querySelectorAll('.peg').forEach((b, i) => b.classList.toggle('on', i === earOn));
  earHint.textContent = earOn < 0 ? 'Tap a string to hear its note. Tap again to stop.'
    : `String ${6 - earOn}: ${midiName(tuning().notes[earOn]).replace('b', '♭')}. Turn the peg until the wobble between the two notes slows down and stops.`;
}

function build() {
  body.replaceChildren();
  const t = tuning();
  if (TU().mode === 'mic') {
    needle = h('div', { class: 'needle' });
    noteEl = h('div', { class: 'tn-note', html: '<span class="dim">–</span>' });
    centsEl = h('div', { class: 'tn-cents' }); hzEl = h('div', { class: 'tn-hz' });
    msgEl = h('p', { class: 'hint' }, 'Tap Start, then play one open string.');
    const ticks = h('div', { class: 'ticks' }, ...[-50, -25, 0, 25, 50].map(c => h('i', { style: { transform: `rotate(${c * 1.6}deg)` }, class: c === 0 ? 'zero' : '' })));
    strRow = h('div', { class: 'str-row' }, ...t.notes.map((m, i) => h('div', { class: 'str' },
      h('b', {}, pcName(m).replace('b', '♭')), h('span', { class: 'str-num' }, `${6 - i}`), h('span', { class: 'str-hint' }))));
    micBtn = h('button', { class: 'btn primary wide', onclick: toggleMic });
    body.append(
      h('div', { class: 'gauge' }, ticks, needle, h('div', { class: 'flat-l' }, '♭'), h('div', { class: 'sharp-l' }, '♯')),
      noteEl, h('div', { class: 'row center gap' }, centsEl, hzEl), strRow, micBtn, msgEl);
    paintMic();
  } else {
    earRow = h('div', { class: 'pegs' }, ...t.notes.map((m, i) => h('button', { class: 'peg', onclick: () => playRef(i) },
      h('span', { class: 'peg-n' }, `${6 - i}`), h('b', {}, pcName(m).replace('b', '♭')), h('span', { class: 'peg-o' }, midiName(m).replace(/\D+/, '')))));
    earHint = h('p', { class: 'hint' });
    body.append(earRow, earHint,
      h('div', { class: 'field' }, h('label', {}, 'Sound'), seg([['pluck', 'Plucked string'], ['tone', 'Steady tone'], ['pure', 'Pure']], TU().timbre, v => { TU().timbre = v; save(); const i = earOn; stopEar(); if (i >= 0) playRef(i); })),
      h('p', { class: 'dim small' }, 'Tuning by ear trains your ear too. Play your string while the reference note sounds and listen for the “beats”, a slow wah-wah wobble. The slower it gets, the closer you are.'));
    paintEar();
  }
}

export function mount(root) {
  el = h('section', { class: 'view tuner' });
  const tsel = h('select', { class: 'select', onchange: e => { TU().tuning = e.target.value; save(); stopEar(); build(); } },
    ...Object.entries(TUNINGS).map(([k, v]) => h('option', { value: k, selected: k === TU().tuning }, v.name)));
  body = h('div', { class: 'tuner-body' });
  el.append(
    h('div', { class: 'row gap wrap center' },
      seg([['mic', 'Listen (mic)'], ['ear', 'By ear']], TU().mode, v => { TU().mode = v; save(); if (micActive()) stopMic(); stopEar(); build(); }, 'grow')),
    body,
    h('div', { class: 'card row gap wrap' },
      h('div', { class: 'field' }, h('label', {}, 'Tuning'), tsel),
      h('div', { class: 'field' }, h('label', {}, 'A4'), stepper({ value: TU().a4, min: 430, max: 450, fmt: v => `${v} Hz`, onChange: v => { TU().a4 = v; save(); } })),
    ),
  );
  root.append(el);
  build();
  return el;
}

export function show() {}
export function hide() { if (micActive()) { stopMic(); } stopEar(); }
export const busy = () => micActive() || earOn >= 0;
