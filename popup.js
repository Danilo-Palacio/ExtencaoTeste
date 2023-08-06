// Baixar Relatório

let btnBaixarRelatorio = document.getElementById("baixarRelat")

btnBaixarRelatorio.addEventListener('click', function() {
    let start= document.getElementById("start");
    let end = document.getElementById("end");
    let startFormatado = alterarFormatoData(start.value)
    let endFormatado = alterarFormatoData(end.value)
  
    let link = `https://ctn.sistematodos.com.br/paginas/filiado/relatorio/FiliacaoPorVendedor.aspx?dataInicio=${startFormatado}&dataFim=${endFormatado}`;
  

    chrome.runtime.sendMessage({
        action: 'openNewPage',
        url: 'https://www.example.com' // Substitua pela URL desejada
        
      });


    alert(link)
  });
  // Altera o formato da data
    function alterarFormatoData(data) {
      var valor = data;
    
      if (valor) {
        var data = new Date(valor);
        var dia = data.getDate();
        var mes = data.getMonth() + 1; // Adiciona +1, pois os meses em JavaScript são baseados em zero (janeiro é 0)
        var ano = data.getFullYear();
  
        if (mes < 10) {
          mes = "0" + mes;
        }
    
        var dataFormatada = dia + "/" + mes + "/" + ano;
        return dataFormatada
      }
    }

   