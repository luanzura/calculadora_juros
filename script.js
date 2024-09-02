// Valores das parcelas para cartão e Nubank
const cartao = [
  4.39, 6.48, 7.54, 8.59, 9.65, 10.7, 14.41, 15.5, 16.62, 17.73, 18.86, 19.81,
];
const nubank = [
  2.77, 5.81, 6.98, 8.17, 9.36, 10.58, 11.8, 13.01, 14.25, 15.5, 16.76, 18.03,
];

function calcularParcelas(valor, parcelas, tipo) {
  let juros;
  if (tipo === "cartao") {
    juros = cartao[parcelas - 1] / 100;
  } else if (tipo === "nubank") {
    juros = nubank[parcelas - 1] / 100;
  } else {
    throw new Error("Tipo inválido");
  }

  const valorParcela = (valor * (1 + juros)) / parcelas;
  const valorTotal = valorParcela * parcelas;

  return {
    valorParcela: valorParcela.toFixed(2),
    valorTotal: valorTotal.toFixed(2),
  };
}

function calcular() {
  const valor = parseFloat(document.getElementById("valor").value);
  const valorTotalPix = valor;

  // Exibir o valor no Pix
  document.getElementById("valorPix").innerText = `R$ ${valorTotalPix.toFixed(
    2
  )}`;

  // Calcula resultados para Cartão
  let resultadoCartaoHTML = "";
  for (let i = 1; i <= cartao.length; i++) {
    const resultado = calcularParcelas(valorTotalPix, i, "cartao");
    resultadoCartaoHTML += `<tr><td>${i}x</td><td>R$${resultado.valorParcela}</td><td>R$${resultado.valorTotal}</td></tr>`;
  }
  document.getElementById("tbodyCartao").innerHTML = resultadoCartaoHTML;

  // Calcula resultados para Nubank
  let resultadoNubankHTML = "";
  for (let i = 1; i <= nubank.length; i++) {
    const resultado = calcularParcelas(valorTotalPix, i, "nubank");
    resultadoNubankHTML += `<tr><td>${i}x</td><td>R$${resultado.valorParcela}</td><td>R$${resultado.valorTotal}</td></tr>`;
  }
  document.getElementById("tbodyNubank").innerHTML = resultadoNubankHTML;
}

// Calcula automaticamente ao carregar a página
window.onload = calcular;

function capturarImagem() {
  // Cria uma nova div para capturar o conteúdo
  const resultadoDiv = document.createElement("div");

  // Definindo estilo para a captura de imagem
  resultadoDiv.style.width = "50%"; // Ajusta a largura para 50%
  resultadoDiv.style.margin = "0 auto"; // Centraliza a div na página
  resultadoDiv.style.display = "flex"; // Alinha as tabelas lado a lado
  resultadoDiv.style.flexDirection = "column"; // Coloca os elementos em coluna
  resultadoDiv.style.padding = "10px"; // Adiciona um padding para uma melhor visualização

  // Obtém a quantidade do input
  const quantidade = document.getElementById("quantidade").value;

  // Conteúdo da imagem incluindo quantidade e valor no Pix
  resultadoDiv.innerHTML = `
    <div style="text-align: center; margin-bottom: 20px; margin-top: 20px">
      <h2>Quantidade de Peças: ${quantidade}</h2>
      <h1>Valor no Pix: <strong>R$ ${parseFloat(
        document.getElementById("valor").value
      ).toFixed(2)}</strong></h1>
    </div>
    <div style="display: flex; justify-content: space-between">
      <div style="flex: 1; margin-right: 10px;">
        <div class="card shadow-sm mb-4">
          <div class="card-header bg-primary text-white">Parcelamento no Cartão</div>
          <div class="card-body">
            ${document.getElementById("tabelaCartao").outerHTML}
          </div>
        </div>
      </div>
      <div style="flex: 1; margin-left: 10px;">
        <div class="card shadow-sm mb-4">
          <div class="card-header bg-success text-white">Parcelamento no Cartão Nubank</div>
          <div class="card-body">
            ${document.getElementById("tabelaNubank").outerHTML}
          </div>
        </div>
      </div>
    </div>
  `;

  // Adiciona a div ao corpo do documento para que html2canvas possa encontrá-la
  document.body.appendChild(resultadoDiv);

  html2canvas(resultadoDiv)
    .then((canvas) => {
      canvas.toBlob((blob) => {
        if (navigator.clipboard) {
          navigator.clipboard
            .write([
              new ClipboardItem({
                [blob.type]: blob,
              }),
            ])
            .then(() => {
              alert("Imagem copiada para a área de transferência!");
              // Remove a div temporária após a captura
              document.body.removeChild(resultadoDiv);
            })
            .catch((err) => {
              console.error(
                "Erro ao copiar para a área de transferência:",
                err
              );
              alert(
                "Erro ao copiar para a área de transferência. Verifique as permissões do navegador."
              );
              // Remove a div temporária após a captura
              document.body.removeChild(resultadoDiv);
            });
        } else {
          alert(
            "Copiar para a área de transferência não é suportado neste navegador."
          );
          // Remove a div temporária após a captura
          document.body.removeChild(resultadoDiv);
        }
      });
    })
    .catch((err) => {
      console.error("Erro ao capturar imagem:", err);
      // Remove a div temporária após a captura
      document.body.removeChild(resultadoDiv);
    });
}
