let regioes = [];

async function carregarRegioes() {
  const dados = await api('/regioes');
  regioes = dados.regioes;
  renderizarRegioes();
}

function renderizarRegioes() {
  const lista = document.getElementById('listaRegioes');
  lista.innerHTML = '';
  regioes.forEach(r => {
    lista.innerHTML += `
      <tr>
        <td>${r.nome}</td>
        <td>${r.nivel_risco}</td>
        <td><button onclick="removerRegiao(${r.id})">Excluir</button></td>
      </tr>`;
  });
  atualizarAlertas();
}

async function salvarRegiao() {
  const nome = document.getElementById('regiao').value;
  const nivel_risco = document.getElementById('nivelRisco').value;
  const lat = document.getElementById('lat').value || null;
  const lon = document.getElementById('lon').value || null;
  if (!nome.trim()) return alert('Digite uma região');
  try {
    await api('/regioes', { method: 'POST', body: { nome, nivel_risco, lat, lon } });
    document.getElementById('regiao').value = '';
    carregarRegioes();
  } catch (e) { alert(e.message); }
}

async function removerRegiao(id) {
  await api(`/regioes/${id}`, { method: 'DELETE' });
  carregarRegioes();
}

function atualizarAlertas() {
  const historico = document.getElementById('historicoAlertas');
  historico.innerHTML = '';
  regioes.forEach(r => {
    let classe = 'alerta-baixo', msg = `✅ Situação normal em ${r.nome}`;
    if (r.nivel_risco === 'Alto') { classe = 'alerta-alto'; msg = `🚨 ALERTA CRÍTICO em ${r.nome}`; }
    else if (r.nivel_risco === 'Médio') { classe = 'alerta-medio'; msg = `⚠ Atenção para ${r.nome}`; }
    historico.innerHTML += `<div class="${classe}">${msg}</div>`;
  });
}

// perfil do usuário
api('/auth/me').then(({ usuario }) => {
  document.getElementById('perfilUsuario').innerHTML =
    `<div class="card"><h3>${usuario.nome}</h3><p>Operador do sistema OrbitaSafe</p></div>`;
}).catch(() => {});

// estatísticas NASA (consultas reais)
api('/relatorio').then(rel => {
  document.getElementById('totalConsultas').innerText = rel.totalConsultas;
}).catch(() => {});

// gráfico de evolução (ilustrativo)
const grafico = document.getElementById('graficoEvolucao');
new Chart(grafico, {
  type: 'line',
  data: {
    labels: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul'],
    datasets: [{ label: 'Alertas Registrados', data: [5,12,8,20,15,18,25], tension: 0.4 }]
  }
});

// recomendação automática
const recomendacoes = document.getElementById('recomendacoesIA');
if (recomendacoes) {
  recomendacoes.innerHTML =
    `<div class="card"><h3>Recomendação Automática</h3><p>Monitorar regiões com risco ALTO diariamente.</p></div>`;
}

carregarRegioes();
