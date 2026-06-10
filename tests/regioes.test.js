const { test } = require('node:test');
const assert = require('node:assert');
process.env.DB_PATH = ':memory:';
const request = require('supertest');
const app = require('../app');

async function logado() {
  const agent = request.agent(app);
  await agent.post('/api/auth/register')
    .send({ nome: 'R', email: `r${Math.floor(performance.now()*1000)}@x.com`, senha: 'senha123' });
  return agent;
}

test('regiões exige autenticação (401)', async () => {
  const res = await request(app).get('/api/regioes');
  assert.strictEqual(res.status, 401);
});

test('cria, lista e remove região', async () => {
  const agent = await logado();
  const criar = await agent.post('/api/regioes')
    .send({ nome: 'Vale do Itajaí', lat: -26.9, lon: -49.1, nivel_risco: 'Alto' });
  assert.strictEqual(criar.status, 201);
  const id = criar.body.regiao.id;

  const lista = await agent.get('/api/regioes');
  assert.strictEqual(lista.body.regioes.length, 1);

  const del = await agent.delete(`/api/regioes/${id}`);
  assert.strictEqual(del.status, 200);
  const lista2 = await agent.get('/api/regioes');
  assert.strictEqual(lista2.body.regioes.length, 0);
});

test('valida nivel_risco inválido (400)', async () => {
  const agent = await logado();
  const res = await agent.post('/api/regioes')
    .send({ nome: 'X', nivel_risco: 'Altíssimo' });
  assert.strictEqual(res.status, 400);
});
