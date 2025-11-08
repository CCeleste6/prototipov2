function loadState() {
  const s = localStorage.getItem('LE_state');
  return s ? JSON.parse(s) : null;
}
function saveState(state) {
  localStorage.setItem('LE_state', JSON.stringify(state));
}
function initIfEmpty() {
  let s = loadState();
  if (!s) {
    s = { aluno: { nome:"Aluno Demo", escola:"Escola Teste", casa:"precursora", pm:0, pc:0, badges:[] } };
    saveState(s);
  }
  return s;
}
