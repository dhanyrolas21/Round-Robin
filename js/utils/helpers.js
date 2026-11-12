// Warna pastel untuk tiap proses
const PALET = ['#f4b2c8', '#9ccaf0', '#9fdcc6', '#f3dc8f', '#c9b8f0', '#f8c4a0', '#b5e0a8', '#f0a9a9', '#a8dadc', '#d9c3a5'];

/** Membuat peta pid → warna, berdasarkan urutan proses di input. */
export function buatPetaWarna(proses) {
  const peta = new Map();
  proses.forEach((p, i) => peta.set(p.pid, PALET[i % PALET.length]));
  return peta;
}

/** Mencegah teks dari input pengguna dibaca sebagai HTML. */
export function escapeHtml(teks) {
  return String(teks)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/** 8 → "8", 8.5 → "8.50" */
export function format(angka) {
  return Number.isInteger(angka) ? String(angka) : angka.toFixed(2);
}

/** Membuat chip berwarna untuk satu proses. */
export function chip(pid, warna) {
  const gaya = warna.get(pid) ? ` style="background:${warna.get(pid)}"` : '';
  return `<span class="chip"${gaya}>${escapeHtml(pid)}</span>`;
}