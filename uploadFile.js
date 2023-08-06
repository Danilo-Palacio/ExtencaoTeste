
chrome.runtime.onMessage.addListener(function (mensagem, sender, sendResponse) {
    
    if (mensagem.acao === 'cliqueElemento') {
      // Simule o clique em um elemento da página
      const elementoParaClicar = document.querySelector('#ContentPlaceHolder1_btnEnviarArquivo');
  
    
      if (elementoParaClicar) {

        elementoParaClicar.click();


        setTimeout(function () {
            const elementoPai = document.querySelector('#ContentPlaceHolder1_MessageBoxPosVenda_MessageBoxInterface');
            const elementoFilho = elementoPai.querySelector('p');
            const valorDoElemento = elementoFilho.textContent;
    
            let valor;
    
            if (valorDoElemento) {
              valor = valorDoElemento;
            } else {
              valor = "Não foi";
            }
    
            // Envia a resposta com o valor do elemento filho para o script principal
            chrome.runtime.sendMessage({ acao: 'respostaClique', valorClicado: valor });
            }, 500); // Aguarda 500 milissegundos (ou outro valor adequado)
            }

        chrome.runtime.sendMessage({ acao: 'respostaClique', valorClicado: valor });

      }
    });