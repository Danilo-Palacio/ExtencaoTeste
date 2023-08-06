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
    realizarCliqueNaJanela();

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { acao: 'cliqueElemento' });
      });
  });

  chrome.runtime.onMessage.addListener(function (resposta) {
    if (resposta.acao === 'respostaClique') {
      console.log('Resposta recebida do content script:', resposta.valorClicado);
    }
  });

function realizarCliqueNaJanela() {
    if (janelaAbertaId && paginaCarregada){
            chrome.scripting.executeScript({
                target:{tabId: janelaAbertaId},
                files: ['uploadFile.js']
            }, function() {
                chrome.tabs.sendMessage(janelaAbertaId, { acao: 'cliqueElemento' });
                console.log("enviou o script" + janelaAbertaId)
             });
        } else{
            console.log("Não foi")
            console.log(janelaAbertaId)
            console.log(paginaCarregada)
        }
  }


chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (tabId === janelaAbertaId && changeInfo.status === 'complete') {
      // A página foi totalmente carregada
      paginaCarregada = true;
      console.log("onUpdated" + tabId + "ou" + janelaAbertaId)
    }
  });
