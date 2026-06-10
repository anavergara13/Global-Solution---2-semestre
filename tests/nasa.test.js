const { test } = require('node:test');
const assert = require('node:assert');
const { normalizarEonet } = require('../routes/helpers');

test('normalizarEonet extrai titulo, categoria, lat/lon e data da última geometria', () => {
  const bruto = {
    events: [{
      title: 'Wildfire X',
      categories: [{ title: 'Wildfires' }],
      link: 'http://e/1',
      geometry: [
        { date: '2026-06-01T00:00:00Z', coordinates: [-50, -10] },
        { date: '2026-06-05T00:00:00Z', coordinates: [-49.1, -26.9] }
      ]
    }]
  };
  const out = normalizarEonet(bruto);
  assert.strictEqual(out.length, 1);
  assert.deepStrictEqual(out[0], {
    titulo: 'Wildfire X',
    categoria: 'Wildfires',
    lat: -26.9,
    lon: -49.1,
    data: '2026-06-05T00:00:00Z',
    link: 'http://e/1'
  });
});

test('normalizarEonet ignora eventos sem geometria', () => {
  const out = normalizarEonet({ events: [{ title: 'sem geo', categories: [], geometry: [] }] });
  assert.strictEqual(out.length, 0);
});

process.env.DB_PATH = ':memory:';
const request = require('supertest');
const app = require('../app');

test('GET /api/nasa/eonet exige auth (401)', async () => {
  const res = await request(app).get('/api/nasa/eonet');
  assert.strictEqual(res.status, 401);
});
