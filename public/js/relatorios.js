async function gerarRelatorio() {
  const alvo = document.getElementById('resultado');
  alvo.innerHTML = '<p>Gerando...</p>';
  try {
    const rel = await api('/relatorio');
    const cats = Object.entries(rel.eventosPorCategoria)
      .map(([k, v]) => `<li>${k}: ${v}</li>`).join('') || '<li>Nenhum evento ativo</li>';
    alvo.innerHTML = `
      <h2>Relatório Ambiental (dados reais)</h2>
      <p>🛰️ Eventos naturais ativos (NASA EONET): <strong>${rel.totalEventos}</strong></p>
      <ul>${cats}</ul>
      <p>🌎 Regiões monitoradas: <strong>${rel.totalRegioes}</strong></p>
      <p>🔴 Alto: ${rel.riscoPorNivel.Alto} · 🟠 Médio: ${rel.riscoPorNivel['Médio']} · 🟢 Baixo: ${rel.riscoPorNivel.Baixo}</p>
      <p>📡 Consultas à NASA feitas: <strong>${rel.totalConsultas}</strong></p>`;
  } catch (e) {
    alvo.innerHTML = `<p>Erro: ${e.message}</p>`;
  }
}
