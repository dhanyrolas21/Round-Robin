/**
 * Navigasi peta level + progres.
 * Level ditandai selesai (✓) lewat event "level-selesai":
 *   - teori    : saat dibuka
 *   - simulasi : saat simulasi dijalankan (dikirim dari simulasiView.js)
 *   - kuis     : saat semua soal terjawab (dikirim dari kuisView.js)
 */
const NAMA = { teori: 'Teori', simulasi: 'Simulasi', kuis: 'Kuis' };

export function initTabs() {
  const tabs = [...document.querySelectorAll('.tab')];
  const panels = document.querySelectorAll('.panel');
  const bar = document.getElementById('xpBar');
  const label = document.getElementById('xpLabel');
  const selesai = new Set();

  function perbaruiProgres() {
    if (bar) bar.style.width = `${Math.round((selesai.size / tabs.length) * 100)}%`;
    if (label) label.textContent = `${selesai.size} / ${tabs.length} level`;
    tabs.forEach((t) => t.classList.toggle('sudah', selesai.has(t.dataset.target)));
  }

  function notifikasi(teks) {
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = teks;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2800);
  }

  function tandaiSelesai(id, tampilkanNotif = true) {
    if (!NAMA[id] || selesai.has(id)) return;
    selesai.add(id);
    perbaruiProgres();
    if (!tampilkanNotif) return;
    const nomor = tabs.findIndex((t) => t.dataset.target === id) + 1;
    notifikasi(selesai.size === tabs.length
      ? '🎉 Semua level selesai!'
      : `✓ Level ${nomor} selesai: ${NAMA[id]}`);
  }

  function buka(tab) {
    tabs.forEach((t) => { t.classList.remove('aktif'); t.setAttribute('aria-selected', 'false'); });
    panels.forEach((p) => p.classList.remove('aktif'));
    tab.classList.add('aktif');
    tab.setAttribute('aria-selected', 'true');
    document.getElementById(tab.dataset.target).classList.add('aktif');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (tab.dataset.target === 'teori') tandaiSelesai('teori');
  }

  tabs.forEach((tab) => tab.addEventListener('click', () => buka(tab)));

  // Tombol di dalam halaman yang berisi data-pindah="simulasi" akan membuka level tersebut
  document.addEventListener('click', (e) => {
    const tombol = e.target.closest('[data-pindah]');
    if (!tombol) return;
    const tujuan = document.querySelector(`.tab[data-target="${tombol.dataset.pindah}"]`);
    if (tujuan) tujuan.click();
  });

  // Dikirim oleh simulasiView.js dan kuisView.js
  document.addEventListener('level-selesai', (e) => tandaiSelesai(e.detail));

  tandaiSelesai('teori', false); // Teori terbuka sejak awal, tanpa notifikasi
}