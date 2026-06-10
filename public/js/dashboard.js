const btnBuscar = document.getElementById("btnBuscar");
const img = document.getElementById("imagemTerra");
const info = document.getElementById("info");
const map = L.map('map').setView([-23.55, -46.63], 6);
const ctx = document.getElementById("grafico");
const tipoEpic = document.getElementById("tipoEpic");

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

new Chart(ctx, {
  type: "bar",
  data: {
    labels: ["Enchentes", "Queimadas", "Deslizamentos"],
    datasets: [{ label: "Ocorrências", data: [15, 8, 10] }]
  }
});

btnBuscar.addEventListener("click", buscarImagem);
tipoEpic.addEventListener("change", carregarUltimaImagem);

async function carregarPainel() {
  try {
    const { eventos } = await api('/nasa/eonet');
    const { regioes } = await api('/regioes');

    document.getElementById('alertasAtivos').innerText = eventos.length;
    document.getElementById('regioes').innerText = regioes.length;
    const altos = regioes.filter(r => r.nivel_risco === 'Alto').length;
    document.getElementById('risco').innerText = altos > 0 ? 'Alto' : (regioes.length ? 'Médio' : '—');

    eventos.slice(0, 50).forEach(ev => {
      L.marker([ev.lat, ev.lon]).addTo(map)
        .bindPopup(`<b>${ev.titulo}</b><br>${ev.categoria}<br>${ev.data}`);
    });
  } catch (e) {
    console.error(e);
  }
}

async function carregarUltimaImagem() {
  try {
    info.innerHTML = '<p class="loading">Carregando imagem...</p>';
    const tipo = tipoEpic.value;
    const { imagens } = await api(`/nasa/epic?tipo=${tipo}`);
    if (!imagens.length) { info.innerHTML = '<p class="error">Nenhuma imagem encontrada.</p>'; return; }
    exibirImagem(imagens[0], tipo);
  } catch (e) {
    console.error(e);
    info.innerHTML = '<p class="error">Erro ao carregar imagem.</p>';
  }
}

async function buscarImagem() {
  const data = document.getElementById('dataBusca').value;
  if (!data) { alert("Escolha uma data."); return; }
  try {
    info.innerHTML = '<p class="loading">Buscando imagens...</p>';
    const tipo = tipoEpic.value;
    const { imagens } = await api(`/nasa/epic?tipo=${tipo}&data=${data}`);
    if (!imagens.length) { info.innerHTML = '<p class="error">Nenhuma imagem encontrada para esta data.</p>'; return; }
    exibirImagem(imagens[0], tipo);
  } catch (e) {
    console.error(e);
    info.innerHTML = '<p class="error">Erro ao buscar imagem.</p>';
  }
}

function exibirImagem(item, tipo) {
  img.src = item.url;
  info.innerHTML = `
    <div class="success">
      <h2>${item.caption || "Imagem da Terra"}</h2>
      <p><strong>Tipo:</strong> ${tipo.toUpperCase()}</p>
      <p><strong>Data:</strong> ${item.data}</p>
      <p><strong>Latitude:</strong> ${item.lat}</p>
      <p><strong>Longitude:</strong> ${item.lon}</p>
    </div>`;
}

carregarPainel();
carregarUltimaImagem();
