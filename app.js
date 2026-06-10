const path = require('path');
const express = require('express');
const helmet = require('helmet');
const session = require('express-session');

const app = express();

app.use(helmet({ contentSecurityPolicy: false })); // CSP off: front usa CDNs (Leaflet/Chart)
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'orbitasafe-dev-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'lax' }
}));

app.use('/api/auth', require('./routes/auth'));

app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;
