// Contoh data bawaan ("input dari dalam").
export const CONTOH = [
  {
    nama: 'Contoh dasar (4 proses)',
    deskripsi: 'Proses datang bergantian, quantum 3. Cocok untuk memahami alur dasar.',
    quantum: 3,
    proses: [
      { pid: 'P1', arrival: 0, burst: 5 },
      { pid: 'P2', arrival: 1, burst: 3 },
      { pid: 'P3', arrival: 2, burst: 8 },
      { pid: 'P4', arrival: 3, burst: 6 },
    ],
  },
  {
    nama: 'Datang bersamaan',
    deskripsi: 'Semua proses tiba di waktu 0, jadi urutan antrean sama dengan urutan input.',
    quantum: 4,
    proses: [
      { pid: 'P1', arrival: 0, burst: 10 },
      { pid: 'P2', arrival: 0, burst: 4 },
      { pid: 'P3', arrival: 0, burst: 6 },
    ],
  },
  {
    nama: 'Ada CPU idle',
    deskripsi: 'Proses pertama selesai sebelum proses berikutnya tiba, sehingga CPU menganggur.',
    quantum: 2,
    proses: [
      { pid: 'P1', arrival: 0, burst: 2 },
      { pid: 'P2', arrival: 6, burst: 4 },
      { pid: 'P3', arrival: 7, burst: 3 },
    ],
  },
  {
    nama: 'Quantum sangat besar (mirip FCFS)',
    deskripsi: 'Data sama dengan contoh dasar, tetapi quantum 20. Bandingkan hasilnya!',
    quantum: 20,
    proses: [
      { pid: 'P1', arrival: 0, burst: 5 },
      { pid: 'P2', arrival: 1, burst: 3 },
      { pid: 'P3', arrival: 2, burst: 8 },
      { pid: 'P4', arrival: 3, burst: 6 },
    ],
  },
];