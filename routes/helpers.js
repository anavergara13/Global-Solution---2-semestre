function normalizarEonet(bruto) {
  const eventos = (bruto && bruto.events) || [];
  return eventos
    .filter(e => Array.isArray(e.geometry) && e.geometry.length > 0)
    .map(e => {
      const g = e.geometry[e.geometry.length - 1]; // última posição conhecida
      const [lon, lat] = g.coordinates;
      return {
        titulo: e.title,
        categoria: (e.categories && e.categories[0] && e.categories[0].title) || 'Outro',
        lat,
        lon,
        data: g.date,
        link: e.link || null
      };
    });
}

// cache simples em memória com TTL
const cache = new Map();
function cacheGet(chave, ttlMs) {
  const item = cache.get(chave);
  if (item && (item.expira > performance.now())) return item.valor;
  return null;
}
function cacheSet(chave, valor, ttlMs) {
  cache.set(chave, { valor, expira: performance.now() + ttlMs });
}

module.exports = { normalizarEonet, cacheGet, cacheSet };
