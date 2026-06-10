const express = require('express');
const db = require('../db/connection');
const requireAuth = require('../middlewares/requireAuth');
const { normalizarEonet, cacheGet, cacheSet } = require('./helpers');

const router = express.Router();
router.use(requireAuth);

router.get('/', async (req, res) => {
  const uid = req.session.usuarioId;
  const totalRegioes = db.prepare(
    'SELECT COUNT(*) c FROM regioes WHERE usuario_id = ?'
  ).get(uid).c;
  const riscoRows = db.prepare(
    'SELECT nivel_risco, COUNT(*) c FROM regioes WHERE usuario_id = ? GROUP BY nivel_risco'
  ).all(uid);
  const riscoPorNivel = { Baixo: 0, 'Médio': 0, Alto: 0 };
  riscoRows.forEach(r => { riscoPorNivel[r.nivel_risco] = r.c; });
  const totalConsultas = db.prepare(
    'SELECT COUNT(*) c FROM consultas_nasa WHERE usuario_id = ?'
  ).get(uid).c;

  // eventos EONET por categoria (de cache se disponível; senão consulta)
  let eventos = cacheGet('eonet:', 10 * 60 * 1000);
  if (!eventos || eventos.length === 0) {
    try {
      const r = await fetch('https://eonet.gsfc.nasa.gov/api/v3/events?status=open&limit=100');
      eventos = normalizarEonet(await r.json());
      if (eventos.length > 0) cacheSet('eonet:', eventos, 10 * 60 * 1000);
    } catch (e) { eventos = []; }
  }
  const eventosPorCategoria = {};
  eventos.forEach(e => { eventosPorCategoria[e.categoria] = (eventosPorCategoria[e.categoria] || 0) + 1; });

  res.json({ totalRegioes, riscoPorNivel, totalConsultas, eventosPorCategoria, totalEventos: eventos.length });
});

module.exports = router;
