function enviarPergunta() {
    const pergunta = document.getElementById("pergunta").value;
    const chat = document.getElementById("chat");

    if (pergunta === "") {
        return;
    }

    chat.innerHTML += `
        <div class="user-msg">
            ${pergunta}
        </div>
    `;

    let resposta = "";
    const texto = pergunta.toLowerCase();

    if (texto.includes("enchente")) {
        resposta = "Existe risco elevado de enchentes para os próximos 7 dias.";
    } else if (texto.includes("queimada")) {
        resposta = "Foram detectados focos de calor em regiões monitoradas.";
    } else if (texto.includes("deslizamento")) {
        resposta = "Há áreas com risco moderado de deslizamento.";
    } else {
        resposta = "Dados insuficientes para análise detalhada.";
    }

    chat.innerHTML += `
        <div class="bot-msg">
            ${resposta}
        </div>
    `;

    document.getElementById("pergunta").value = "";
}