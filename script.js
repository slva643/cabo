document.addEventListener('DOMContentLoaded', function() {
    // Inicializa o banco de dados
    let database = JSON.parse(localStorage.getItem('cableDatabase')) || {
        paineis: []
    };

    // Elementos da interface
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    const searchBtn = document.getElementById('search-btn');
    const tagInput = document.getElementById('tag-input');
    const resultsContainer = document.getElementById('results');
    const addCaboBtn = document.getElementById('add-cabo-btn');
    const cabosCadastro = document.getElementById('cabos-cadastro');
    const cadastroForm = document.getElementById('cadastro-form');
    const exportBtn = document.getElementById('export-btn');
    const exportData = document.getElementById('export-data');
    const importBtn = document.getElementById('import-btn');
    const importData = document.getElementById('import-data');

    // Controle de abas
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            
            // Remove classe active de todos os botões e conteúdos
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Adiciona classe active ao botão e conteúdo selecionado
            button.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Pesquisa por TAG
    searchBtn.addEventListener('click', pesquisarPorTag);
    tagInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            pesquisarPorTag();
        }
    });

    function pesquisarPorTag() {
        const tag = tagInput.value.trim();
        if (!tag) {
            alert('Por favor, digite uma TAG para pesquisar.');
            return;
        }

        const painel = database.paineis.find(p => p.tag === tag);
        
        if (painel) {
            // Exibe informações do painel
            document.getElementById('painel-tag').textContent = painel.tag;
            document.getElementById('painel-local').textContent = painel.localizacao;
            document.getElementById('painel-desc').textContent = painel.descricao || '-';
            
            // Preenche tabela de cabos
            const tbody = document.querySelector('#cabos-table tbody');
            tbody.innerHTML = '';
            
            if (painel.cabos && painel.cabos.length > 0) {
                painel.cabos.forEach(cabo => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${cabo.tag}</td>
                        <td>${cabo.origem}</td>
                        <td>${cabo.destino}</td>
                        <td>${cabo.secao}</td>
                        <td>${cabo.comprimento}</td>
                    `;
                    tbody.appendChild(row);
                });
            } else {
                const row = document.createElement('tr');
                row.innerHTML = '<td colspan="5">Nenhum cabo cadastrado neste painel</td>';
                tbody.appendChild(row);
            }
            
            resultsContainer.style.display = 'block';
        } else {
            alert('Painel não encontrado com a TAG informada.');
            resultsContainer.style.display = 'none';
        }
    }

    // Adicionar campo de cabo no cadastro
    addCaboBtn.addEventListener('click', function() {
        const caboId = Date.now(); // ID único para o cabo
        const caboDiv = document.createElement('div');
        caboDiv.className = 'cabo-item';
        caboDiv.innerHTML = `
            <button class="remove-cabo" data-id="${caboId}">×</button>
            <div class="form-group">
                <label for="cabo-tag-${caboId}">TAG do Cabo:</label>
                <input type="text" id="cabo-tag-${caboId}" required placeholder="Ex: 774-04-01">
            </div>
            <div class="form-group">
                <label for="cabo-origem-${caboId}">Origem:</label>
                <input type="text" id="cabo-origem-${caboId}" required placeholder="Ex: QDG-01">
            </div>
            <div class="form-group">
                <label for="cabo-destino-${caboId}">Destino:</label>
                <input type="text" id="cabo-destino-${caboId}" required placeholder="Ex: M-101">
            </div>
            <div class="form-group">
                <label for="cabo-secao-${caboId}">Seção (mm²):</label>
                <input type="text" id="cabo-secao-${caboId}" required placeholder="Ex: 2.5">
            </div>
            <div class="form-group">
                <label for="cabo-comprimento-${caboId}">Comprimento (m):</label>
                <input type="number" id="cabo-comprimento-${caboId}" required placeholder="Ex: 50">
            </div>
        `;
        cabosCadastro.appendChild(caboDiv);
        
        // Adiciona evento para remover o cabo
        caboDiv.querySelector('.remove-cabo').addEventListener('click', function() {
            cabosCadastro.removeChild(caboDiv);
        });
    });

    // Cadastro de novo painel e cabos
    cadastroForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const tag = document.getElementById('cad-tag').value.trim();
        const localizacao = document.getElementById('cad-local').value.trim();
        const descricao = document.getElementById('cad-desc').value.trim();
        
        if (!tag || !localizacao) {
            alert('Preencha pelo menos a TAG e Localização do painel.');
            return;
        }
        
        // Coleta dados dos cabos
        const cabos = [];
        const caboItems = cabosCadastro.querySelectorAll('.cabo-item');
        
        caboItems.forEach(item => {
            const id = item.querySelector('.remove-cabo').getAttribute('data-id');
            const tagCabo = document.getElementById(`cabo-tag-${id}`).value.trim();
            const origem = document.getElementById(`cabo-origem-${id}`).value.trim();
            const destino = document.getElementById(`cabo-destino-${id}`).value.trim();
            const secao = document.getElementById(`cabo-secao-${id}`).value.trim();
            const comprimento = document.getElementById(`cabo-comprimento-${id}`).value.trim();
            
            if (tagCabo && origem && destino && secao && comprimento) {
                cabos.push({
                    tag: tagCabo,
                    origem,
                    destino,
                    secao,
                    comprimento
                });
            }
        });
        
        // Verifica se já existe um painel com essa TAG
        const painelIndex = database.paineis.findIndex(p => p.tag === tag);
        
        if (painelIndex >= 0) {
            // Atualiza painel existente
            database.paineis[painelIndex] = {
                tag,
                localizacao,
                descricao,
                cabos
            };
        } else {
            // Adiciona novo painel
            database.paineis.push({
                tag,
                localizacao,
                descricao,
                cabos
            });
        }
        
        // Salva no localStorage
        localStorage.setItem('cableDatabase', JSON.stringify(database));
        
        // Limpa o formulário
        cadastroForm.reset();
        cabosCadastro.innerHTML = '';
        
        // Exibe mensagem de sucesso
        alert('Painel e cabos cadastrados com sucesso!');
        
        // Volta para a aba de pesquisa
        document.querySelector('.tab-button[data-tab="pesquisa"]').click();
    });

    // Exportar dados
    exportBtn.addEventListener('click', function() {
        exportData.value = JSON.stringify(database, null, 2);
    });

    // Importar dados
    importBtn.addEventListener('click', function() {
        try {
            const importedData = JSON.parse(importData.value);
            if (importedData && importedData.paineis) {
                database = importedData;
                localStorage.setItem('cableDatabase', JSON.stringify(database));
                alert('Dados importados com sucesso!');
            } else {
                alert('Formato de dados inválido.');
            }
        } catch (e) {
            alert('Erro ao importar dados: ' + e.message);
        }
    });
});