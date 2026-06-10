async function login() {
  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;
  try {
    await api('/auth/login', { method: 'POST', body: { email, senha } });
    window.location = 'dashboard.html';
  } catch (e) { alert(e.message); }
}

async function cadastrar() {
  const nome = document.getElementById('nome').value;
  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;
  try {
    await api('/auth/register', { method: 'POST', body: { nome, email, senha } });
    window.location = 'dashboard.html';
  } catch (e) { alert(e.message); }
}
