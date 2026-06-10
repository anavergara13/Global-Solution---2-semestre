fetch('/api/auth/me')
  .then(r => { if (!r.ok) window.location = 'login.html'; })
  .catch(() => { window.location = 'login.html'; });
