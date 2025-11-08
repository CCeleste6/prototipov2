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

// Inicializa perfil
renderPerfil();

// Lógica do quiz
document.querySelectorAll('.quizBtn').forEach(btn => {
  btn.addEventListener('click', () => {
    const answer = btn.dataset.answer;
    const feedback = document.getElementById('quizFeedback');
    if (answer === "4") {
      a.pm += 500; // ganha 500 PM por acerto
      feedback.textContent = "✅ Resposta correta! Você ganhou 500 PM.";
    } else {
      feedback.textContent = "❌ Resposta incorreta. Tente novamente.";
    }
    saveState(state);
    renderPerfil();
  });
});
