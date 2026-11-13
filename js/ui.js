// Tiny DOM helpers shared by the views.
export function h(tag, attrs = {}, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k === 'html') el.innerHTML = v;
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const c of kids.flat()) if (c != null && c !== false) el.append(c.nodeType ? c : document.createTextNode(c));
  return el;
}

// Segmented control. opts: [[value, label]]. Returns element with .set(v).
export function seg(opts, value, onChange, cls = '') {
  const el = h('div', { class: 'seg ' + cls });
  const paint = v => el.querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.v === String(v)));
  opts.forEach(([v, label]) => el.append(h('button', { 'data-v': v, html: label, onclick: () => { paint(v); onChange(v); } })));
  paint(value); el.set = paint;
  return el;
}

// Horizontal chip row (scrolls).
export function chips(opts, value, onChange, cls = '') {
  const el = seg(opts, value, onChange, 'chips ' + cls);
  // keep the selected chip in view
  requestAnimationFrame(() => { const b = el.querySelector('button.on'); if (b && el.scrollWidth > el.clientWidth) el.scrollLeft = b.offsetLeft - el.clientWidth / 2 + b.offsetWidth / 2; });
  return el;
}

// − value + stepper with press-and-hold repeat.
export function stepper({ value, min, max, step = 1, fmt = v => v, onChange, big = false }) {
  let v = value;
  const out = h('span', { class: 'step-val' }, fmt(v));
  const set = nv => { v = Math.max(min, Math.min(max, nv)); out.textContent = fmt(v); onChange(v); };
  const btn = (d, label) => {
    let rep = 0, del = 0;
    const stop = () => { clearTimeout(del); clearInterval(rep); };
    return h('button', {
      class: 'step-btn', html: label,
      onpointerdown: e => { e.preventDefault(); set(v + d); del = setTimeout(() => { rep = setInterval(() => set(v + d), 70); }, 380); },
      onpointerup: stop, onpointerleave: stop, onpointercancel: stop,
    });
  };
  const el = h('div', { class: 'stepper' + (big ? ' big' : '') }, btn(-step, '−'), out, btn(step, '+'));
  el.set = nv => { v = nv; out.textContent = fmt(v); };
  return el;
}

export function toggle(label, on, onChange) {
  const el = h('button', { class: 'tog' + (on ? ' on' : ''), onclick: () => { on = !on; el.classList.toggle('on', on); onChange(on); } },
    h('span', { class: 'tog-dot' }), h('span', {}, label));
  el.set = v => { on = v; el.classList.toggle('on', v); };
  return el;
}

export const icon = name => h('span', { class: 'ico', html: ICONS[name] || '' });
export const ICONS = {
  play: '<svg viewBox="0 0 24 24"><path d="M7 4.5v15l13-7.5z" fill="currentColor"/></svg>',
  stop: '<svg viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor"/></svg>',
  back: '<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  star: '<svg viewBox="0 0 24 24"><path d="M12 3.5l2.6 5.6 6 .7-4.5 4.1 1.2 6-5.3-3-5.3 3 1.2-6L3.4 9.8l6-.7z" fill="currentColor"/></svg>',
  check: '<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  loop: '<svg viewBox="0 0 24 24"><path d="M4 12a6 6 0 0 1 6-6h8m-3-3 3 3-3 3M20 12a6 6 0 0 1-6 6H6m3 3-3-3 3-3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  mic: '<svg viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor"/><path d="M6 11a6 6 0 0 0 12 0M12 17v4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  ear: '<svg viewBox="0 0 24 24"><path d="M7 9a5 5 0 0 1 10 0c0 3-3 4-3 7a2.5 2.5 0 0 1-5 0M10 9a2 2 0 0 1 4 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  folder: '<svg viewBox="0 0 24 24"><path d="M3 7.5A1.5 1.5 0 0 1 4.5 6H9l2 2h8.5A1.5 1.5 0 0 1 21 9.5v8a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
  trash: '<svg viewBox="0 0 24 24"><path d="M5 7h14M10 7V5h4v2M7 7l1 12h8l1-12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  rewind: '<svg viewBox="0 0 24 24"><path d="M6 5v14" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/><path d="M19 5.5v13L9 12z" fill="currentColor"/></svg>',
  // tab bar
  practice: '<svg viewBox="0 0 24 24"><path d="M4 20V10l8-6 8 6v10h-5v-6H9v6z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
  licks: '<svg viewBox="0 0 24 24"><path d="M3 7h18M3 11h18M3 15h18M3 19h18" stroke="currentColor" stroke-width="1.3" opacity=".55"/><circle cx="7" cy="11" r="2.6" fill="currentColor"/><circle cx="12" cy="15" r="2.6" fill="currentColor"/><circle cx="17" cy="7" r="2.6" fill="currentColor"/></svg>',
  chords: '<svg viewBox="0 0 24 24"><path d="M5 4h14M5 4v16M9.7 4v16M14.3 4v16M19 4v16M5 9h14M5 14h14" fill="none" stroke="currentColor" stroke-width="1.4" opacity=".6"/><circle cx="9.7" cy="11.5" r="2.4" fill="currentColor"/><circle cx="14.3" cy="6.5" r="2.4" fill="currentColor"/><circle cx="19" cy="16.5" r="2.4" fill="currentColor"/></svg>',
  metro: '<svg viewBox="0 0 24 24"><path d="M9 3h6l4 18H5z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M12 16l5-9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  tuner: '<svg viewBox="0 0 24 24"><path d="M4 16a8 8 0 0 1 16 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M12 16l3.5-6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><circle cx="12" cy="16" r="1.8" fill="currentColor"/></svg>',
};

export function fmtTime(sec) {
  sec = Math.floor(sec);
  const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
  return h ? `${h}h ${m}m` : m ? `${m}m ${String(s).padStart(2, '0')}s` : `${s}s`;
}
