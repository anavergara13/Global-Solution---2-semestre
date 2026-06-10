module.exports = function requireAuth(req, res, next) {
  if (!req.session || !req.session.usuarioId) {
    return res.status(401).json({ erro: 'não autenticado' });
  }
  next();
};
