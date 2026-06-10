const { test } = require('node:test');
const assert = require('node:assert');
process.env.DB_PATH = ':memory:';
const request = require('supertest');
const app = require('../app');

test('register cria usuário e retorna 201', async () => {
  const res = await request(app)
    .post('/api/auth/register')
    .send({ nome: 'Ana', email: 'ana@x.com', senha: 'senha123' });
  assert.strictEqual(res.status, 201);
  assert.strictEqual(res.body.usuario.email, 'ana@x.com');
  assert.strictEqual(res.body.usuario.senha_hash, undefined); // nunca vaza hash
});

test('register rejeita email duplicado com 409', async () => {
  await request(app).post('/api/auth/register')
    .send({ nome: 'B', email: 'dup@x.com', senha: 'senha123' });
  const res = await request(app).post('/api/auth/register')
    .send({ nome: 'B2', email: 'dup@x.com', senha: 'senha123' });
  assert.strictEqual(res.status, 409);
});

test('register valida campos faltando com 400', async () => {
  const res = await request(app).post('/api/auth/register').send({ email: 'x@x.com' });
  assert.strictEqual(res.status, 400);
});
