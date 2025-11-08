
const STORAGE_KEYS = {
  students: 'le_students',
  session: 'le_session',
};

const storage = {
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  remove(key) {
    localStorage.removeItem(key);
  },
};


function nowYear() {
  return new Date().getFullYear();
}

function byId(id) {
  return document.getElementById(id);
}

function show(el) { el.classList.remove('hidden'); }
function hide(el) { el.classList.add('hidden'); }

function setText(id, text) {
  const el = byId(id);
  if (el) el.textContent = text;
}

function validateField(input, message) {
  const errorEl = input.parentElement.querySelector('.error');
  if (!errorEl) return;
  errorEl.textContent = message || '';
}

function clearErrors(form) {
  form.querySelectorAll('.error').forEach(el => (el.textContent = ''));
}

function formToObject(form) {
  const data = {};
  new FormData(form).forEach((v, k) => {
    data[k] = typeof v === 'string' ? v.trim() : v;
  });
  return data;
}


function getStudents() {
  return storage.get(STORAGE_KEYS.students, []);
}

function saveStudents(list) {
  storage.set(STORAGE_KEYS.students, list);
}

function findStudentById(studentId) {
  return getStudents().find(s => s.studentId.toLowerCase() === studentId.toLowerCase());
}

function createStudent({ name, email, studentId, password, classroom }) {
  const exists = findStudentById(studentId);
  if (exists) {
    throw new Error('Já existe um aluno com este ID.');
  }
  const student = {
    name,
    email,
    studentId,
    password, 
    classroom,
    achievements: [],
    createdAt: new Date().toISOString(),
  };
  const list = getStudents();
  list.push(student);
  saveStudents(list);
  return student;
}

function authenticate(studentId, password) {
  const s = findStudentById(studentId);
  if (!s || s.password !== password) {
    throw new Error('ID ou senha inválidos.');
  }
  storage.set(STORAGE_KEYS.session, { studentId: s.studentId, ts: Date.now() });
  return s;
}

function getSession() {
  return storage.get(STORAGE_KEYS.session, null);
}

function logout() {
  storage.remove(STORAGE_KEYS.session);
}


function addAchievement(studentId, { title, description, date, tag }) {
  const list = getStudents();
  const idx = list.findIndex(s => s.studentId.toLowerCase() === studentId.toLowerCase());
  if (idx === -1) throw new Error('Aluno não encontrado.');
  const ach = {
    id: cryptoRandomId(),
    title,
    description,
    date,
    tag,
    createdAt: new Date().toISOString(),
  };
  list[idx].achievements.push(ach);
  saveStudents(list);
  return ach;
}

function cryptoRandomId() {
 
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return 'ach_' + Math.random().toString(36).slice(2, 10);
}


function renderDashboard(student) {
  setText('dashName', student.name);
  setText('dashId', student.studentId);
  setText('dashClass', student.classroom);

  const filterTag = byId('filterTag').value;
  const listEl = byId('achList');
  const emptyEl = byId('emptyList');
  listEl.innerHTML = '';

  const items = student.achievements
    .slice()
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .filter(a => (filterTag ? a.tag === filterTag : true));

  if (items.length === 0) {
    show(emptyEl);
  } else {
    hide(emptyEl);
    for (const a of items) {
      const li = document.createElement('li');
      li.className = 'ach-item';
      li.innerHTML = `
        <div class="ach-meta">
          <span>${formatDate(a.date)}</span>
          <span class="tag">${a.tag}</span>
        </div>
        <h5>${escapeHtml(a.title)}</h5>
        <p>${escapeHtml(a.description)}</p>
      `;
      listEl.appendChild(li);
    }
  }
}

function formatDate(iso) {

  const [y, m, d] = iso.split('-');
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, s => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[s]));
}


function setupRegister() {
  const form = byId('registerForm');
  const status = byId('registerStatus');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors(form);
    status.textContent = '';

    const data = formToObject(form);


    if (!data.name || data.name.length < 3) {
      validateField(byId('regName'), 'Informe um nome com pelo menos 3 caracteres.');
      return;
    }
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      validateField(byId('regEmail'), 'Informe um e-mail válido.');
      return;
    }
    if (!data.studentId || !/^[A-Za-z0-9_-]{3,}$/.test(data.studentId)) {
      validateField(byId('regId'), 'ID inválido. Use letras, números, hífen ou sublinhado (mín. 3).');
      return;
    }
    if (!data.password || data.password.length < 6) {
      validateField(byId('regPass'), 'A senha deve ter ao menos 6 caracteres.');
      return;
    }
    if (!data.classroom) {
      validateField(byId('regClass'), 'Informe a turma/ano.');
      return;
    }

    try {
      createStudent(data);
      status.textContent = 'Aluno cadastrado com sucesso!';
      form.reset();
    } catch (err) {
      status.textContent = err.message || 'Erro ao cadastrar.';
    }
  });
}

function setupLogin() {
  const form = byId('loginForm');
  const status = byId('loginStatus');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors(form);
    status.textContent = '';

    const data = formToObject(form);
    if (!data.studentId || !data.password) {
      status.textContent = 'Informe ID e senha.';
      return;
    }

    try {
      const student = authenticate(data.studentId, data.password);
      enterDashboard(student);
      status.textContent = '';
      form.reset();
      location.hash = '#dashboard';
    } catch (err) {
      status.textContent = err.message || 'Falha no login.';
    }
  });
}

function setupAchievementForm() {
  const form = byId('achievementForm');
  const status = byId('achStatus');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors(form);
    status.textContent = '';

    const data = formToObject(form);
    if (!data.title || data.title.length < 3) {
      validateField(byId('achTitle'), 'Informe um título com pelo menos 3 caracteres.');
      return;
    }
    if (!data.description || data.description.length < 5) {
      validateField(byId('achDesc'), 'Descrição muito curta (mín. 5).');
      return;
    }
    if (!data.date) {
      validateField(byId('achDate'), 'Informe a data.');
      return;
    }
    if (!data.tag) {
      validateField(byId('achTag'), 'Selecione uma categoria.');
      return;
    }

    const session = getSession();
    if (!session) {
      status.textContent = 'Sessão expirada. Faça login novamente.';
      return;
    }

    try {
      addAchievement(session.studentId, data);
      status.textContent = 'Conquista adicionada!';
      form.reset();
      const student = findStudentById(session.studentId);
      renderDashboard(student);
    } catch (err) {
      status.textContent = err.message || 'Erro ao adicionar conquista.';
    }
  });
}

function setupFilters() {
  byId('filterTag').addEventListener('change', () => {
    const session = getSession();
    if (!session) return;
    const student = findStudentById(session.studentId);
    renderDashboard(student);
  });
}

function enterDashboard(student) {
  hide(byId('registrar'));
  hide(byId('entrar'));
  show(byId('dashboard'));
  renderDashboard(student);
}

function leaveDashboard() {
  show(byId('registrar'));
  show(byId('entrar'));
  hide(byId('dashboard'));
}

function setupLogout() {
  byId('logoutBtn').addEventListener('click', () => {
    logout();
    leaveDashboard();
    location.hash = '#inicio';
  });
}


function setupHashRouting() {
  function applyHash() {
    const hash = location.hash || '#inicio';
    document.querySelectorAll('section.card, section.hero').forEach(sec => sec.classList.add('hidden'));
    const target = document.querySelector(hash);
    document.querySelector('.hero')?.classList.remove('hidden');
    if (target) target.classList.remove('hidden');
  }
  window.addEventListener('hashchange', applyHash);
  applyHash();
}


document.addEventListener('DOMContentLoaded', () => {
  setText('year', nowYear());
  setupRegister();
  setupLogin();
  setupAchievementForm();
  setupFilters();
  setupLogout();
  setupHashRouting();


  const session = getSession();
  if (session) {
    const student = findStudentById(session.studentId);
    if (student) {
      enterDashboard(student);
      location.hash = '#dashboard';
    } else {
      logout();
    }
  }
function setupQuiz() {
  const form = byId('quizForm');
  const status = byId('quizStatus');
  const historyEl = byId('quizHistory');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    status.textContent = '';

    const data = formToObject(form);
    const answer = data.answer;
    const correct = "Recife";

    const session = getSession();
    if (!session) {
      status.textContent = "Sessão expirada. Faça login novamente.";
      return;
    }

    const student = findStudentById(session.studentId);
    if (!student) {
      status.textContent = "Aluno não encontrado.";
      return;
    }

    const result = {
      question: "Qual é a capital de Pernambuco?",
      answer,
      correct,
      isCorrect: answer === correct,
      date: new Date().toLocaleString()
    };

    // salvar no aluno
    student.quizHistory = student.quizHistory || [];
    student.quizHistory.push(result);

    const list = getStudents();
    const idx = list.findIndex(s => s.studentId === student.studentId);
    list[idx] = student;
    saveStudents(list);

    status.textContent = result.isCorrect ? "✅ Resposta correta!" : "❌ Resposta incorreta.";
    form.reset();
    renderQuizHistory(student);
  });

  // renderizar histórico ao carregar
  const session = getSession();
  if (session) {
    const student = findStudentById(session.studentId);
    if (student) renderQuizHistory(student);
  }
}

function renderQuizHistory(student) {
  const historyEl = byId('quizHistory');
  historyEl.innerHTML = '';
  if (!student.quizHistory || student.quizHistory.length === 0) {
    historyEl.innerHTML = '<li class="muted">Nenhuma resposta registrada.</li>';
    return;
  }
  student.quizHistory.forEach(r => {
    const li = document.createElement('li');
    li.className = 'ach-item';
    li.innerHTML = `
      <p><strong>${r.question}</strong></p>
      <p>Sua resposta: ${r.answer}</p>
      <p>Correta: ${r.correct}</p>
      <p>${r.isCorrect ? "✅ Acertou" : "❌ Errou"} em ${r.date}</p>
    `;
    historyEl.appendChild(li);
  });
}

});

