// Licks & drills: a library list and a player that loops a lick over a swinging band.
import { h, seg, chips, stepper, toggle, icon } from '../ui.js';
import { S, save, lickState } from '../store.js';
import { T, onTransport, swingBeat } from '../clock.js';
import * as A from '../audio.js';
import { LICKS, CATS, parseNotes, chordTimeline, shiftNotes } from '../data/licks.js';
import { TECH, RHYTHM } from '../data/drills.js';
import { PROGS, COMPS, progById } from '../data/progressions.js';
import { renderTab, paintTab, unswing } from '../tab.js';
import { compEvents, bassEvents, drumEvents, clickEvents, lickEvents } from '../backing.js';
import { transposeChord, parseChord, pcName, prettyChord, NAME_PC } from '../theory.js';
import { voicingFor } from '../data/chords.js';
import { chordBox } from '../diagram.js';

let el, listEl, playerEl, raf = 0;
let section = 'licks', cat = 'all';
let cur = null;    // { item, kind: 'lick'|'tech'|'rhythm', shift, bpm, notes, tl, view }

const P = () => S.player;
const OWNER = 'licks';
const keyPcOf = item => NAME_PC[(item.key || item.chords.flat().find(c => c !== '—') || 'C').split(' ')[0].replace(/m.*/, '')] ?? 0;

// ---- list -------------------------------------------------------------------------
function levelDots(n) { return h('span', { class: 'lvl', title: `Level ${n}` }, ...[1, 2, 3].map(k => h('i', { class: k <= n ? 'on' : '' }))); }

function card(item, kind) {
  const st = lickState(item.id);
  return h('button', { class: 'lick-card', onclick: () => open(item, kind) },
    h('div', { class: 'lc-top' }, h('b', {}, item.title), st.fav ? h('span', { class: 'fav-on' }, icon('star')) : null),
    h('div', { class: 'lc-meta' },
      kind === 'lick' ? h('span', { class: 'tag' }, item.cat) : null,
      item.key ? h('span', {}, item.key) : kind === 'rhythm' ? h('span', {}, progById(item.prog).name) : null,
      item.level ? levelDots(item.level) : null,
      st.best ? h('span', { class: 'best' }, `✓ ${st.best} BPM`) : null),
  );
}

function paintList() {
  listEl.replaceChildren();
  if (section === 'licks') {
    const cats = [['all', 'All'], ['fav', '★ Saved'], ...CATS.map(c => [c, c])];
    listEl.append(chips(cats, cat, v => { cat = v; paintList(); }));
    const items = LICKS.filter(l => cat === 'all' || (cat === 'fav' ? lickState(l.id).fav : l.cat === cat));
    listEl.append(h('div', { class: 'cards' }, ...items.map(l => card(l, 'lick'))));
    if (!items.length) listEl.append(h('p', { class: 'hint' }, 'Nothing saved yet. Tap ☆ on a lick to save it here.'));
  } else if (section === 'tech') {
    listEl.append(h('p', { class: 'hint' }, 'Exercises for your hands: picking, fingering and finding chord tones. Start slow with the click, then speed up.'));
    listEl.append(h('div', { class: 'cards' }, ...TECH.map(t => card(t, 'tech'))));
  } else {
    listEl.append(h('p', { class: 'hint' }, 'Rhythm guitar is half of swing. Strum along with the band, and lock in with the hi-hat on 2 and 4.'));
    listEl.append(h('div', { class: 'cards' }, ...RHYTHM.map(r => card(r, 'rhythm'))));
  }
}

// ---- player -----------------------------------------------------------------------
export function open(item, kind = 'lick') {
  if (T.owner === OWNER) T.stop();
  cur = { item, kind, shift: 0, bpm: lickState(item.id).best || item.bpm };
  if (kind === 'rhythm') cur.bpm = item.bpm;
  if (kind !== 'rhythm' && P().slowStart !== false && !lickState(item.id).best) cur.bpm = Math.round(item.bpm * 0.7 / 5) * 5;
  build();
  listEl.hidden = true; playerEl.hidden = false; el.querySelector('.sub-seg').hidden = true;
  el.scrollTop = 0;
}
function close() {
  if (T.owner === OWNER) T.stop();
  cur = null; listEl.hidden = false; playerEl.hidden = true; el.querySelector('.sub-seg').hidden = false;
  paintList();
}

function chordsFor() {
  const { item, shift } = cur;
  const kp = (keyPcOf(item) + shift + 120) % 12;
  return item.chords.map(c => Array.isArray(c) ? c.map(x => x === '—' ? x : transposeChord(x, shift, kp)) : c === '—' ? c : transposeChord(c, shift, kp));
}
function canShift(n) {
  const notes = parseNotes(cur.item.notes);
  const fr = notes.flatMap(x => x.p.map(q => q.f + n));
  return !fr.length || (Math.min(...fr) >= 0 && Math.max(...fr) <= 17);
}

function program() {
  const { item, kind } = cur;
  const notes = cur.notes, tl = cur.tl, L = item.chords.length * 4;
  let cycle = 0, bpm = cur.bpm, phase = P().countIn ? 'count' : 'lick';
  const band = (seed, withComp = true) => {
    const ev = [];
    const comp = item.comp || (kind === 'tech' && item.click ? 'none' : 'four');
    if (withComp && comp !== 'none' && !item.chords.includes('—')) ev.push(...compEvents(tl, comp, { seed, vol: 0.75 }));
    if (!item.chords.includes('—')) ev.push(...bassEvents(tl, 'walk', { seed, vol: 0.9 }));
    ev.push(...drumEvents(L, 'ride', { vol: 0.8 }));
    return ev;
  };
  return {
    next() {
      if (phase === 'count') { phase = 'lick'; return { len: 4, tag: 'count', events: clickEvents(4, { sound: 'wood', accent: 'one' }) }; }
      if (phase === 'you') {
        phase = P().loop ? 'lick' : 'end';
        return { len: L, tag: 'you', events: P().backing && !item.click ? band(cycle * 3 + 1) : clickEvents(L, { sound: 'wood', accent: 'twofour' }) };
      }
      if (phase === 'end') return null;
      const ev = lickEvents(notes);
      if (P().backing && !item.click) ev.push(...band(cycle * 3));
      else ev.push(...clickEvents(L, { sound: 'wood', accent: item.click ? 'one' : 'twofour' }));
      const s = { len: L, tag: 'lick', events: ev };
      if (cycle > 0 && P().speedUp) { bpm = Math.min(300, bpm + 5); s.bpm = bpm; cur.bpm = bpm; }
      cycle++;
      phase = P().call ? 'you' : P().loop ? 'lick' : 'end';
      return s;
    },
  };
}

function rhythmProgram() {
  const { item } = cur;
  const tl = cur.tl, L = cur.bars * 4;
  let cycle = 0, first = P().countIn;
  const lick = item.lick ? parseNotes(LICKS.find(l => l.id === item.lick).notes) : null;
  return {
    next() {
      if (first) { first = false; return { len: 4, tag: 'count', events: clickEvents(4, { sound: 'wood' }) }; }
      const ev = [];
      if (cur.guitar) {
        if (lick) {
          // shuffle riff moved to each chord's root (A7 on 5+4, D7 on 4+3, E7 on 6+5)
          tl.forEach(c => {
            const root = parseChord(c.sym).root;
            const s = root === 2 ? 1 : root === 4 ? -1 : 0; // string move
            const bars = c.len / 4;
            for (let k = 0; k < bars; k++) {
              const moved = lick.slice(0, 8).map(n => ({ ...n, b: n.b + c.b + k * 4, p: n.p.map(q => ({ s: q.s - s, f: q.f })) }));
              const bar2 = (c.b / 4 + k) % 2 === 1;
              ev.push(...lickEvents(bar2 ? lick.slice(8).map(n => ({ ...n, b: n.b - 4 + c.b + k * 4, p: n.p.map(q => ({ s: q.s - s, f: q.f })) })) : moved, { vol: 0.8 }));
            }
          });
        } else ev.push(...compEvents(tl, item.comp, { seed: cycle, vol: 0.9, fam: 'shell' }));
      }
      ev.push(...bassEvents(tl, item.comp === 'pompe' ? 'two' : 'walk', { seed: cycle }));
      ev.push(...drumEvents(L, item.comp === 'pompe' ? 'brush' : 'ride'));
      cycle++;
      return { len: L, tag: 'lick', events: ev };
    },
  };
}

function play() {
  if (T.playing && T.owner === OWNER) { T.stop(); return; }
  const swing = cur.item.swing ?? (cur.kind === 'tech' && cur.item.id === 'spider' ? 0.5 : 0.62);
  T.start(cur.kind === 'rhythm' ? rhythmProgram() : program(), { bpm: cur.bpm, swing, owner: OWNER });
  lickState(cur.item.id).plays++; save();
}

function build() {
  if (cur.kind === 'rhythm') return buildRhythm();
  const { item } = cur;
  const st = lickState(item.id);
  cur.notes = shiftNotes(parseNotes(item.notes), cur.shift);
  const chords = chordsFor();
  cur.tl = chordTimeline(chords);
  const keyPc = (keyPcOf(item) + cur.shift + 120) % 12;
  const keyLabel = item.key ? `${pcName(keyPc, keyPc)}${item.key.includes('minor') ? ' minor' : ''}`.replace('b', '♭').replace('#', '♯') : '';
  const tabBox = h('div', { class: 'tab-box' });
  const drawTab = () => {
    const w = Math.min(900, (playerEl.clientWidth || 360) - 8);
    cur.view = renderTab(cur.notes, cur.tl, { bars: item.chords.length, width: Math.max(300, w), labels: P().labels, keyPc });
    tabBox.innerHTML = cur.view.svg;
  };
  const banner = h('div', { class: 'banner' });
  const bpmStep = stepper({ value: cur.bpm, min: 40, max: 300, step: 5, fmt: v => `${v} BPM`, onChange: v => { cur.bpm = v; if (T.owner === OWNER && T.playing) T.setBpm(v); } });
  const playBtn = h('button', { class: 'play-big', onclick: play });
  const favBtn = h('button', { class: 'icon-btn' + (st.fav ? ' fav-on' : ''), title: 'Save', onclick: () => { st.fav = !st.fav; save(); favBtn.classList.toggle('fav-on', st.fav); } }, icon('star'));
  const bestEl = h('span', { class: 'best' }, st.best ? `Best: ${st.best} BPM` : '');
  const nailed = h('button', { class: 'pill', onclick: () => {
    const b = T.owner === OWNER && T.playing ? T.bpm : cur.bpm;
    if (b > st.best) st.best = b; save(); bestEl.textContent = `Best: ${st.best} BPM`;
    nailed.textContent = '✓ Logged'; setTimeout(() => (nailed.textContent = 'I nailed it at this tempo'), 1400);
  } }, 'I nailed it at this tempo');

  const keyCtl = item.key ? h('div', { class: 'key-ctl' },
    h('button', { class: 'step-btn', onclick: () => { for (let n = cur.shift - 1; n >= cur.shift - 12; n--) if (canShift(n)) { cur.shift = n; break; } restart(); } }, '−'),
    h('span', { class: 'step-val' }, keyLabel),
    h('button', { class: 'step-btn', onclick: () => { for (let n = cur.shift + 1; n <= cur.shift + 12; n++) if (canShift(n)) { cur.shift = n; break; } restart(); } }, '+')) : null;

  playerEl.replaceChildren(
    h('div', { class: 'player-head' },
      h('button', { class: 'icon-btn', onclick: close }, icon('back')),
      h('div', { class: 'ph-title' }, h('b', {}, item.title), h('span', { class: 'dim small' }, [item.cat, item.level ? `level ${item.level}` : null].filter(Boolean).join(' · '))),
      favBtn),
    h('p', { class: 'about' }, item.about),
    h('div', { class: 'tab-wrap' }, banner, tabBox),
    h('div', { class: 'row gap wrap center' },
      seg([['frets', 'Frets'], ['notes', 'Notes'], ['degrees', 'Degrees']], P().labels, v => { P().labels = v; save(); drawTab(); }, 'small')),
    h('div', { class: 'row center gap' }, playBtn),
    h('div', { class: 'row center gap wrap' }, bpmStep, keyCtl),
    h('div', { class: 'tog-grid' },
      toggle('Band', P().backing, v => { P().backing = v; save(); restart(); }),
      toggle('Count-in', P().countIn, v => { P().countIn = v; save(); }),
      toggle('Loop', P().loop, v => { P().loop = v; save(); restart(); }),
      toggle('Your turn', P().call, v => { P().call = v; save(); restart(); }),
      toggle('+5 each loop', P().speedUp, v => { P().speedUp = v; save(); }),
    ),
    h('p', { class: 'dim small center' }, '“Your turn” plays the lick, then gives you the same bars to play it back over the band.'),
    h('div', { class: 'tip' }, h('b', {}, 'How to practise it: '), item.tip),
    h('div', { class: 'row center gap wrap' }, nailed, bestEl),
    h('p', { class: 'dim small center' }, 'Degrees show each note’s job in the chord: green = chord tones (R 3 5 7), blue = colour tones (9, 11, 6), amber = blue notes and chromatic passing notes.'),
  );
  drawTab();
  cur.paint = () => {
    const playing = T.playing && T.owner === OWNER;
    playBtn.replaceChildren(icon(playing ? 'stop' : 'play')); playBtn.classList.toggle('on', playing);
    if (playing) bpmStep.set(T.bpm);
  };
  cur.frame = () => {
    const w = T.playing && T.owner === OWNER ? T.where() : null;
    if (!w) { paintTab(tabBox, cur.view, null, null); banner.textContent = ''; banner.className = 'banner'; return; }
    const tag = w.seg.tag;
    banner.className = 'banner ' + tag;
    if (tag === 'count') { banner.textContent = `Count-in · ${Math.floor(w.local) + 1}`; paintTab(tabBox, cur.view, null, null); return; }
    banner.textContent = tag === 'you' ? 'Your turn' : '';
    const local = w.local, sw = T.swing;
    let idx = null;
    if (tag === 'lick') cur.notes.forEach((n, i) => { if (!n.rest && local >= swingBeat(n.b, sw) - 0.02 && local < swingBeat(n.b + n.d, sw) - 0.02) idx = i; });
    paintTab(tabBox, cur.view, unswing(local, sw), idx);
  };
  cur.redraw = drawTab;
  cur.paint();
}

function restart() {
  const was = T.playing && T.owner === OWNER;
  if (was) T.stop();
  build();
  if (was) play();
}

function buildRhythm() {
  const { item } = cur;
  const prog = progById(item.prog);
  cur.guitar ??= true;
  cur.key ??= prog.key;
  const n = NAME_PC[cur.key] - NAME_PC[prog.key];
  const bars = item.lick ? prog.bars : prog.bars.map(b => Array.isArray(b) ? b.map(c => transposeChord(c, n, NAME_PC[cur.key])) : transposeChord(b, n, NAME_PC[cur.key]));
  cur.bars = bars.length;
  cur.tl = chordTimeline(bars);
  const comp = COMPS.find(c => c.id === item.comp);
  const grid = h('div', { class: 'strum-grid' }, ...item.grid.map((s, i) => h('div', { class: 'sg-cell' + (item.accent.includes(i) ? ' acc' : '') + (s ? ' hit' : '') },
    h('span', { class: 'sg-count' }, i % 2 ? '&' : String(i / 2 + 1)), h('b', {}, s === 'D' ? '↓' : s === 'U' ? '↑' : s === 'u' ? '↑' : ''))));
  const chart = h('div', { class: 'chart' }, ...bars.map((b, i) => h('div', { class: 'bar', 'data-bar': i }, ...(Array.isArray(b) ? b : [b]).map(c => h('span', {}, prettyChord(c))))));
  const shape = h('div', { class: 'shape-box' });
  const playBtn = h('button', { class: 'play-big', onclick: play });
  const bpmStep = stepper({ value: cur.bpm, min: 40, max: 300, step: 5, fmt: v => `${v} BPM`, onChange: v => { cur.bpm = v; if (T.owner === OWNER && T.playing) T.setBpm(v); } });
  const keys = item.lick ? null : h('select', { class: 'select', onchange: e => { cur.key = e.target.value; restart(); } },
    ...['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'].map(k => h('option', { value: k, selected: k === cur.key }, k.replace('b', '♭').replace('#', '♯'))));
  let lastSym = null;
  const showShape = sym => {
    if (sym === lastSym) return; lastSym = sym;
    const v = voicingFor(sym, item.comp === 'pompe' ? 'four' : 'shell', 5);
    shape.innerHTML = v ? `<div class="shape-name">${prettyChord(sym)}</div>${chordBox(v.frets, v.chord, { size: 1.2 })}` : '';
  };
  showShape(cur.tl[0].sym);
  playerEl.replaceChildren(
    h('div', { class: 'player-head' },
      h('button', { class: 'icon-btn', onclick: close }, icon('back')),
      h('div', { class: 'ph-title' }, h('b', {}, item.title), h('span', { class: 'dim small' }, prog.name)),
      h('span')),
    h('p', { class: 'about' }, item.about),
    grid, chart,
    item.lick ? h('p', { class: 'hint' }, 'Riff shape: A7 = strings 5 + 4 · D7 = strings 4 + 3 · E7 = strings 6 + 5') : shape,
    h('div', { class: 'row center gap' }, playBtn),
    h('div', { class: 'row center gap wrap' }, bpmStep, keys ? h('div', { class: 'field' }, h('label', {}, 'Key'), keys) : null),
    h('div', { class: 'tog-grid' },
      toggle('Guitar in the band', cur.guitar, v => { cur.guitar = v; restart(); }),
      toggle('Count-in', P().countIn, v => { P().countIn = v; save(); })),
    h('p', { class: 'dim small center' }, 'Turn the guitar off and play the part yourself.'),
    h('div', { class: 'tip' }, h('b', {}, `${comp ? comp.name : 'Tip'}: `), item.tip),
  );
  cur.paint = () => { const p = T.playing && T.owner === OWNER; playBtn.replaceChildren(icon(p ? 'stop' : 'play')); playBtn.classList.toggle('on', p); if (p) bpmStep.set(T.bpm); };
  cur.frame = () => {
    const w = T.playing && T.owner === OWNER ? T.where() : null;
    const beat = w && w.seg.tag === 'lick' ? w.local : -1;
    const bar = beat < 0 ? -1 : Math.floor(beat / 4);
    chart.querySelectorAll('.bar').forEach((b, i) => b.classList.toggle('on', i === bar));
    const cell = beat < 0 ? -1 : Math.floor(unswing(beat, T.swing) % 4 * 2);
    grid.querySelectorAll('.sg-cell').forEach((c, i) => c.classList.toggle('now', i === cell));
    if (beat >= 0) { const c = cur.tl.find(c => beat >= c.b && beat < c.b + c.len); if (c) showShape(c.sym); }
  };
  cur.paint();
}

function loop() {
  raf = requestAnimationFrame(loop);
  if (cur && cur.frame) cur.frame();
}

export function mount(root) {
  el = h('section', { class: 'view licks' });
  listEl = h('div', { class: 'lick-list' });
  playerEl = h('div', { class: 'player', hidden: true });
  el.append(
    seg([['licks', 'Licks'], ['tech', 'Technique'], ['rhythm', 'Rhythm']], section, v => { section = v; paintList(); }, 'sub-seg grow'),
    listEl, playerEl);
  root.append(el);
  paintList();
  onTransport(() => cur && cur.paint && cur.paint());
  window.addEventListener('resize', () => cur && cur.redraw && cur.redraw());
  return el;
}

export function show(opts = {}) {
  if (opts.lick) { const l = LICKS.find(x => x.id === opts.lick); if (l) open(l, 'lick'); }
  else if (opts.tech) { const t = TECH.find(x => x.id === opts.tech); if (t) { section = 'tech'; el.querySelector('.sub-seg').set('tech'); open(t, 'tech'); } }
  else if (opts.rhythm) { const r = RHYTHM.find(x => x.id === opts.rhythm); if (r) { section = 'rhythm'; el.querySelector('.sub-seg').set('rhythm'); open(r, 'rhythm'); } }
  else if (!cur) paintList();
  cancelAnimationFrame(raf); loop();
  if (cur && cur.redraw) requestAnimationFrame(() => cur.redraw());
}
export function hide() { cancelAnimationFrame(raf); }
