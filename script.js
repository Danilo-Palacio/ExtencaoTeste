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


// Função para enviar mensagem para o content.js com um valor adicional
function enviarMensagemAoContentScript() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const mensagem = {
      acao: "executarFuncao",
      valorAdicional: "Este é o valor adicional que será passado"
    };
    chrome.tabs.sendMessage(tabs[0].id, mensagem);
  });
}

// Adicione um ouvinte para o clique do botão da extensão
document.getElementById("bt_submit").addEventListener('click', async(event) => {
  event.preventDefault();
  enviarMensagemAoContentScript();
});