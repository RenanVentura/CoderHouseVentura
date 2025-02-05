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

let conta = false;

while (conta != true) {
  let botaoCalc = document.querySelector(".calculadora");

  botaoCalc.addEventListener("click", function () {
    calcular();
  });

  function calcular() {
    let patrimonioInicial = document.getElementById("patrimonioInicial");
    let aporteMensal = document.getElementById("aporteMensal");
    let jurosAnual = document.getElementById("aporteMensal");
    let periodo = documento.getElementById("periodo");

    let patrimonioValor = parseFloat(patrimonioInicial.value);
    let aporteValor = parseFloat(aporteMensal.value);
    let jurosValor = parseFloat(jurosAnual.value);
    let periodoInventimento = parseFloat(periodo.value);

    conta = window.confirm(
      `Seu patrimonio Inial: R$${patrimonioValor}, aporte mensais de R$${aporteMensal} com juros anual de ${jurosAnual}%`
    );

    if (conta == true) {
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
}

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
    (aporteMensal * (Math.pow(1 + jurosMensal, meses) - 1)) / jurosMensal;

  alert(
    `Após o periodo de ${periodo} investindo, tera um patrimonio final de R$${patrimonioFinal.toFixed(
      2
    )}`
  );
}
