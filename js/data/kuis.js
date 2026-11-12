// Bank soal. Field "jawaban" = nomor opsi yang benar (dimulai dari 0).
export const KUIS = [
  {
    tanya: 'Round Robin termasuk jenis penjadwalan…',
    opsi: ['Non-preemptive', 'Preemptive', 'Prioritas statis', 'Terpendek lebih dulu'],
    jawaban: 1,
    penjelasan: 'RR bersifat preemptive: proses dihentikan paksa ketika time quantum habis.',
  },
  {
    tanya: 'Struktur data yang dipakai untuk ready queue pada Round Robin adalah…',
    opsi: ['Tree', 'Stack (LIFO)', 'Antrean FIFO', 'Heap prioritas'],
    jawaban: 2,
    penjelasan: 'Antrean FIFO: proses yang dihentikan masuk ke belakang antrean.',
  },
  {
    tanya: 'Jika time quantum dibuat sangat besar, Round Robin akan berperilaku seperti…',
    opsi: ['SJF', 'FCFS', 'Priority', 'SRTF'],
    jawaban: 1,
    penjelasan: 'Dengan q sangat besar, setiap proses selesai sebelum quantum habis, persis seperti FCFS.',
  },
  {
    tanya: 'Dampak utama time quantum yang terlalu kecil adalah…',
    opsi: ['Starvation', 'Deadlock', 'Overhead context switch meningkat', 'Proses tidak pernah dimulai'],
    jawaban: 2,
    penjelasan: 'CPU terlalu sering berpindah proses, sehingga banyak waktu terbuang untuk context switch.',
  },
  {
    tanya: 'Rumus Waiting Time yang benar adalah…',
    opsi: ['TAT − Burst Time', 'Completion − Burst Time', 'Burst − Arrival', 'TAT + Arrival'],
    jawaban: 0,
    penjelasan: 'WT = Turnaround Time − Burst Time.',
  },
  {
    tanya: 'Apa yang terjadi jika proses selesai sebelum time quantum habis?',
    opsi: ['CPU menunggu sampai quantum habis', 'CPU langsung diberikan ke proses berikutnya', 'Proses kembali ke belakang antrean', 'Proses dihentikan paksa (error)'],
    jawaban: 1,
    penjelasan: 'CPU tidak menunggu. Proses keluar dan CPU langsung mengambil proses terdepan di antrean.',
  },
  {
    tanya: 'Tiga proses tiba di t=0 (urutan P1, P2, P3) dengan burst 4, 3, 5 dan q=2. Pada waktu berapa P2 selesai?',
    opsi: ['t = 7', 't = 8', 't = 9', 't = 11'],
    jawaban: 2,
    penjelasan: 'Urutan: P1(0–2), P2(2–4), P3(4–6), P1(6–8), P2(8–9) selesai. Jadi P2 selesai di t=9, dan WT P2 = 9 − 3 = 6.',
  },
  {
    tanya: 'Proses baru tiba tepat saat quantum proses lain habis. Menurut aturan standar, siapa yang masuk antrean lebih dulu?',
    opsi: ['Proses baru', 'Proses yang baru dihentikan', 'Yang burst-nya lebih kecil', 'Dipilih acak'],
    jawaban: 0,
    penjelasan: 'Proses baru masuk lebih dulu, baru proses yang dihentikan dipindah ke belakang antrean.',
  },
];