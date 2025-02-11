class CadastroAtivo {
  constructor(nome, valor, tipo, especificacoes) {
    this.nome = nome;
    this.valor = valor;
    this.tipo = tipo;

    if (tipo === "Imobiliario") {
      const { rua, bairro, noCentro } = especificacoes;
      this.rua = rua;
      this.bairro = bairro;
      this.noCentro = noCentro;

      this.localizacao = function () {
        return `Rua: ${this.rua}, Bairro: ${this.bairro}, No centro: ${
          this.noCentro ? "Sim" : "Não"
        }`;
      };
    } else if (tipo === "Movel") {
      const { ano, fabricacao } = especificacoes;
      this.ano = ano;
      this.fabricacao = fabricacao;

      this.documentos = function () {
        return `Ano: ${this.ano}, Fabricação: ${this.fabricacao}
        }`;
      };
    }
  }
}

const ativoImobiliario = new CadastroAtivo("Duplex", 700000, "Imobiliario", {
  rua: "Av. Ipanema",
  bairro: "Centro",
  noCentro: true,
});
console.log(ativoImobiliario);
console.log(ativoImobiliario.localizacao());

const ativoMovel = new CadastroAtivo("Lancer X", 80000, "Movel", {
  ano: 2024,
  fabricacao: 2023,
});

console.log(ativoMovel);
console.log(ativoMovel.documentos());

// --------------- Logica ------------------

let botaoCalc = document.querySelector(".calculadora");

botaoCalc.addEventListener("click", function () {
  calcular();
});

function calcular() {
  let patrimonioInicial = document.getElementById("patrimonioInicial");
  let aporteMensal = document.getElementById("aporteMensal");
  let jurosAnual = document.getElementById("jurosAnual");
  let periodo = document.getElementById("periodo");

  if (!patrimonioInicial || !aporteMensal || !jurosAnual || !periodo) {
    alert("Erro: Campos não encontrados!");
    return;
  }

  let patrimonioValor = parseFloat(patrimonioInicial.value);
  let aporteValor = parseFloat(aporteMensal.value);
  let jurosValor = parseFloat(jurosAnual.value);
  let periodoInventimento = parseFloat(periodo.value);

  let conta = window.confirm(
    `Seu patrimônio Inicial: R$${patrimonioValor}, aportes mensais de R$${aporteValor} com juros anual de ${jurosValor}%`
  );

  if (conta) {
    calculoPatrimonio(
      patrimonioValor,
      aporteValor,
      jurosValor,
      periodoInventimento
    );
  } else {
    alert("Certo! Insira os valores novamente!");
  }
}

// Função para efetuar calculo com juros compostos!

function calculoPatrimonio(
  patrimonioInicial,
  aporteMensal,
  jurosAnual,
  periodo
) {
  let meses = periodo * 12;
  let jurosMensal = jurosAnual / 100 / 12;

  let patrimonioFinal =
    patrimonioInicial * Math.pow(1 + jurosMensal, meses) +
    ((aporteMensal * (Math.pow(1 + jurosMensal, meses) - 1)) / jurosMensal) *
      (1 + jurosMensal);

  let patrimonioSemJuros = patrimonioInicial + aporteMensal * meses;
  let totalJuros = patrimonioFinal - patrimonioSemJuros;

  document.getElementById("valorFinalJuros").innerText =
    "R$" + patrimonioFinal.toLocaleString();
  document.getElementById("valorFinalSemJuros").innerText =
    "R$" + patrimonioSemJuros.toLocaleString(2);
  document.getElementById("totalJuros").innerText =
    "R$" + totalJuros.toLocaleString();

  document.getElementById("resumoPatrimonio").classList.remove("d-none");

  alert(
    `Após o período de ${periodo} anos investindo, terá um patrimônio final de R$${patrimonioFinal.toFixed(
      2
    )}`
  );

  gerarGrafico(patrimonioInicial, aporteMensal, jurosMensal, meses);
}

// Plota o Grafico utilizando o Canvas
function gerarGrafico(patrimonioInicial, aporteMensal, jurosMensal, meses) {
  let patrimonios = [];
  let patrimoniosSemJuros = [];
  let labels = [];

  for (let i = 0; i <= meses; i++) {
    let valorPatrimonio =
      patrimonioInicial * Math.pow(1 + jurosMensal, i) +
      ((aporteMensal * (Math.pow(1 + jurosMensal, i) - 1)) / jurosMensal) *
        (1 + jurosMensal);

    let valorPatrimonioSemJuros = patrimonioInicial + aporteMensal * i;

    patrimonios.push(valorPatrimonio);
    patrimoniosSemJuros.push(valorPatrimonioSemJuros);
    labels.push(`Mês ${i}`);
  }

  const ctx = document.getElementById("graficoPatrimonio").getContext("2d");
  const canvas = document.getElementById("graficoPatrimonio");
  canvas.style.height = "400px";

  new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Patrimônio com Juros",
          data: patrimonios,
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderWidth: 2,
          fill: true,
          tension: 0.8,
          pointRadius: 0,
          pointHoverRadius: 0,
        },
        {
          label: "Patrimônio Sem Juros",
          data: patrimoniosSemJuros,
          borderColor: "rgb(255, 0, 0)",
          backgroundColor: "rgba(255, 0, 0, 0.2)",
          borderWidth: 2,
          fill: false,
          tension: 0.8,
          pointRadius: 0,
          pointHoverRadius: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          title: {
            display: true,
            text: "Meses",
          },
        },
        y: {
          title: {
            display: true,
            text: "Patrimônio (R$)",
          },
          beginAtZero: false,
        },
      },
    },
  });
}
