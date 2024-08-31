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
  const totalJuros = valorTotal - valor;

  return {
    valorParcela: valorParcela.toFixed(2),
    valorTotal: valorTotal.toFixed(2),
    totalJuros: totalJuros.toFixed(2),
    jurosPercentual: (juros * 100).toFixed(2),
  };
}

function calcular() {
  const valor = parseFloat(document.getElementById("valor").value);

  // Calcula resultados para Cartão
  let resultadoCartaoHTML = "";
  for (let i = 1; i <= cartao.length; i++) {
    const resultado = calcularParcelas(valor, i, "cartao");
    resultadoCartaoHTML += `<tr><td>${i}x</td><td>R$${resultado.valorParcela}</td><td>R$${resultado.valorTotal}</td></tr>`;
  }
  document.getElementById("tbodyCartao").innerHTML = resultadoCartaoHTML;

  // Calcula resultados para Nubank
  let resultadoNubankHTML = "";
  for (let i = 1; i <= nubank.length; i++) {
    const resultado = calcularParcelas(valor, i, "nubank");
    resultadoNubankHTML += `<tr><td>${i}x</td><td>R$${resultado.valorParcela}</td><td>R$${resultado.valorTotal}</td></tr>`;
  }
  document.getElementById("tbodyNubank").innerHTML = resultadoNubankHTML;
}

// Calcula automaticamente ao carregar a página
window.onload = calcular;

function capturarImagem() {
  // Cria uma nova div para capturar o conteúdo
  const resultadoDiv = document.createElement("div");
  resultadoDiv.style.display = "flex"; // Alinha as tabelas lado a lado
  resultadoDiv.style.justifyContent = "space-between"; // Espaço entre as tabelas
  resultadoDiv.innerHTML = `
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
          <div class="card-header bg-success text-white">Parcelamento no Nubank</div>
          <div class="card-body">
            ${document.getElementById("tabelaNubank").outerHTML}
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
                "Erro ao copiar imagem para a área de transferência:",
                err
              );
            });
        } else {
          alert(
            "O recurso de copiar para a área de transferência não está disponível."
          );
        }
      });
    })
    .catch((err) => {
      console.error("Erro ao capturar a imagem:", err);
      // Remove a div temporária em caso de erro
      document.body.removeChild(resultadoDiv);
    });
}
