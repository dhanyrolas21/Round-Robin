/**
 * Impor data proses dari file .json atau .csv ("input dari luar").
 *
 * Format CSV (baris "quantum" opsional, header opsional):
 *   quantum,3
 *   pid,arrival,burst
 *   P1,0,5
 *
 * Format JSON:
 *   { "quantum": 3, "proses": [ { "pid": "P1", "arrival": 0, "burst": 5 } ] }
 *   (atau langsung berupa array proses)
 */
export async function bacaFile(file) {
  const teks = await file.text();
  const hasil = file.name.toLowerCase().endsWith('.json') ? parseJson(teks) : parseCsv(teks);
  if (hasil.proses.length === 0) throw new Error('File tidak berisi data proses.');
  return hasil;
}

function normalisasi(x) {
  return {
    pid: String(x.pid ?? x.nama ?? x.name ?? '').trim(),
    arrival: Number(x.arrival ?? x.kedatangan),
    burst: Number(x.burst),
  };
}

function parseJson(teks) {
  let data;
  try { data = JSON.parse(teks); } catch { throw new Error('File JSON tidak valid.'); }
  const daftar = Array.isArray(data) ? data : (data.proses ?? data.processes);
  if (!Array.isArray(daftar)) throw new Error('Format JSON salah: butuh array "proses".');
  const quantum = Array.isArray(data) ? null : Number(data.quantum) || null;
  return { quantum, proses: daftar.map(normalisasi) };
}

function parseCsv(teks) {
  let quantum = null;
  const proses = [];
  for (const baris of teks.split(/\r?\n/)) {
    if (!baris.trim()) continue;
    const kolom = baris.split(/[,;\t]/).map((k) => k.trim());
    if (kolom[0].toLowerCase() === 'quantum') { quantum = Number(kolom[1]) || null; continue; }
    if (kolom.length < 3 || Number.isNaN(Number(kolom[1]))) continue; // lewati header/baris rusak
    proses.push(normalisasi({ pid: kolom[0], arrival: kolom[1], burst: kolom[2] }));
  }
  return { quantum, proses };
}

/** Membuat teks JSON untuk diekspor. */
export function buatEksporJson(quantum, proses) {
  return JSON.stringify({ quantum, proses }, null, 2);
}

/** Mengunduh teks sebagai file. */
export function unduh(namaFile, teks) {
  const url = URL.createObjectURL(new Blob([teks], { type: 'application/json' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = namaFile;
  a.click();
  URL.revokeObjectURL(url);
}