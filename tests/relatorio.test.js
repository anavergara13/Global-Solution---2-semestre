const { test } = require('node:test');
const assert = require('node:assert');
process.env.DB_PATH = ':memory:';
const request = require('supertest');
const app = require('../app');

test('relatorio exige auth (401)', async () => {
  const res = await request(app).get('/api/relatorio');
  assert.strictEqual(res.status, 401);
});

test('relatorio retorna agregados do banco para o usuário', async () => {
  const agent = request.agent(app);
  await agent.post('/api/auth/register')
    .send({ nome: 'Rel', email: 'rel@x.com', senha: 'senha123' });
  await agent.post('/api/regioes').send({ nome: 'A', nivel_risco: 'Alto' });
  await agent.post('/api/regioes').send({ nome: 'B', nivel_risco: 'Baixo' });

  const res = await agent.get('/api/relatorio');
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.totalRegioes, 2);
  assert.strictEqual(res.body.riscoPorNivel.Alto, 1);
  assert.strictEqual(res.body.riscoPorNivel.Baixo, 1);
});
