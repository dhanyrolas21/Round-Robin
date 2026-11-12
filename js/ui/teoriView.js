import { TEORI } from '../data/teori.js';

const daftar = (items, kelas) =>
  `<ul class="daftar-ceklis ${kelas}">${items.map((i) => `<li>${i}</li>`).join('')}</ul>`;

export function renderTeori(root) {
  root.innerHTML = `
    <div class="card ungu">
      <h2>🎡 Apa itu Round Robin?</h2>
      <p>${TEORI.pengantar}</p>
      <div class="callout">${TEORI.analogi}</div>
    </div>

    <div class="card sky">
      <h3>🔄 Cara kerja</h3>
      <ol class="langkah">${TEORI.langkah.map((l) => `<li>${l}</li>`).join('')}</ol>
    </div>

    <div class="card pink">
      <h3>📐 Rumus</h3>
      ${TEORI.rumus.map((r) => `
        <div class="rumus">
          <b>${r.nama}</b>
          <code>${r.rumus}</code>
          <small>${r.arti}</small>
        </div>`).join('')}
    </div>

    <h3>⚖️ Pengaruh ukuran time quantum</h3>
    <div class="grid-2" style="margin-bottom:18px">
      ${TEORI.quantum.map((q, i) => `
        <div class="card ${i === 0 ? 'peach' : 'mint'}">
          <h3>${q.ikon} ${q.judul}</h3><p>${q.isi}</p>
        </div>`).join('')}
    </div>

    <div class="grid-2" style="margin-bottom:18px">
      <div class="card mint"><h3>👍 Kelebihan</h3>${daftar(TEORI.kelebihan, 'plus')}</div>
      <div class="card peach"><h3>👎 Kekurangan</h3>${daftar(TEORI.kekurangan, 'minus')}</div>
    </div>

    <div class="card kuning">
      <h3>📚 Istilah penting</h3>
      <div class="istilah">
        ${TEORI.istilah.map((i) => `<div><b>${i.istilah}</b>${i.arti}</div>`).join('')}
      </div>
    </div>

    <p style="text-align:center">
      <button class="btn utama" data-pindah="simulasi">Sudah paham? Coba simulasinya 🎮</button>
    </p>`;
}