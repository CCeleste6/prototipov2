export const RANKS = [
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

export const HOUSES = [
  { key: 'guardia', name: 'Casa Guardiã' },
  { key: 'visionaria', name: 'Casa Visionária' },
  { key: 'solidaria', name: 'Casa Solidária' },
  { key: 'precursora', name: 'Casa Precursora' },
];

export const ACTIVITIES = [
  { id: 'bhaskara', title: 'Atividade — Bhaskara', formats: [
    { key: 'texto', label: 'Texto', pm: 6 },
    { key: 'video', label: 'Vídeo', pm: 6 },
    { key: 'apresentacao', label: 'Apresentação', pm: 10 },
    { key: 'arte', label: 'Arte/Design', pm: 0, disabled: true },
    { key: 'prototipo', label: 'Protótipo', pm: 0, disabled: true },
  ]},
];

export const QUIZ_SAMPLE = {
  id: 'quiz1',
  question: 'Qual o valor de 36x² + 84x − 3 para x=1?',
  options: [
    { label: '36', correct: false },
    { label: '55', correct: true },
    { label: '-x²(-7−51)', correct: false },
  ],
  rewardPM: 7
};
