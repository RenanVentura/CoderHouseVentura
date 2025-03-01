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
// console.log(ativoImobiliario);
// console.log(ativoImobiliario.localizacao());

const ativoMovel = new CadastroAtivo("Lancer X", 80000, "Movel", {
  ano: 2024,
  fabricacao: 2023,
});

// console.log(ativoMovel);
// console.log(ativoMovel.documentos());

// --------------- Logica ------------------

//Consumo de API

const obterTaxaSelic = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const hoje = new Date();
      let dataAjustada = new Date(hoje);
      const diaDaSemana = hoje.getDay();

      if (diaDaSemana === 0) {
        dataAjustada.setDate(hoje.getDate() - 2);
      } else if (diaDaSemana === 6) {
        dataAjustada.setDate(hoje.getDate() - 1);
      }

      const formatarData = (data) => {
        const dia = ("0" + data.getDate()).slice(-2);
        const mes = ("0" + (data.getMonth() + 1)).slice(-2);
        const ano = data.getFullYear();
        return `${dia}/${mes}/${ano}`;
      };

      const dataFormatada = formatarData(dataAjustada);

      const url = `https://api.bcb.gov.br/dados/serie/bcdata.sgs.432/dados?formato=json&dataInicial=${dataFormatada}&dataFinal=${dataFormatada}`;

      const resposta = await fetch(url);
      const dados = await resposta.json();

      const taxaSelicAtual = dados[0].valor;
      resolve(taxaSelicAtual);
    } catch (erro) {
      reject(erro);
    }
  });
};

// Teste inicial (opcional)
// obterTaxaSelic()
//   .then((data) => console.log("Taxa Selic:", data))
//   .catch((error) => console.log("Erro na API:", error));

// Seleciona o botão "Taxa Selic" (certifique-se que no HTML o botão possua a classe "selic")
let botaoSelic = document.querySelector(".selic");

botaoSelic.addEventListener("click", async function () {
  try {
    const taxaSelicAtual = await obterTaxaSelic();
    document.getElementById("jurosAnual").value = taxaSelicAtual;
  } catch (erro) {
    console.error("Erro ao obter a Taxa Selic:", erro);
  }
});

// Seleciona o botão de calcular
let botaoCalc = document.querySelector(".calculadora");

botaoCalc.addEventListener("click", function () {
  calcular();
});

function calcular() {
  let patrimonioInicial = document.getElementById("patrimonioInicial");
  let aporteMensal = document.getElementById("aporteMensal");
  let jurosAnual = document.getElementById("jurosAnual");
  let periodo = document.getElementById("periodo");

  let patrimonioValor = parseFloat(patrimonioInicial.value);
  let aporteValor = parseFloat(aporteMensal.value) || 0;
  let jurosValor = parseFloat(jurosAnual.value);
  let periodoInvestimento = parseFloat(periodo.value);

  if (
    isNaN(patrimonioValor) ||
    isNaN(jurosValor) ||
    isNaN(periodoInvestimento)
  ) {
    swal("Preencha todos os campos!");
    return;
  }

  swal({
    title: `Seu patrimônio inicial: R$${patrimonioValor}, aportes mensais de R$${aporteValor} com juros anual de ${jurosValor}%`,
    buttons: ["Cancelar", "Calcular!"],
  }).then((confirmado) => {
    if (confirmado) {
      calculoPatrimonio(
        patrimonioValor,
        aporteValor,
        jurosValor,
        periodoInvestimento
      );
    } else {
      alert("Certo! Insira os valores novamente!");
    }
  });
}

// Função para efetuar o cálculo com juros compostos
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
    "R$ " +
    patrimonioFinal.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  document.getElementById("valorFinalSemJuros").innerText =
    "R$ " +
    patrimonioSemJuros.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  document.getElementById("totalJuros").innerText =
    "R$ " +
    totalJuros.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  document.getElementById("resumoPatrimonio").classList.remove("d-none");

  gerarGrafico(patrimonioInicial, aporteMensal, jurosMensal, meses);
}

// Plota o gráfico utilizando o Canvas
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
