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
      aluno: {
        nome: 'Aluno Demo',
        escola: 'Escola Teste',
        casa: 'precursora',
        pm: 0,
        pc: 0,
        badges: []
      }
    };
    saveState(s);
  }
  return s;
};
