const express = require('express');
const db = require('../db/connection');
const requireAuth = require('../middlewares/requireAuth');
const { normalizarEonet, cacheGet, cacheSet } = require('./helpers');

const router = express.Router();
router.use(requireAuth);

const TTL = 10 * 60 * 1000; // 10 min

router.get('/eonet', async (req, res) => {
  const categoria = req.query.categoria || '';
  const chave = `eonet:${categoria}`;
  let dados = cacheGet(chave, TTL);
  if (!dados) {
    try {
      let url = 'https://eonet.gsfc.nasa.gov/api/v3/events?status=open&limit=100';
      if (categoria) url += `&category=${encodeURIComponent(categoria)}`;
      const r = await fetch(url);
      dados = normalizarEonet(await r.json());
      cacheSet(chave, dados, TTL);
    } catch (e) {
      return res.status(502).json({ erro: 'falha ao consultar EONET' });
    }
  }
  db.prepare('INSERT INTO consultas_nasa (usuario_id, tipo) VALUES (?, ?)')
    .run(req.session.usuarioId, 'eonet');
  res.json({ eventos: dados });
});

router.get('/epic', async (req, res) => {
  const tipo = req.query.tipo === 'enhanced' ? 'enhanced' : 'natural';
  const data = req.query.data;
  try {
    const base = `https://epic.gsfc.nasa.gov/api/${tipo}`;
    const url = data ? `${base}/date/${encodeURIComponent(data)}` : base;
    const r = await fetch(url);
    const lista = await r.json();
    const imagens = (lista || []).map(item => {
      const dia = item.date.split(' ')[0];
      const [ano, mes, d] = dia.split('-');
      return {
        caption: item.caption,
        data: item.date,
        lat: item.centroid_coordinates.lat,
        lon: item.centroid_coordinates.lon,
        url: `https://epic.gsfc.nasa.gov/archive/${tipo}/${ano}/${mes}/${d}/jpg/${item.image}.jpg`
      };
    });
    db.prepare('INSERT INTO consultas_nasa (usuario_id, tipo) VALUES (?, ?)')
      .run(req.session.usuarioId, 'epic');
    res.json({ imagens });
  } catch (e) {
    return res.status(502).json({ erro: 'falha ao consultar EPIC' });
  }
});

module.exports = router;
