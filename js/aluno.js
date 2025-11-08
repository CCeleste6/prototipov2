import { initIfEmpty, saveState } from './store.js';

const RANKS = [
  { name: 'Aprendiz', min: 0, max: 2000 },
  { name: 'Estudante', min: 2001, max: 5000 },
  { name: 'Pesquisador', min: 5001, max: 9000 },
  { name: 'Acadêmico', min: 9001, max: 14000 },
  { name: 'Mentor', min: 14001, max: 20000 },
  { name: 'Erudito', min: 20001, max: 28000 },
  { name: 'Filósofo', min: 28001, max: 40000 },
  { name: 'Sábio', min: 40001, max: 55000 },
  { name: 'Luminar', min: 55001, max: 80000 },
  { name: 'Oráculo', min: 80001, max: Infinity }
];

function rankFromPM(pm) {
  return RANKS.find(r => pm >= r.min && pm <= r.max)?.name || 'Oráculo';
}

function pmProgressPercent(pm) {
  const r = RANKS.find(rr => pm >= rr.min && pm <= rr.max) || RANKS[RANKS.length-1];
  const span = (pm - r.min) / (r.max - r.min);
  return Math.max(0, Math.min(100, Math.round(span * 100)));
}

const state = initIfEmpty();
const a = state.aluno;

function renderPerfil() {
  document.getElementById('perfil').innerHTML = `
    <strong>${a.nome}</strong> — ${a.escola}<br/>
    Casa escolhida: <em>${a.casa}</em><br/>
    PM: ${a.pm} • PC: ${a.pc}
  `;
  document.getElementById('pm').textContent = a.pm;
  document.getElementById('pc').textContent = a.pc;
  document.getElementById('rank').textContent = rankFromPM(a.pm);
  document.getElementById('pmProgress').style.width = pmProgressPercent(a.pm) + '%';
}

// Exemplo: botão para ganhar pontos
const btn = document.createElement('button');
btn.textContent = "Completar atividade (+500 PM)";
btn.onclick = () => {
  a.pm += 500;
  saveState(state);
  renderPerfil();
};
document.body.appendChild(btn);

// Render inicial
renderPerfil();
