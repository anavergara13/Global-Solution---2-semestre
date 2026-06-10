const btnBuscar = document.getElementById("btnBuscar");
const img = document.getElementById("imagemTerra");
const info = document.getElementById("info");
const map = L.map('map').setView([-23.55, -46.63], 6);
const ctx = document.getElementById("grafico");
const tipoEpic =document.getElementById("tipoEpic");

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

new Chart(ctx, {
    type: "bar",
    data: {
        labels: [
            "Enchentes",
            "Queimadas",
            "Deslizamentos"
        ],
        datasets: [
            {
                label: "Ocorrências",
                data: [15, 8, 10]
            }
        ]
    }
});

document.getElementById("alertasAtivos").innerText = 15;
document.getElementById("regioes").innerText = 234;
document.getElementById("risco").innerText = "Alto";

btnBuscar.addEventListener(
    "click",
    buscarImagem
);

tipoEpic.addEventListener(
    "change",
    carregarUltimaImagem
);

async function carregarUltimaImagem() {

    try {

        info.innerHTML =
            '<p class="loading">Carregando imagem...</p>';

        const tipo =
            tipoEpic.value;

        const resposta =
            await fetch(
                `https://epic.gsfc.nasa.gov/api/${tipo}`
            );

        const dados =
            await resposta.json();

        if (!dados.length) {

            info.innerHTML =
                '<p class="error">Nenhuma imagem encontrada.</p>';

            return;
        }

        exibirImagem(
            dados[0],
            tipo
        );

    } catch (erro) {

        console.error(erro);

        info.innerHTML =
            '<p class="error">Erro ao carregar imagem.</p>';
    }
}

async function buscarImagem() {

    const data =
        dataBusca.value;

    if (!data) {

        alert(
            "Escolha uma data."
        );

        return;
    }

    try {

        info.innerHTML =
            '<p class="loading">Buscando imagens...</p>';

        const tipo =
            tipoEpic.value;

        const resposta =
            await fetch(
                `https://epic.gsfc.nasa.gov/api/${tipo}/date/${data}`
            );

        const dados =
            await resposta.json();

        if (!dados.length) {

            info.innerHTML =
                '<p class="error">Nenhuma imagem encontrada para esta data.</p>';

            return;
        }

        exibirImagem(
            dados[0],
            tipo
        );

    } catch (erro) {

        console.error(erro);

        info.innerHTML =
            '<p class="error">Erro ao buscar imagem.</p>';
    }
}

function exibirImagem(
    item,
    tipo
) {

    const dataCompleta =
        item.date.split(" ")[0];

    const [
        ano,
        mes,
        dia
    ] = dataCompleta.split("-");

    const imagemUrl =
        `https://epic.gsfc.nasa.gov/archive/${tipo}/${ano}/${mes}/${dia}/jpg/${item.image}.jpg`;

    img.src =
        imagemUrl;

        let consultas =
        Number(
        localStorage.getItem(
        "consultasNASA"
        )
        ) || 0;

        consultas++;

        localStorage.setItem(
        "consultasNASA",
        consultas
        );
        localStorage.setItem(
        "ultimoTipoNASA",
        tipo
        );


    info.innerHTML = `
        <div class="success">

            <h2>
                ${item.caption || "Imagem da Terra"}
            </h2>

            <p>
                <strong>Tipo:</strong>
                ${tipo.toUpperCase()}
            </p>

            <p>
                <strong>Data:</strong>
                ${item.date}
            </p>

            <p>
                <strong>Latitude:</strong>
                ${item.centroid_coordinates.lat}
            </p>

            <p>
                <strong>Longitude:</strong>
                ${item.centroid_coordinates.lon}
            </p>

        </div>
    `;
}

carregarUltimaImagem();