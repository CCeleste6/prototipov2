// API simples sobre localStorage
const KEY = 'LE_state';

export const loadState = () => {
  const s = localStorage.getItem(KEY);
  return s ? JSON.parse(s) : null;
};

export const saveState = (state) => {
  localStorage.setItem(KEY, JSON.stringify(state));
};

export const initIfEmpty = () => {
  let s = loadState();
  if (!s) {
    s = {
      user: JSON.parse(localStorage.getItem('LE_user')) || { role: 'aluno', login: 'aluno.demo' },
      aluno: {
        nome: 'Richard Victor',
        escola: 'Colégio XYZ',
        etapa: '1º Médio',
        casa: 'precursora',
        pm: 36556,
        pc: 6533,
        badges: ['Fast Climber', 'Sábio', 'Championship'],
        quizzes: {}, // quizId -> {correct: true, earnedPM: 7}
        atividades: {} // activityId -> {format: 'video', earnedPM: 6}
      },
      casas: { precursora: 23566, guardia: 17800, visionaria: 8000, solidaria: 0 }
    };
    saveState(s);
  }
  return s;
};
