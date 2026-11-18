import { CONTOH } from '../data/contoh.js';
import { roundRobin } from '../core/roundRobin.js';
import { hitungMetrik, hitungContextSwitch } from '../core/metrics.js';
import { validasiInput } from '../core/validator.js';
import { renderGantt, tampilkanSampai } from './ganttChart.js';
import { buatPetaWarna, escapeHtml, format, chip } from '../utils/helpers.js';
import { bacaFile, buatEksporJson, unduh } from '../utils/importExport.js';

const TEMPLATE = `
  <h2>🎮 Simulasi Round Robin</h2>

  <div class="card sky">
    <h3>1️⃣ Pilih sumber data</h3>
    <div class="sumber-grid">
      <div class="sumber-item">
        <b>📦 Contoh bawaan</b>
        <select id="pilihContoh">
          ${CONTOH.map((c, i) => `<option value="${i}">${escapeHtml(c.nama)}</option>`).join('')}
        </select>
        <small id="deskContoh"></small>
        <button type="button" class="btn mint" id="btnMuat">Muat contoh</button>
      </div>
      <div class="sumber-item">
        <b>📂 Impor dari file</b>
        <input type="file" id="fileImpor" accept=".json,.csv,.txt">
        <small>Format .csv atau .json. Baris pertama CSV boleh <code>quantum,3</code>, lalu <code>pid,arrival,burst</code>.</small>
      </div>
      <div class="sumber-item">
        <b>✍️ Isi sendiri</b>
        <small>Edit langsung tabel di bawah.</small>
        <button type="button" class="btn" id="btnTambah">+ Tambah proses</button>
        <button type="button" class="btn" id="btnKosong">Kosongkan</button>
      </div>
    </div>
  </div>

  <div class="card ungu">
    <h3>2️⃣ Atur data</h3>
    <div class="baris-kontrol">
      <label><b>Time quantum (q):</b> <input type="number" id="inputQuantum" min="1" value="3"></label>
    </div>
    <div class="tabel-wrap">
      <table>
        <thead><tr><th>Proses</th><th>Arrival</th><th>Burst</th><th></th></tr></thead>
        <tbody id="tbodyProses"></tbody>
      </table>
    </div>
    <div id="pesan" class="pesan" role="status"></div>
    <div class="baris-kontrol">
      <button type="button" class="btn utama" id="btnJalan">▶ Jalankan simulasi</button>
      <button type="button" class="btn peach" id="btnEkspor">💾 Ekspor data (.json)</button>
    </div>
    <div class="callout">
      Aturan antrean: jika ada proses baru tiba tepat saat quantum habis, proses baru masuk antrean
      lebih dulu, baru proses yang dihentikan.
    </div>
  </div>

  <div id="hasil" hidden>
    <div class="card mint">
      <h3>📊 Gantt chart</h3>
      <div class="gantt-wrap"><div class="gantt" id="gantt"></div></div>

      <div class="pemutar">
        <button type="button" class="btn kecil" id="btnUlang">⏮ Dari awal</button>
        <button type="button" class="btn kecil" id="btnMundur">◀ Mundur</button>
        <button type="button" class="btn kecil" id="btnMaju">Maju ▶</button>
        <button type="button" class="btn kecil utama" id="btnPutar">▶ Putar</button>
        <button type="button" class="btn kecil" id="btnSelesai">⏭ Langsung selesai</button>
        <span class="label" id="labelLangkah"></span>
      </div>
      <div class="info-langkah" id="infoLangkah"></div>
    </div>

    <div class="card kuning">
      <h3>🏁 Ringkasan</h3>
      <div class="stat-grid" id="ringkasan"></div>
    </div>

    <div class="card pink">
      <h3>🪜 Langkah eksekusi</h3>
      <div class="tabel-wrap"><table id="tabelLangkah"></table></div>
    </div>

    <div class="card sky">
      <h3>🧮 Hasil perhitungan</h3>
      <div class="tabel-wrap"><table id="tabelHasil"></table></div>
    </div>
  </div>
`;

export function initSimulasi(root) {
  root.innerHTML = TEMPLATE;
  const $ = (selector) => root.querySelector(selector);
  const tbody = $('#tbodyProses');
  const state = { gantt: [], awal: [], warna: new Map(), k: 0, timer: null };

  // ---------- Tabel input ----------
  function tambahBaris(pid = '', arrival = 0, burst = 1) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><input type="text" class="in-pid" maxlength="8" size="6" aria-label="Nama proses"></td>
      <td><input type="number" class="in-arrival" min="0" aria-label="Arrival time"></td>
      <td><input type="number" class="in-burst" min="1" aria-label="Burst time"></td>
      <td><button type="button" class="btn kecil hapus" aria-label="Hapus proses">✕</button></td>`;
    tr.querySelector('.in-pid').value = pid;
    tr.querySelector('.in-arrival').value = arrival;
    tr.querySelector('.in-burst').value = burst;
    tr.querySelector('.hapus').addEventListener('click', () => tr.remove());
    tbody.appendChild(tr);
  }

  function isiTabel(proses, quantum) {
    tbody.innerHTML = '';
    proses.forEach((p) => tambahBaris(p.pid, p.arrival, p.burst));
    if (quantum) $('#inputQuantum').value = quantum;
  }

  const angka = (teks) => (teks.trim() === '' ? NaN : Number(teks));

  function ambilData() {
    return {
      quantum: angka($('#inputQuantum').value),
      proses: [...tbody.rows].map((tr) => ({
        pid: tr.querySelector('.in-pid').value.trim(),
        arrival: angka(tr.querySelector('.in-arrival').value),
        burst: angka(tr.querySelector('.in-burst').value),
      })),
    };
  }

  // Pesan ditulis lewat textContent, jadi otomatis aman dari HTML.
  function tampilPesan(teks, jenis = '') {
    const el = $('#pesan');
    el.textContent = teks;
    el.className = 'pesan ' + jenis;
  }

  // ---------- Sumber data: bawaan ----------
  const tampilDeskripsi = () => { $('#deskContoh').textContent = CONTOH[$('#pilihContoh').value].deskripsi; };
  $('#pilihContoh').addEventListener('change', tampilDeskripsi);
  $('#btnMuat').addEventListener('click', () => {
    const c = CONTOH[$('#pilihContoh').value];
    isiTabel(c.proses, c.quantum);
    tampilPesan(`Contoh "${c.nama}" dimuat.`, 'sukses');
  });

  // ---------- Sumber data: manual ----------
  $('#btnTambah').addEventListener('click', () => {
    const dipakai = new Set([...tbody.rows].map((tr) => tr.querySelector('.in-pid').value.trim()));
    let n = tbody.rows.length + 1;
    while (dipakai.has('P' + n)) n++;
    tambahBaris('P' + n, 0, 1);
  });
  $('#btnKosong').addEventListener('click', () => { tbody.innerHTML = ''; tampilPesan(''); });

  // ---------- Sumber data: impor file ----------
  $('#fileImpor').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const { quantum, proses } = await bacaFile(file);
      isiTabel(proses, quantum);
      tampilPesan(`Berhasil memuat ${proses.length} proses dari "${file.name}".`, 'sukses');
    } catch (err) {
      tampilPesan(err.message, 'error');
    }
    e.target.value = '';
  });

  // ---------- Ekspor ----------
  $('#btnEkspor').addEventListener('click', () => {
    const { quantum, proses } = ambilData();
    const pesan = validasiInput(quantum, proses);
    if (pesan) return tampilPesan(pesan, 'error');
    unduh('data-round-robin.json', buatEksporJson(quantum, proses));
    tampilPesan('Data diekspor ke data-round-robin.json.', 'sukses');
  });

  // ---------- Jalankan simulasi ----------
  $('#btnJalan').addEventListener('click', jalankan);

  function jalankan() {
    jeda(); // hentikan pemutaran lama dan kembalikan teks tombol Putar
    const { quantum, proses } = ambilData();
    const pesan = validasiInput(quantum, proses);
    if (pesan) {
      $('#hasil').hidden = true;
      return tampilPesan(pesan, 'error');
    }
    tampilPesan('');

    const hasil = roundRobin(proses, quantum);
    const metrik = hitungMetrik(hasil.proses);

    state.gantt = hasil.gantt;
    state.awal = hasil.antreanAwal;
    state.warna = buatPetaWarna(proses);

    renderGantt($('#gantt'), state.gantt, state.warna);
    renderRingkasan(metrik, hasil.gantt);
    renderLangkah(hasil.gantt);
    renderHasil(metrik);
    $('#hasil').hidden = false;
    setK(state.gantt.length);

    // Beri tahu sidebar: Level 2 (Simulasi) selesai
    document.dispatchEvent(new CustomEvent('level-selesai', { detail: 'simulasi' }));
  }

  // ---------- Render hasil ----------
  function renderRingkasan(metrik, gantt) {
    const kartu = [
      [format(metrik.rata.tat), 'Rata-rata TAT'],
      [format(metrik.rata.wt), 'Rata-rata WT'],
      [format(metrik.rata.rt), 'Rata-rata RT'],
      [gantt[gantt.length - 1].end, 'Total waktu'],
      [hitungContextSwitch(gantt), 'Context switch'],
    ];
    $('#ringkasan').innerHTML = kartu.map(([nilai, label]) => `<div class="stat"><b>${nilai}</b><span>${label}</span></div>`).join('');
  }

  function renderLangkah(gantt) {
    let no = 0;
    $('#tabelLangkah').innerHTML =
      '<tr><th>#</th><th>Proses</th><th>Mulai–Selesai</th><th>Sisa burst</th><th>Ready queue setelahnya</th></tr>' +
      gantt.filter((s) => s.pid !== 'Idle').map((s) => `
        <tr>
          <td>${++no}</td><td>${chip(s.pid, state.warna)}</td><td>${s.start}–${s.end}</td>
          <td>${s.selesai ? '✅ selesai' : s.sisa}</td>
          <td>${daftarChip(s.antrean)}</td>
        </tr>`).join('');
  }

  function renderHasil(metrik) {
    $('#tabelHasil').innerHTML =
      '<tr><th>Proses</th><th>Arrival</th><th>Burst</th><th>Completion</th><th>TAT</th><th>WT</th><th>RT</th></tr>' +
      metrik.baris.map((b) => `
        <tr>
          <td>${chip(b.pid, state.warna)}</td><td>${b.arrival}</td><td>${b.burst}</td>
          <td>${b.selesai}</td><td>${b.tat}</td><td>${b.wt}</td><td>${b.rt}</td>
        </tr>`).join('') +
      `<tr><td><b>Rata-rata</b></td><td colspan="3"></td>
        <td><b>${format(metrik.rata.tat)}</b></td><td><b>${format(metrik.rata.wt)}</b></td><td><b>${format(metrik.rata.rt)}</b></td></tr>`;
  }

  const daftarChip = (pids) =>
    pids.length ? pids.map((p) => chip(p, state.warna)).join('') : '<span class="kosong">(kosong)</span>';

  // ---------- Pemutar langkah ----------
  function setK(k) {
    state.k = Math.max(0, Math.min(k, state.gantt.length));
    tampilkanSampai($('#gantt'), state.k);
    $('#labelLangkah').textContent = `Langkah ${state.k} / ${state.gantt.length}`;

    if (state.k === 0) {
      $('#infoLangkah').innerHTML = `<b>Waktu 0</b>, belum ada yang berjalan.<br>Ready queue awal: ${daftarChip(state.awal)}`;
      return;
    }
    const s = state.gantt[state.k - 1];
    const aksi = s.pid === 'Idle'
      ? `CPU menganggur (${s.start} → ${s.end})`
      : `${chip(s.pid, state.warna)} berjalan ${s.start} → ${s.end} (${s.selesai ? 'selesai ✅' : 'sisa burst ' + s.sisa})`;
    $('#infoLangkah').innerHTML = `<b>Waktu ${s.end}</b>: ${aksi}<br>Ready queue: ${daftarChip(s.antrean)}`;
  }

  function jeda() {
    clearInterval(state.timer);
    state.timer = null;
    $('#btnPutar').textContent = '▶ Putar';
  }

  function putar() {
    if (state.timer) return jeda();
    if (state.k >= state.gantt.length) setK(0);
    $('#btnPutar').textContent = '⏸ Jeda';
    state.timer = setInterval(() => {
      if (state.k >= state.gantt.length) return jeda();
      setK(state.k + 1);
    }, 900);
  }

  $('#btnUlang').addEventListener('click', () => { jeda(); setK(0); });
  $('#btnMundur').addEventListener('click', () => { jeda(); setK(state.k - 1); });
  $('#btnMaju').addEventListener('click', () => { jeda(); setK(state.k + 1); });
  $('#btnSelesai').addEventListener('click', () => { jeda(); setK(state.gantt.length); });
  $('#btnPutar').addEventListener('click', putar);

  // ---------- Data awal ----------
  tampilDeskripsi();
  isiTabel(CONTOH[0].proses, CONTOH[0].quantum);
}