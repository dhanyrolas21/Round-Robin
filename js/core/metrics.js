/**
 * Menghitung metrik dari hasil Round Robin.
 *   TAT = Completion - Arrival
 *   WT  = TAT - Burst
 *   RT  = Waktu pertama dilayani - Arrival
 */
export function hitungMetrik(proses) {
  const baris = proses.map((p) => {
    const tat = p.selesai - p.arrival;
    return {
      pid: p.pid,
      arrival: p.arrival,
      burst: p.burst,
      selesai: p.selesai,
      tat,
      wt: tat - p.burst,
      rt: p.mulaiPertama - p.arrival,
    };
  });
  const rata = (k) => baris.reduce((jumlah, b) => jumlah + b[k], 0) / baris.length;
  return { baris, rata: { tat: rata('tat'), wt: rata('wt'), rt: rata('rt') } };
}

/** Jumlah perpindahan CPU dari satu proses ke proses lain yang berbeda. */
export function hitungContextSwitch(gantt) {
  const jalan = gantt.filter((s) => s.pid !== 'Idle');
  let jumlah = 0;
  for (let i = 1; i < jalan.length; i++) {
    if (jalan[i].pid !== jalan[i - 1].pid) jumlah++;
  }
  return jumlah;
}