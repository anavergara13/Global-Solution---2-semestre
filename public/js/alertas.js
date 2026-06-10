const ICONES = { Alto: '🔴', 'Médio': '🟠', Baixo: '🟢' };

function classificaRisco(categoria) {
  const altos = ['Wildfires', 'Severe Storms', 'Volcanoes', 'Floods'];
  const medios = ['Sea and Lake Ice', 'Dust and Haze', 'Landslides'];
  if (altos.includes(categoria)) return 'Alto';
  if (medios.includes(categoria)) return 'Médio';
  return 'Baixo';
}

async function carregarAlertas() {
  const tabela = document.getElementById('tabelaAlertas');
  try {
    const { eventos } = await api('/nasa/eonet');
    tabela.innerHTML = '';
    eventos.slice(0, 30).forEach(ev => {
      const risco = classificaRisco(ev.categoria);
      tabela.innerHTML += `
        <tr>
          <td>${ev.titulo}</td>
          <td>${ev.categoria}</td>
          <td class="risco-${risco.toLowerCase().normalize('NFD').replace(/[^a-z]/g,'')}">
            ${ICONES[risco]} ${risco}
          </td>
        </tr>`;
    });
    if (!eventos.length) {
      tabela.innerHTML = '<tr><td colspan="3">Nenhum evento ativo no momento.</td></tr>';
    }
  } catch (e) {
    tabela.innerHTML = `<tr><td colspan="3">Erro ao carregar alertas: ${e.message}</td></tr>`;
  }
}
carregarAlertas();
