// Seleção dos elementos do DOM
const addBtn = document.getElementById('addBtn');
const transactionLog = document.getElementById('transactionLog');
const defaultTrans = document.getElementById('defaultTrans');
const saldo = document.getElementById('saldo');

// Variáveis para controle financeiro
let saldoValue = 0;
let totalReceita = 0;
let totalDespesa = 0;

// Exibe o saldo inicial formatado
saldo.innerHTML = `Saldo: ${saldoValue.toFixed(2)}R$`;

/**
 * Função para adicionar uma transação (receita ou despesa)
 * Atualiza saldo, totais e gráfico
 */
function addTransaction(valor, descricao, tipo){
    if(tipo === "income"){ // Receita
        saldoValue += valor;
        saldo.innerHTML = `Saldo: ${saldoValue.toFixed(2)}R$`;
        totalReceita += valor;
    }
    else{ // Despesa
        saldoValue -= valor;
        saldo.innerHTML = `Saldo: ${saldoValue.toFixed(2)}R$`;
        totalDespesa += valor;
    }
    
    // Atualiza os dados do gráfico
    pieChart.data.datasets[0].data = [totalReceita, totalDespesa];
    pieChart.update(); // Atualiza o gráfico
}

// Inicialização do gráfico de pizza usando Chart.js
const ctx = document.getElementById('grafico1');
const pieChart = new Chart(ctx, {
    type: 'pie',
    data: {
        labels: ['Receita','Despesa'],
        datasets: [{
            label: 'Transações',
            // ATENÇÃO: Ordem correta é [totalReceita, totalDespesa]
            data: [totalReceita, totalDespesa],
            backgroundColor: [
                'rgb(90, 219, 90)', // Receita
                'rgb(255, 99, 132)' // Despesa
            ],
            borderWidth: 1
        }]
    },
    options: {
        plugins: {
            legend: {
                display: true
            }
        }
    }
});

/**
 * Função para salvar os dados no localStorage sempre que adicionar uma transação
 */

function dataSave(){
    const data = {
        saldoValue,
        totalReceita,
        totalDespesa,
        transactions: Array.from(transactionLog.children).map(li => li.textContent)
    };
    localStorage.setItem('financeAppData', JSON.stringify(data));
}

/**
 * Função para carregar os dados do localStorage ao iniciar a aplicação
 */
function loadData() {
    const data = JSON.parse(localStorage.getItem('financeAppData'));
    if (data) {
        saldoValue = data.saldoValue;
        totalReceita = data.totalReceita;
        totalDespesa = data.totalDespesa;
        saldo.innerHTML = `Saldo: ${saldoValue.toFixed(2)}R$`;
        // Atualiza o gráfico
        pieChart.data.datasets[0].data = [totalReceita, totalDespesa];
        pieChart.update();
        // Carrega o log de transações
        transactionLog.innerHTML = '';
        data.transactions.forEach(text => {
            const li = document.createElement('li');
            li.textContent = text;
            li.style.color = text.includes('Receita') ? 'rgb(90, 219, 90)' : 'red';
            transactionLog.appendChild(li);
        });
        if (transactionLog.children.length > 0) {
            defaultTrans.style.display = 'none';
        }
    }
}
loadData();

// Evento de clique no botão de adicionar transação
addBtn.addEventListener('click', function() {
    // Captura os valores atuais dos inputs
    let valor = parseFloat(document.getElementById('valueInput').value) || 0;
    let descricao = document.getElementById('descriptionInput').value;
    let tipo = document.getElementById('selectInput').value;

    // Validação dos campos
    if (valor > 0 && descricao.trim() !== "") {
        addTransaction(valor, descricao, tipo);

        // Cria o log da transação na lista
        const li = document.createElement('li');
        li.textContent = `${descricao} - R$ ${valor.toFixed(2)} (${tipo === 'income' ? 'Receita' : 'Despesa'})`;
        li.style.color = tipo === 'income' ? 'rgb(90, 219, 90)' : 'red';
        transactionLog.appendChild(li);

        // Esconde a mensagem padrão se houver transações
        if (transactionLog.children.length > 0) {
            defaultTrans.style.display = 'none';
        }

        // Limpa os campos de input após adicionar
        document.getElementById('valueInput').value = '';
        document.getElementById('descriptionInput').value = '';
    }
    else{
        alert("Por favor, insira uma descrição e um valor válido maior que zero.");
    }

    // Altera a cor do saldo conforme positivo ou negativo
    if(saldoValue >= 0){
        saldo.style.color = "rgb(90, 219, 90)";
    }
    else{
        saldo.style.color = "red";
    }

    dataSave();
});



