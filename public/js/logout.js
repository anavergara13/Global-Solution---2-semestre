function logout() {
  fetch('/api/auth/logout', { method: 'POST' })
    .finally(() => { window.location = 'login.html'; });
}
