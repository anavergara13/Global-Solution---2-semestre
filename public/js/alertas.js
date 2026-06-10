const alertas = [
    {
        cidade: "São Paulo",
        tipo: "Enchente",
        risco: "Alto"
    },
    {
        cidade: "Campinas",
        tipo: "Queimada",
        risco: "Médio"
    },
    {
        cidade: "Santos",
        tipo: "Deslizamento",
        risco: "Baixo"
    }
];

const tabela = document.getElementById("tabelaAlertas");

alertas.forEach(item => {
    let classe = "";

    if (item.risco === "Alto") {
        classe = "risco-alto";
    }
    if (item.risco === "Médio") {
        classe = "risco-medio";
    }
    if (item.risco === "Baixo") {
        classe = "risco-baixo";
    }

    tabela.innerHTML += `
        <tr>
            <td>${item.cidade}</td>
            <td>${item.tipo}</td>
            <td class="${classe}">${item.risco}</td>
        </tr>
    `;
});