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

test('login válido inicia sessão e /me retorna usuário', async () => {
  const agent = request.agent(app);
  await agent.post('/api/auth/register')
    .send({ nome: 'Léo', email: 'leo@x.com', senha: 'senha123' });
  await agent.post('/api/auth/logout');
  const login = await agent.post('/api/auth/login')
    .send({ email: 'leo@x.com', senha: 'senha123' });
  assert.strictEqual(login.status, 200);
  const me = await agent.get('/api/auth/me');
  assert.strictEqual(me.status, 200);
  assert.strictEqual(me.body.usuario.email, 'leo@x.com');
});

test('login com senha errada retorna 401', async () => {
  await request(app).post('/api/auth/register')
    .send({ nome: 'M', email: 'm@x.com', senha: 'senha123' });
  const res = await request(app).post('/api/auth/login')
    .send({ email: 'm@x.com', senha: 'errada' });
  assert.strictEqual(res.status, 401);
});

test('/me sem sessão retorna 401', async () => {
  const res = await request(app).get('/api/auth/me');
  assert.strictEqual(res.status, 401);
});
