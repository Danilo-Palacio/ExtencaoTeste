
chrome.runtime.onMessage.addListener(function (mensagem, sender, sendResponse) {
    
    console.log("TESTE");

    if (mensagem.acao === 'cliqueElemento') {
      // Simule o clique em um elemento da página
      const elementoParaClicar = document.querySelector('#ContentPlaceHolder1_btnEnviarArquivo');
  
    
      if (elementoParaClicar) {

        elementoParaClicar.click();


        setTimeout(function () {
            
                const elementoPai = document.querySelector('#ContentPlaceHolder1_MessageBoxPosVenda_MessageBoxInterface');
                const elementoFilho = elementoPai.querySelector('p');
                const valorDoElemento = elementoFilho.textContent;
        
                console.log(elementoFilho)
                console.log(valorDoElemento)

                let valor;
                        
                if (!valorDoElemento) {
                valor = "Não foi";
                } else {
                valor = valorDoElemento;
                }
        
                // Envia a resposta com o valor do elemento filho para o script principal
                sendResponse({ acao: 'respostaClique', valorClicado: valor });
                }, 500); // Aguarda 500 milissegundos (ou outro valor adequado)
        }
        return true;

        }
});