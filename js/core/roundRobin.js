/**
 * Algoritma Round Robin (logika murni, tanpa akses ke DOM).
 *
 * Input : daftarProses = [{ pid, arrival, burst }, ...], quantum (bilangan bulat >= 1)
 * Output: { gantt, antreanAwal, proses }
 *
 * Aturan: jika ada proses baru tiba tepat saat quantum proses lain habis,
 * proses baru masuk antrean LEBIH DULU, baru proses yang dihentikan
 * (aturan standar di buku teks).
 */
export function roundRobin(daftarProses, quantum) {
  const proses = daftarProses
    .map((p, urutan) => ({ ...p, urutan, sisa: p.burst, mulaiPertama: null, selesai: null }))
    .sort((a, b) => a.arrival - b.arrival || a.urutan - b.urutan);

  const antrean = [];
  const gantt = [];
  let waktu = 0;
  let berikutnya = 0; // indeks proses yang belum pernah masuk antrean
  let jumlahSelesai = 0;

  const masukkanYangTiba = (batas) => {
    while (berikutnya < proses.length && proses[berikutnya].arrival <= batas) {
      antrean.push(proses[berikutnya++]);
    }
  };
  const salinAntrean = () => antrean.map((p) => p.pid);

  masukkanYangTiba(waktu);
  const antreanAwal = salinAntrean();

  while (jumlahSelesai < proses.length) {
    // CPU menganggur sampai ada proses yang tiba
    if (antrean.length === 0) {
      const mulai = waktu;
      waktu = proses[berikutnya].arrival;
      masukkanYangTiba(waktu);
      gantt.push({ pid: 'Idle', start: mulai, end: waktu, sisa: 0, selesai: false, antrean: salinAntrean() });
      continue;
    }

    const p = antrean.shift();
    if (p.mulaiPertama === null) p.mulaiPertama = waktu;

    const jalan = Math.min(quantum, p.sisa);
    const mulai = waktu;
    waktu += jalan;
    p.sisa -= jalan;

    masukkanYangTiba(waktu);                 // yang baru tiba masuk dulu
    if (p.sisa > 0) antrean.push(p);         // belum selesai: ke belakang antrean
    else { p.selesai = waktu; jumlahSelesai++; }

    gantt.push({
      pid: p.pid, start: mulai, end: waktu,
      sisa: p.sisa, selesai: p.sisa === 0, antrean: salinAntrean(),
    });
  }

  return {
    gantt,
    antreanAwal,
    proses: [...proses].sort((a, b) => a.urutan - b.urutan), // kembali ke urutan input
  };
}