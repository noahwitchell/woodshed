// Saved recordings for the Loop page, in IndexedDB (files are too big for localStorage).
// 'meta':  { id, name, dur, added, opened, state: { a, b, loop, speed, semis, cents, gap, chan }, sections: [{ name, a, b }] }
// 'blobs': { id, blob }   kept apart so listing tracks never loads the audio
const DB = 'woodshed-loops';
let dbp = null;
function db() {
  return dbp ||= new Promise((res, rej) => {
    const r = indexedDB.open(DB, 1);
    r.onupgradeneeded = () => {
      r.result.createObjectStore('meta', { keyPath: 'id' });
      r.result.createObjectStore('blobs', { keyPath: 'id' });
    };
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}
async function tx(stores, mode, fn) {
  const d = await db();
  return new Promise((res, rej) => {
    const t = d.transaction(stores, mode);
    let out;
    Promise.resolve(fn(...stores.map(s => t.objectStore(s)))).then(v => { out = v; });
    t.oncomplete = () => res(out);
    t.onerror = () => rej(t.error);
    t.onabort = () => rej(t.error);
  });
}
const req = r => new Promise((res, rej) => { r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });

export const listTracks = () => tx(['meta'], 'readonly', m => req(m.getAll())).then(a => a.sort((x, y) => (y.opened || y.added) - (x.opened || x.added)));
export const getBlob = id => tx(['blobs'], 'readonly', b => req(b.get(id))).then(r => r?.blob);
export const putMeta = meta => tx(['meta'], 'readwrite', m => req(m.put(meta)));
export async function addTrack(name, blob, dur) {
  const id = 't' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const meta = { id, name, dur, added: Date.now(), opened: Date.now(), state: null, sections: [] };
  await tx(['meta', 'blobs'], 'readwrite', (m, b) => { m.put(meta); b.put({ id, blob }); });
  return meta;
}
export const deleteTrack = id => tx(['meta', 'blobs'], 'readwrite', (m, b) => { m.delete(id); b.delete(id); });
