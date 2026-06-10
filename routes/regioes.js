const express = require('express');
const db = require('../db/connection');
const requireAuth = require('../middlewares/requireAuth');

const router = express.Router();
router.use(requireAuth);

const RISCOS = ['Baixo', 'Médio', 'Alto'];

router.get('/', (req, res) => {
  const regioes = db.prepare(
    'SELECT * FROM regioes WHERE usuario_id = ? ORDER BY criado_em DESC'
  ).all(req.session.usuarioId);
  res.json({ regioes });
});

router.post('/', (req, res) => {
  const { nome, lat, lon, nivel_risco } = req.body || {};
  if (!nome || !nome.trim()) return res.status(400).json({ erro: 'nome obrigatório' });
  if (!RISCOS.includes(nivel_risco)) return res.status(400).json({ erro: 'nivel_risco inválido' });
  const latN = lat == null ? null : Number(lat);
  const lonN = lon == null ? null : Number(lon);
  if (latN != null && (latN < -90 || latN > 90)) return res.status(400).json({ erro: 'lat fora de faixa' });
  if (lonN != null && (lonN < -180 || lonN > 180)) return res.status(400).json({ erro: 'lon fora de faixa' });

  const info = db.prepare(
    'INSERT INTO regioes (usuario_id, nome, lat, lon, nivel_risco) VALUES (?, ?, ?, ?, ?)'
  ).run(req.session.usuarioId, nome.trim(), latN, lonN, nivel_risco);
  const regiao = db.prepare('SELECT * FROM regioes WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json({ regiao });
});

router.delete('/:id', (req, res) => {
  const info = db.prepare('DELETE FROM regioes WHERE id = ? AND usuario_id = ?')
    .run(req.params.id, req.session.usuarioId);
  if (info.changes === 0) return res.status(404).json({ erro: 'não encontrada' });
  res.json({ ok: true });
});

module.exports = router;
