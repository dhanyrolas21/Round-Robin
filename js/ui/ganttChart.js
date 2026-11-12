import { escapeHtml } from '../utils/helpers.js';

/** Menggambar semua blok Gantt chart. Lebar blok proporsional dengan durasinya. */
export function renderGantt(wadah, gantt, warna) {
  wadah.innerHTML = '';
  gantt.forEach((s, i) => {
    const seg = document.createElement('div');
    seg.className = 'seg' + (s.pid === 'Idle' ? ' idle' : '') + (i === gantt.length - 1 ? ' terakhir' : '');
    seg.style.flexGrow = s.end - s.start;
    seg.dataset.akhir = s.end;
    seg.title = `${s.pid}: ${s.start} → ${s.end}`;
    seg.innerHTML = `<div class="bar">${escapeHtml(s.pid)}</div><span class="tick">${s.start}</span>`;
    if (s.pid !== 'Idle') seg.querySelector('.bar').style.background = warna.get(s.pid);
    wadah.appendChild(seg);
  });
}

/** Menampilkan blok sampai langkah ke-k (0 = kosong), blok terakhir diberi sorotan. */
export function tampilkanSampai(wadah, k) {
  [...wadah.children].forEach((seg, i) => {
    seg.classList.toggle('tersembunyi', i >= k);
    seg.classList.toggle('aktif', i === k - 1);
  });
}