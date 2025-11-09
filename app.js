document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('cadastro-aluno');
  const mensagem = document.getElementById('mensagem');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    mensagem.textContent = '';
    mensagem.style.color = '#c00';

    const nome = form.nome.value.trim();
    const email = form.email.value.trim();
    const idAluno = form.idAluno.value.trim();
    const senha = form.senha.value;
    const turma = form.turma.value.trim();

    if (!nome || !email || !idAluno || !senha || !turma) {
      mensagem.textContent = 'Preencha todos os campos.';
      return;
    }
    if (!/^[A-Za-z0-9_-]+$/.test(idAluno)) {
      mensagem.textContent = 'ID inválido. Use letras, números, hífen ou sublinhado.';
      return;
    }
    if (senha.length < 6) {
      mensagem.textContent = 'Senha deve ter pelo menos 6 caracteres.';
      return;
    }

    const aluno = { nome, email, idAluno, turma };
    localStorage.setItem(`aluno:${idAluno}`, JSON.stringify(aluno));

    form.reset();
    mensagem.style.color = '#0a0';
    mensagem.textContent = 'Aluno cadastrado com sucesso (protótipo).';
  });
});
