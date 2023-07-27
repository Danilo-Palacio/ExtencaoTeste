/*

// Recupera a informação relevante da página
let xpath = '//*[@id="ContentPlaceHolder1_txbMatricula"]'
const informacaoDaPagina = xpath.value; // Defina a lógica para obter a informação da página

// Envia a informação para a extensão
chrome.runtime.sendMessage({ informacao: informacaoDaPagina });


// Função para simular um clique no botão de envio
 function simulateButtonClick(valorAdicional) {
    // Encontre o botão pelo seu seletor (classe, ID, etc.)
    const button = document.querySelector("#ContentPlaceHolder1_btnEnviarArquivo");
    
    // Verifique se o botão foi encontrado antes de clicar
    if (button) {
      // Dispare um evento de clique no botão
      const clickEvent = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window
      });
      console.log(valorAdicional)
      button.dispatchEvent(clickEvent);
    }
  }
  
 

  // Ouvinte para receber mensagens do script.js
chrome.runtime.onMessage.addListener(async function (mensagem, sender, sendResponse) {
    if (mensagem.acao === "executarFuncao") {
      // Chame sua função que precisa ser executada na página externa
      const valorAdicional = mesagem.valorAdicional;
      simulateButtonClick(valorAdicional);

      console.log("Chegou no content")
    }
});
  

// Sobrescrever o método addEventListener
const originalAddEventListener = EventTarget.prototype.addEventListener;
const eventosAdicionados = {}; // Objeto para armazenar os eventos adicionados

EventTarget.prototype.addEventListener = function (type, listener, options) {
  // Registre o evento no objeto eventosAdicionados
  if (!eventosAdicionados[this]) {
    eventosAdicionados[this] = [];
  }

  eventosAdicionados[this].push({ type, listener, options });
  console.log(originalAddEventListener)
  // Chame o addEventListener original
  return originalAddEventListener.call(this, type, listener, options);
};
*/
function minhaFuncao() {
    // Realize alguma ação na página externa
    // Exemplo: Alterar o texto de um elemento
    const elemento = document.querySelector("#seletor-do-elemento");
    if (elemento) {
      elemento.textContent = "Texto alterado pelo content.js";
    }
  }
  
  // Aguardar o evento DOMContentLoaded antes de executar a função
  document.addEventListener("DOMContentLoaded", function () {
    minhaFuncao();
  });
  
  // Ouvinte para receber mensagens do script.js
  chrome.runtime.onMessage.addListener(function (mensagem, sender, sendResponse) {
    if (mensagem.acao === "executarFuncao") {
      // Chame a função apenas quando a mensagem for recebida
      minhaFuncao();
    }
  });