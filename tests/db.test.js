const { test } = require('node:test');
const assert = require('node:assert');
process.env.DB_PATH = ':memory:';
const db = require('../db/connection');

test('schema cria as tabelas esperadas', () => {
  const nomes = db.prepare(
    "SELECT name FROM sqlite_master WHERE type='table'"
  ).all().map(r => r.name);
  assert.ok(nomes.includes('usuarios'));
  assert.ok(nomes.includes('regioes'));
  assert.ok(nomes.includes('consultas_nasa'));
});
