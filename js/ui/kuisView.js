import { KUIS } from '../data/kuis.js';
import { escapeHtml } from '../utils/helpers.js';

const HURUF = ['A', 'B', 'C', 'D', 'E', 'F'];

export function initKuis(root) {
  let jawaban = [];     // jawaban[i] = indeks opsi yang dipilih (null = belum dijawab)
  let dikumpulkan = false;

  // Contoh hasil: "C. Antrean FIFO"
  const label = (item, indeks) => `${HURUF[indeks]}. ${item.opsi[indeks]}`;

  function render() {
    jawaban = KUIS.map(() => null);
    dikumpulkan = false;

    root.innerHTML = `
      <div class="card ungu">
        <h2>🧩 Kuis pemahaman</h2>
        <p>Jawab ${KUIS.length} pertanyaan. Kamu bisa mengganti jawaban sebelum dikumpulkan.
           Hasil benar/salah dan penjelasan muncul setelah kamu menekan <b>Kumpulkan jawaban</b>.</p>
        <div class="progres"><div id="barProgres"></div></div>
        <div id="daftarSoal"></div>

        <div class="kumpul">
          <span id="infoTerjawab"></span>
          <button type="button" class="btn utama" id="btnKumpul" disabled>✅ Kumpulkan jawaban</button>
        </div>

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
        tombol.innerHTML =
          `<span class="huruf">${HURUF[indeks]}</span>` +
          `<span class="isi">${escapeHtml(teks)}</span>` +
          `<span class="tanda" aria-hidden="true"></span>`;
        tombol.addEventListener('click', () => pilih(nomor, indeks));
        soal.appendChild(tombol);
      });
      daftar.appendChild(soal);
    });

    root.querySelector('#btnKumpul').addEventListener('click', kumpulkan);
    perbaruiStatus();
  }

  // ---------- Saat mengerjakan ----------
  function pilih(nomor, indeks) {
    if (dikumpulkan) return;
    jawaban[nomor] = indeks;
    const soal = root.querySelectorAll('.soal')[nomor];
    soal.querySelectorAll('.opsi').forEach((t, i) => t.classList.toggle('dipilih', i === indeks));
    perbaruiStatus();
  }

  function perbaruiStatus() {
    const terjawab = jawaban.filter((j) => j !== null).length;
    root.querySelector('#barProgres').style.width = `${(terjawab / KUIS.length) * 100}%`;
    root.querySelector('#infoTerjawab').textContent = `Terjawab ${terjawab} / ${KUIS.length}`;
    root.querySelector('#btnKumpul').disabled = terjawab < KUIS.length;
  }

  // ---------- Setelah dikumpulkan ----------
  function kumpulkan() {
    dikumpulkan = true;
    let benar = 0;

    root.querySelectorAll('.soal').forEach((soal, nomor) => {
      const item = KUIS[nomor];
      const pilihan = jawaban[nomor];
      const betul = pilihan === item.jawaban;
      const semua = soal.querySelectorAll('.opsi');

      semua.forEach((t) => { t.disabled = true; t.classList.remove('dipilih'); });

      // Jawaban benar: hijau + ✓
      semua[item.jawaban].classList.add('benar');
      semua[item.jawaban].querySelector('.tanda').textContent = '✓';

      // Pilihan yang salah: merah + ✗
      if (!betul) {
        semua[pilihan].classList.add('salah');
        semua[pilihan].querySelector('.tanda').textContent = '✗';
      } else {
        benar++;
      }

      // Kalau salah, tampilkan dulu pilihanmu
      const salahBaris = betul
        ? ''
        : `<div class="hasil-baris no">❌ Jawabanmu: <b>${escapeHtml(label(item, pilihan))}</b></div>`;

      // Jawaban benar ditulis di awal penjelasan, contoh: "C. Antrean FIFO: ..."
      soal.insertAdjacentHTML(
        'beforeend',
        `<div class="penjelasan">
           ${salahBaris}
           <div class="alasan">💡 <b>${escapeHtml(label(item, item.jawaban))}</b>: ${escapeHtml(item.penjelasan)}</div>
         </div>`
      );
    });

    root.querySelector('.kumpul').hidden = true;
    tampilSkor(benar);

    // Beri tahu sidebar: Level 3 (Kuis) selesai
    document.dispatchEvent(new CustomEvent('level-selesai', { detail: 'kuis' }));
  }

  function tampilSkor(benar) {
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
    skor.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  render();
}