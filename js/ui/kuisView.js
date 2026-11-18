import { KUIS } from '../data/kuis.js';
import { escapeHtml } from '../utils/helpers.js';

export function initKuis(root) {
  let terjawab = 0;
  let benar = 0;

  function render() {
    terjawab = 0;
    benar = 0;
    root.innerHTML = `
      <div class="card ungu">
        <h2>🧩 Kuis pemahaman</h2>
        <p>Jawab ${KUIS.length} pertanyaan berikut. Penjelasan muncul setelah kamu memilih.</p>
        <div class="progres"><div id="barProgres"></div></div>
        <div id="daftarSoal"></div>
        <div id="skor" class="card skor" hidden></div>
      </div>`;

    const daftar = root.querySelector('#daftarSoal');
    KUIS.forEach((item, nomor) => {
      const soal = document.createElement('div');
      soal.className = 'soal';
      soal.innerHTML = `<b>${nomor + 1}. ${escapeHtml(item.tanya)}</b>`;

      item.opsi.forEach((teks, indeks) => {
        const tombol = document.createElement('button');
        tombol.type = 'button';
        tombol.className = 'opsi';
        tombol.textContent = teks;
        tombol.addEventListener('click', () => jawab(soal, item, tombol, indeks));
        soal.appendChild(tombol);
      });
      daftar.appendChild(soal);
    });
  }

  function jawab(soal, item, tombol, indeks) {
    const semua = soal.querySelectorAll('.opsi');
    semua.forEach((t) => { t.disabled = true; });
    semua[item.jawaban].classList.add('benar');
    if (indeks === item.jawaban) benar++;
    else tombol.classList.add('salah');

    soal.insertAdjacentHTML('beforeend', `<div class="penjelasan">💡 ${escapeHtml(item.penjelasan)}</div>`);
    terjawab++;
    root.querySelector('#barProgres').style.width = `${(terjawab / KUIS.length) * 100}%`;
    if (terjawab === KUIS.length) tampilSkor();
  }

  function tampilSkor() {
    // Beri tahu sidebar: Level 3 (Kuis) selesai
    document.dispatchEvent(new CustomEvent('level-selesai', { detail: 'kuis' }));

    const persen = Math.round((benar / KUIS.length) * 100);
    const komentar = persen === 100 ? 'Sempurna! 🎉' : persen >= 60 ? 'Bagus, sedikit lagi! 👍' : 'Yuk baca teorinya lagi 📖';
    const skor = root.querySelector('#skor');
    skor.hidden = false;
    skor.innerHTML = `
      <b>${benar} / ${KUIS.length}</b>
      <p>${persen}%: ${komentar}</p>
      <button type="button" class="btn utama" id="btnUlangKuis">Ulangi kuis</button>`;
    skor.querySelector('#btnUlangKuis').addEventListener('click', () => {
      render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  render();
}