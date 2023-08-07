// Listener para receber a mensagem de volta após o clique

let arquivoExtencao = document.getElementById('arquivoExtencao').value
let valorDoElemento = "não mudou";

chrome.runtime.onMessage.addListener(function (mensagem, sender, sendResponse) {
    console.log("Houve o onMessage")
    if (mensagem.acao === 'cliqueConcluido') {
      const valor = mensagem.valor;
      console.log('Valor do clique:', valor);
    }
  });
  
  // Função para criar e manipular a guia
  async function manipularGuia() {
    // Passo 1: Criar uma nova guia
    const guia = await chrome.tabs.create({ url: 'https://ctn.sistematodos.com.br/paginas/filiado/PosVenda.aspx', active: false, index:0 });
    console.log("criou a guia")
  
    await new Promise((resolve) => {
      console.log("Passo 2: Aguardar até que seja carregada")
      chrome.tabs.onUpdated.addListener(function onUpdated(tabId, changeInfo, tab) {
        console.log(`Passo 2: vai testar o if + ${tabId} igual ao ${guia.id} e ${changeInfo.status} igual a Complete`)
        if (tabId === guia.id && changeInfo.status === 'complete') {
        console.log("O if deu true, então o onUpdated foi feito")
          chrome.tabs.onUpdated.removeListener(onUpdated); // Remover o ouvinte após a guia ser carregada
          resolve();
        }
      });
    });
    

    chrome.scripting.executeScript(
        {
            target: { tabId: guia.id },
            func: () => {
                document.getElementById
                const arquivo = document.getElementById("Arquivos").value;
                if (arquivo) {
                    arquivo = arquivoExtencao;
                }
            },
        },
    );
  
    setTimeout(() => {
        console.log("Vai fazer o executeScript")

        chrome.scripting.executeScript(
            {
                target: { tabId: guia.id },
                func: () => {
                    const botao = document.getElementById('ContentPlaceHolder1_btnEnviarArquivo');
                    if (botao) {
                        botao.click();
                    }
                },
            },
        );
    }, 500);


    function executeScriptPromise(tabId, code) {
        return new Promise((resolve, reject) => {
          chrome.scripting.executeScript(
            {
              target: { tabId },
              func: code,
            },
            (result) => {
              if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
              } else {
                resolve(result);
              }
            }
          );
        });
      }



    setTimeout(async () => {
        console.log("Vai fazer o segundo executeScript");
    
        const code = () => {
          const elementoPai = document.querySelector('#ContentPlaceHolder1_MessageBoxPosVenda_MessageBoxInterface');
          const elementoFilho = elementoPai.querySelector('p');
          const valorDoElemento = elementoFilho.textContent;
          return valorDoElemento;
        };
    
        try {
          const result = await executeScriptPromise(guia.id, code);
          const valorDoElemento = result[0].result;
          if(valorDoElemento === null){
            console.log("erro: ",valorDoElemento)
          }else{
            console.log('Valor do elemento:', valorDoElemento);
            chrome.runtime.sendMessage({ acao: 'cliqueConcluido', valor: valorDoElemento });
          }
        } catch (error) {
          console.error('Erro ao executar o script:', error);
        }
    }, 3000);
    setTimeout(() => {
        console.log("A guia será fechada")
      chrome.tabs.remove(guia.id);
    }, 4000);
  }
  
 
  document.getElementById("bt_submit").addEventListener('click', async (event) => {
    event.preventDefault();
    manipularGuia();
    console.log("finalizou");
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