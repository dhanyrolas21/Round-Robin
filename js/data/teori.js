// Isi materi teori. Teman kelompok bisa mengedit teks di sini tanpa menyentuh kode lain.
export const TEORI = {
  pengantar:
    'Round Robin (RR) adalah algoritma penjadwalan CPU <b>preemptive</b> yang membagi waktu CPU secara adil. ' +
    'Setiap proses mendapat jatah waktu yang sama, disebut <b>time quantum</b> (q). ' +
    'Jika proses belum selesai saat quantum habis, proses dihentikan sementara dan dipindah ke belakang antrean.',

  analogi:
    '🛝 <b>Analogi:</b> bayangkan beberapa anak antre main ayunan, dan tiap anak hanya boleh main 3 menit. ' +
    'Kalau belum puas, anak itu harus antre lagi di barisan paling belakang. Anak yang sudah puas langsung pulang, ' +
    'dan giliran berikutnya maju. Ayunan = CPU, anak = proses, 3 menit = time quantum.',

  langkah: [
    'Proses yang siap dijalankan masuk ke <i>ready queue</i> dengan urutan FIFO.',
    'CPU mengambil proses di barisan terdepan dan menjalankannya maksimal selama q.',
    'Jika proses selesai sebelum q habis, proses keluar dan CPU langsung mengambil proses berikutnya.',
    'Jika q habis tetapi proses belum selesai, proses dikembalikan ke belakang antrean (terjadi <i>context switch</i>).',
    'Ulangi sampai semua proses selesai.',
  ],

  rumus: [
    { nama: 'Turnaround Time (TAT)', rumus: 'TAT = Completion Time − Arrival Time', arti: 'Total waktu proses berada di sistem, dari tiba sampai selesai.' },
    { nama: 'Waiting Time (WT)', rumus: 'WT = TAT − Burst Time', arti: 'Total waktu proses menunggu di ready queue.' },
    { nama: 'Response Time (RT)', rumus: 'RT = Waktu pertama dilayani CPU − Arrival Time', arti: 'Seberapa cepat proses pertama kali mendapat CPU.' },
  ],

  quantum: [
    { ikon: '🐘', judul: 'Quantum terlalu besar', isi: 'Perilakunya mendekati FCFS, proses pendek bisa menunggu lama di belakang proses panjang.' },
    { ikon: '🐜', judul: 'Quantum terlalu kecil', isi: 'Context switch terlalu sering sehingga overhead CPU meningkat dan waktu banyak terbuang.' },
  ],

  kelebihan: [
    'Adil untuk semua proses',
    'Tidak ada starvation',
    'Response time baik, cocok untuk sistem time-sharing',
  ],
  kekurangan: [
    'Rata-rata waiting time bisa tinggi',
    'Ada overhead context switch',
    'Kinerja sangat bergantung pada nilai q',
  ],

  istilah: [
    { istilah: 'Arrival Time', arti: 'Waktu proses tiba di ready queue.' },
    { istilah: 'Burst Time', arti: 'Total waktu CPU yang dibutuhkan proses sampai selesai.' },
    { istilah: 'Time Quantum', arti: 'Jatah waktu maksimal satu proses di CPU sebelum giliran berpindah.' },
    { istilah: 'Ready Queue', arti: 'Antrean proses yang siap dijalankan CPU.' },
    { istilah: 'Preemptive', arti: 'CPU boleh diambil paksa dari proses yang sedang berjalan.' },
    { istilah: 'Context Switch', arti: 'Perpindahan CPU dari satu proses ke proses lain.' },
    { istilah: 'Starvation', arti: 'Proses menunggu sangat lama atau tidak pernah mendapat CPU.' },
  ],
};