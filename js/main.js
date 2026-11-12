import { initTabs } from './ui/tabs.js';
import { renderTeori } from './ui/teoriView.js';
import { initSimulasi } from './ui/simulasiView.js';
import { initKuis } from './ui/kuisView.js';

renderTeori(document.getElementById('teori'));
initSimulasi(document.getElementById('simulasi'));
initKuis(document.getElementById('kuis'));
initTabs();