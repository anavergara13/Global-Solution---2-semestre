// ====================================
// PERFIL
// ====================================

const perfil =
document.getElementById("perfilUsuario");

const usuario =
localStorage.getItem("usuario") || "Administrador";

perfil.innerHTML = `

<div class="card">

    <h3>${usuario}</h3>

    <p>
        Operador do sistema OrbitaSafe
    </p>

</div>

`;

// ====================================
// REGIÕES
// ====================================

let regioes =
JSON.parse(
localStorage.getItem("regioes")
) || [];

const lista =
document.getElementById(
"listaRegioes"
);

function renderizarRegioes(){

    lista.innerHTML = "";

    regioes.forEach((regiao,index)=>{

        lista.innerHTML += `

        <tr>

            <td>${regiao.nome}</td>

            <td>${regiao.risco}</td>

            <td>

                <button
                onclick="removerRegiao(${index})">

                Excluir

                </button>

            </td>

        </tr>

        `;

    });

    atualizarAlertas();

}

function salvarRegiao(){

    const nome =
    document.getElementById(
    "regiao"
    ).value;

    const risco =
    document.getElementById(
    "nivelRisco"
    ).value;

    if(nome.trim()===""){

        alert(
        "Digite uma região"
        );

        return;

    }

    regioes.push({

        nome,
        risco

    });

    localStorage.setItem(
    "regioes",
    JSON.stringify(regioes)
    );

    document.getElementById(
    "regiao"
    ).value="";

    renderizarRegioes();

}

function removerRegiao(index){

    regioes.splice(index,1);

    localStorage.setItem(
    "regioes",
    JSON.stringify(regioes)
    );

    renderizarRegioes();

}

// ====================================
// ALERTAS
// ====================================

function atualizarAlertas(){

    const historico =
    document.getElementById(
    "historicoAlertas"
    );

    historico.innerHTML="";

    regioes.forEach(regiao=>{

        let classe="";
        let mensagem="";

        if(regiao.risco==="Alto"){

            classe="alerta-alto";

            mensagem=
            `🚨 ALERTA CRÍTICO em ${regiao.nome}`;

        }

        else if(regiao.risco==="Médio"){

            classe="alerta-medio";

            mensagem=
            `⚠ Atenção para ${regiao.nome}`;

        }

        else{

            classe="alerta-baixo";

            mensagem=
            `✅ Situação normal em ${regiao.nome}`;

        }

        historico.innerHTML += `

        <div class="${classe}">

            ${mensagem}

        </div>

        `;

    });

}

// ====================================
// NASA
// ====================================

const consultas =
localStorage.getItem(
"consultasNASA"
) || 0;

const ultimoTipo =
localStorage.getItem(
"ultimoTipoNASA"
) || "Natural";

document.getElementById(
"totalConsultas"
).innerText =
consultas;

document.getElementById(
"ultimoTipo"
).innerText =
ultimoTipo;

// ====================================
// GRÁFICO
// ====================================

const grafico =
document.getElementById(
"graficoEvolucao"
);

new Chart(grafico,{

    type:"line",

    data:{

        labels:[

            "Jan",
            "Fev",
            "Mar",
            "Abr",
            "Mai",
            "Jun",
            "Jul"

        ],

        datasets:[{

            label:
            "Alertas Registrados",

            data:[

                5,
                12,
                8,
                20,
                15,
                18,
                25

            ],

            tension:0.4

        }]

    }

});

// ====================================
// IA
// ====================================

const recomendacoes =
document.getElementById(
"recomendacoesIA"
);

if(recomendacoes){

    recomendacoes.innerHTML = `

    <div class="card">

        <h3>Recomendação Automática</h3>

        <p>

        Monitorar regiões com
        risco ALTO diariamente.

        </p>

    </div>

    `;

}

renderizarRegioes();