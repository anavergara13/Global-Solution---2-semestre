const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db/connection');

const router = express.Router();

function publico(u) {
  return { id: u.id, nome: u.nome, email: u.email };
}

router.post('/register', (req, res) => {
  const { nome, email, senha } = req.body || {};
  if (!nome || !email || !senha || senha.length < 6) {
    return res.status(400).json({ erro: 'nome, email e senha (mín. 6) são obrigatórios' });
  }
  const existe = db.prepare('SELECT id FROM usuarios WHERE email = ?').get(email);
  if (existe) return res.status(409).json({ erro: 'email já cadastrado' });

  const senha_hash = bcrypt.hashSync(senha, 10);
  const info = db.prepare(
    'INSERT INTO usuarios (nome, email, senha_hash) VALUES (?, ?, ?)'
  ).run(nome, email, senha_hash);
  const u = db.prepare('SELECT * FROM usuarios WHERE id = ?').get(info.lastInsertRowid);
  req.session.usuarioId = u.id;
  res.status(201).json({ usuario: publico(u) });
});

router.post('/login', (req, res) => {
  const { email, senha } = req.body || {};
  if (!email || !senha) return res.status(400).json({ erro: 'email e senha obrigatórios' });
  const u = db.prepare('SELECT * FROM usuarios WHERE email = ?').get(email);
  if (!u || !bcrypt.compareSync(senha, u.senha_hash)) {
    return res.status(401).json({ erro: 'credenciais inválidas' });
  }
  req.session.usuarioId = u.id;
  res.json({ usuario: publico(u) });
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

router.get('/me', (req, res) => {
  if (!req.session.usuarioId) return res.status(401).json({ erro: 'não autenticado' });
  const u = db.prepare('SELECT * FROM usuarios WHERE id = ?').get(req.session.usuarioId);
  if (!u) return res.status(401).json({ erro: 'não autenticado' });
  res.json({ usuario: publico(u) });
});

module.exports = router;
