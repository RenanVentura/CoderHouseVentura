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
  let patrimonioInicial = parseInt(prompt("Quanto é o valor inicial?"));
  let aporteMensal = parseInt(prompt("Quanto será o aporte mensal?"));
  let jurosAnual = parseInt(prompt("Qual taxa de Juros anual?"));

  conta = window.confirm(
    `Seu patrimonio Inial: R$${patrimonioInicial}, aporte mensais de R$${aporteMensal} com juros anual de ${jurosAnual}%`
  );

  if (conta == true) {
    calculoPatrimonio(patrimonioInicial, aporteMensal, jurosAnual);
  } else {
    alert("Certo! Insira os valores novamente!");
  }
}

function calculoPatrimonio(patrimonioInicial, aporteMensal, jurosAnual) {
  let totalInvestido = patrimonioInicial + aporteMensal * 12;
  alert(`O Valor total investido foi R$${totalInvestido}`);

  let totalJuros = totalInvestido * (jurosAnual / 100);
  alert(`O valor total de Juros foi R$${totalJuros}`);
}
