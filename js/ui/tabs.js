export function initTabs() {
  const tabs = document.querySelectorAll('.tab');
  const panels = document.querySelectorAll('.panel');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => { t.classList.remove('aktif'); t.setAttribute('aria-selected', 'false'); });
      panels.forEach((p) => p.classList.remove('aktif'));
      tab.classList.add('aktif');
      tab.setAttribute('aria-selected', 'true');
      document.getElementById(tab.dataset.target).classList.add('aktif');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // Tombol di dalam halaman yang berisi data-pindah="simulasi" akan membuka tab tersebut
  document.addEventListener('click', (e) => {
    const tombol = e.target.closest('[data-pindah]');
    if (tombol) document.querySelector(`.tab[data-target="${tombol.dataset.pindah}"]`).click();
  });
}