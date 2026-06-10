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

module.exports = router;
