function setupQuiz() {
  const form = byId('quizForm');
  const status = byId('quizStatus');

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

    // salva no histórico do aluno
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

  // renderiza histórico ao carregar
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
