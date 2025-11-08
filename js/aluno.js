import { RANKS, HOUSES, ACTIVITIES, QUIZ_SAMPLE } from './data.js';
import { initIfEmpty, loadState, saveState } from './store.js';

const state = initIfEmpty();

const el = (id) => document.getElementById(id);

function rankFromPM(pm) {
  return RANKS.find(r => pm >= r.min && pm <= r.max)?.name || 'Oráculo';
}
function pmProgressPercent(pm) {
  // Progresso dentro do rank atual
  const r = RANKS.find(rr => pm >= rr.min && pm <= rr.max) || RANKS[RANKS.length-1];
  const span = (pm - r.min) / (r.max - r.min);
  return Math.max(0, Math.min(100, Math.round(span * 100)));
}

function renderPerfil() {
  const a = state.aluno;
  const casaName = HOUSES.find(h => h.key === a.casa)?.name || 'Casa';
  const html = `
    <strong>${a.nome}</strong> — ${a.escola} • ${a.etapa}<br/>
    ${casaName} • Login: ${state.user.login}
  `;
  document.getElementById('perfil').innerHTML = html;

  el('pm').textContent = a.pm;
  el('pc').textContent = a.pc;
  el('rank').textContent = rankFromPM(a.pm);
  document.getElementById('pmProgress').style.width = pmProgressPercent(a.pm) + '%';

  const badges = a.badges.map(b => `<span class="badge">${b}</span>`).join('');
  document.getElementById('badges').innerHTML = badges;

  // Casas table
  const tbody = document.querySelector('#casasTbl tbody');
  const rows = Object.entries(state.casas)
    .sort(([,pcA],[,pcB]) => pcB - pcA)
    .map(([key, pc]) => {
      const name = HOUSES.find(h => h.key === key)?.name || key;
      return `<tr><td>${name}</td><td>${pc}</td></tr>`;
    }).join('');
  tbody.innerHTML = rows;
}

function renderActivity() {
  const act = ACTIVITIES[0];
  const cont = document.getElementById('formats');
  const chosen = state.aluno.atividades[act.id]?.format;
  cont.innerHTML = act.formats.map(f => {
    const disabled = f.disabled ? 'aria-disabled="true" class="badge"' : 'class="badge"';
    const active = chosen === f.key ? ' style="border-color: var(--accent)"' : '';
    const title = f.disabled ? `${f.label} (Indisponível)` : `${f.label} (+${f.pm} PM)`;
    return `<button data-format="${f.key}" ${disabled}${active}>${title}</button>`;
  }).join('');

  cont.querySelectorAll('button').forEach(btn => {
    btn.onclick = () => {
      const key = btn.getAttribute('data-format');
      const f = act.formats.find(ff => ff.key === key);
      if (!f || f.disabled) return;
      state.aluno.atividades[act.id] = { format: key, earnedPM: f.pm };
      saveState(state);
      renderActivity();
    };
  });

  document.getElementById('submitActivity').onclick = () => {
    const sel = state.aluno.atividades[act.id];
    if (!sel) return alert('Escolha um formato primeiro');
    state.aluno.pm += sel.earnedPM;
    // PC: cada PM influencia PC — simples: +1 PC por +5 PM (ajuste depois)
    state.aluno.pc += Math.floor(sel.earnedPM / 5);
    // Casa coletiva também cresce
    state.casas[state.aluno.casa] += Math.floor(sel.earnedPM / 5);

    // Conquista exemplo
    if (state.aluno.pm >= 40001 && !state.aluno.badges.includes('Sábio')) {
      state.aluno.badges.push('Sábio');
    }
    saveState(state);
    renderPerfil();
    alert(`Atividade enviada! +${sel.earnedPM} PM`);
  };
}

function renderQuiz() {
  document.getElementById('quizQ').textContent = QUIZ_SAMPLE.question;
  const ops = document.getElementById('quizOps');
  const answered = state.aluno.quizzes[QUIZ_SAMPLE.id];

  ops.innerHTML = QUIZ_SAMPLE.options.map((o,i) => `
    <label style="display:block;margin:6px 0;">
      <input type="radio" name="quiz1" value="${i}" ${answered ? 'disabled' : ''}/>
      ${o.label}
    </label>
  `).join('');

  const resultEl = document.getElementById('quizResult');
  if (answered) {
    resultEl.textContent = `Questões respondidas - 100% • Correto: ${answered.correct ? 'Sim' : 'Não'} • Saldo: +${answered.earnedPM} PM`;
  } else {
    resultEl.textContent = '';
  }

  document.getElementById('submitQuiz').onclick = () => {
    if (answered) return alert('Quiz já respondido');
    const sel = document.querySelector('input[name="quiz1"]:checked');
    if (!sel) return alert('Selecione uma alternativa');
    const opt = QUIZ_SAMPLE.options[Number(sel.value)];
    const correct = !!opt.correct;
    const earnedPM = correct ? QUIZ_SAMPLE.rewardPM : 0;

    state.aluno.quizzes[QUIZ_SAMPLE.id] = { correct, earnedPM };
    state.aluno.pm += earnedPM;
    state.aluno.pc += correct ? 1 : 0;
    state.casas[state.aluno.casa] += correct ? 1 : 0;

    // Conquista exemplo
    if (correct && !state.aluno.badges.includes('Legado Escolar 2')) {
      state.aluno.badges.push('Legado Escolar 2');
    }

    saveState(state);
    renderPerfil();
    renderQuiz();
    alert(correct ? `Correto! +${earnedPM} PM` : 'Resposta incorreta');
  };
}

renderPerfil();
renderActivity();
renderQuiz();
