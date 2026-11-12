export const BATAS = { maxProses: 15, maxNilai: 99 };

/** Mengembalikan teks error, atau null jika data valid. */
export function validasiInput(quantum, proses) {
  if (!Number.isInteger(quantum) || quantum < 1 || quantum > BATAS.maxNilai) {
    return `Time quantum harus bilangan bulat 1–${BATAS.maxNilai}.`;
  }
  if (proses.length === 0) return 'Tambahkan minimal satu proses.';
  if (proses.length > BATAS.maxProses) return `Maksimal ${BATAS.maxProses} proses.`;

  for (const p of proses) {
    if (!p.pid) return 'Nama proses tidak boleh kosong.';
    if (!Number.isInteger(p.arrival) || p.arrival < 0 || p.arrival > BATAS.maxNilai) {
      return `Arrival "${p.pid}" harus bilangan bulat 0–${BATAS.maxNilai}.`;
    }
    if (!Number.isInteger(p.burst) || p.burst < 1 || p.burst > BATAS.maxNilai) {
      return `Burst "${p.pid}" harus bilangan bulat 1–${BATAS.maxNilai}.`;
    }
  }
  if (new Set(proses.map((p) => p.pid)).size !== proses.length) {
    return 'Nama proses tidak boleh ada yang sama.';
  }
  return null;
}