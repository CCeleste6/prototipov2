function setupRegister() {
  const form = byId('registerForm');
  const status = byId('registerStatus');

  if (!form) {
    console.error("Elemento #registerForm não encontrado no HTML.");
    return;
  }

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
