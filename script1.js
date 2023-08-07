let meuFormulario = document.getElementById("meuFormulario")
let btMerge = document.getElementById("bt_merge")
let matricula = document.getElementById("matricula");
let codigo = document.getElementById("codigo");
let resultado = document.getElementById("result");

let textoCopiado2 = "";

const getCodigo = () =>{
  let xpathMatricula = '//*[@id="ContentPlaceHolder1_txbMatricula"]';
  let resultMatricula = document.evaluate(xpathMatricula, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
  let elementMatricula = resultMatricula.singleNodeValue;

  let xpathCodigo = '//*[@id="ContentPlaceHolder1_gvContFiliados_lbCodigo_0"]';
  let resultCodigo = document.evaluate(xpathCodigo, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
  let elementCodigo = resultCodigo.singleNodeValue ;
  
  let codigo =`${elementMatricula.value}_${elementCodigo.innerText}_`;
  return codigo
}

btMerge.addEventListener('click', async(event) => {
  event.preventDefault();  

  const [tab] = await chrome.tabs.query({ active: true, currentWindow:true });

  chrome.scripting.executeScript({
    target:{ tabId: tab.id},
    function: getCodigo,
  }, (result) => {
      if (!chrome.runtime.lastError && result && result[0] && result[0].result) {
        var codigo = result[0].result;
        // Faça algo com o valor retornado (codigo)
        resultado.textContent = codigo;
        meuFormulario.style.height = "345px";
        navigator.clipboard.writeText(codigo)
      }
  });
});




//Funções para abrir e fechar o modal
document.getElementById("title").addEventListener( 'click', function(){ 
  let classDisplay = document.getElementById("display");
  
  if (classDisplay.style.display === 'none'|| classDisplay.style.display === ''){
    classDisplay.style.cssText  = 
      'display: flex;' +
      'align-content: flex-start;'+
      'flex-wrap: wrap;' +
      'justify-content: space-between;' +
      'align-items: center;'
    meuFormulario.style.height = "325px";
  }else{
    classDisplay.style.display = 'none';
    meuFormulario.style.height = "100%";
  }
});

//Fim do modal






/*

let sendFile = document.querySelector("#bt_submit");
let arquivoExtencao = 'Danilo';

sendFile.addEventListener('click', async(event) => {
  event.preventDefault();
  enviarMensagemAoContentScript();
});

async function enviarMensagemAoContentScript() {
  
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const mensagem = {
      acao: "executarFuncao",
      valorAdicional:'Danilo'
    }; // Defina uma ação específica, se necessário
    chrome.tabs.sendMessage(tabs[0].id, mensagem);
  });
}


*/

let janelaAbertaId;
let paginaCarregada = false;


document.getElementById("bt_submit").addEventListener('click', async(event) => {
    event.preventDefault();

    await abrirNovaJanela();  
    console.log(janelaAbertaId)
  });

  function abrirNovaJanela(){
    return new Promise ((resolve,reject) => {
        chrome.windows.create({
            url:'https://ctn.sistematodos.com.br/paginas/filiado/PosVenda.aspx',
            type: 'normal',
            width:200,
            height:100
        }, function(window){
            janelaAbertaId = window.id + 1;
            resolve();
        });
        console.log("abriu a Janela")
    })
};



document.getElementById("bt_subir").addEventListener('click', async(event) => {
    event.preventDefault();
    console.log('vai enviar a mensagem')

    try{
        await realizarCliqueNaJanela()
    

        console.log('enviou a mensagem (realizarCliqueNaJanela)')
    
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { acao: 'cliqueElemento' });
          });
    }catch(error){
        console.log("Ocorreu um erro: ", error.message);
    }
    
  });

  chrome.runtime.onMessage.addListener(function (resposta) {
    if (resposta.acao === 'respostaClique') {
      console.log('Resposta recebida do content script:', resposta.valorClicado);
    }
  });

function realizarCliqueNaJanela() {

    return new Promise((resolve,reject) => {

        console.log('entrou no realizarCliqueNaJanela')
        console.log(janelaAbertaId)
        console.log(paginaCarregada)
    
        if (janelaAbertaId && paginaCarregada){
            console.log("O if deu true")
                chrome.scripting.executeScript(
                    {
                        target:{tabId: janelaAbertaId},
                        files: ['uploadFile.js']
                    },
                function() {
                    // Criação do MutationObserver para observar alterações no DOM
                    const observer = new MutationObserver((mutationsList, observer) => {
                      for (const mutation of mutationsList) {
                        // Verifica se o elemento desejado foi criado no DOM
                        if (mutation.target.id === 'seuElementoDesejado') {
                          // Extrai o valor do elemento
                          const valorDoElemento = mutation.target.textContent.trim();
                          console.log('Valor do elemento:', valorDoElemento);
                          // Encerra o MutationObserver após encontrar o elemento
                          observer.disconnect();
                          // Envia a resposta com o valor do elemento para o script principal
                          resolve(valorDoElemento);
                          return;
                        }
                      }
                    });
          
                    // Inicia a observação no DOM
                    observer.observe(document, { childList: true, subtree: true });
          
                    chrome.tabs.sendMessage(janelaAbertaId, { acao: 'cliqueElemento' });
                    console.log('Enviou a mensagem para o script uploadFile.js', janelaAbertaId);
                  }
                );
              } else{
                console.log("o if deu false")
                reject(new Error("Não foi o promise"))
            }
    })
    
  }


chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (tabId === janelaAbertaId && changeInfo.status === 'complete') {
      // A página foi totalmente carregada
      paginaCarregada = true;
      console.log("onUpdated" + tabId + "ou" + janelaAbertaId)
    }
  });
