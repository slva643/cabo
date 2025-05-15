// Banco de dados embutido no código
const cableDatabase = {
    paineis: [
        {
            tag: "774-04",
            localizacao: "Sala de Máquinas Principal",
            descricao: "Painel de distribuição principal",
            cabos: [
                {
                    tag: "774-04-01",
                    origem: "QDG-01",
                    destino: "M-101",
                    secao: "2.5",
                    comprimento: "50"
                },
                {
                    tag: "774-04-02",
                    origem: "QDG-01",
                    destino: "M-102",
                    secao: "4",
                    comprimento: "45"
                }
            ]
        },
        {
            tag: "775-01",
            localizacao: "Área de Produção",
            descricao: "Painel secundário de produção",
            cabos: [
                {
                    tag: "775-01-01",
                    origem: "QDP-01",
                    destino: "B-201",
                    secao: "6",
                    comprimento: "30"
                }
            ]
        }
    ]
};

// Função para salvar os dados (simulada, pois agora os dados estão no código)
function saveDatabase() {
    // Em um sistema real, você poderia gerar um novo arquivo JS com os dados atualizados
    console.log("Dados atualizados (em um sistema real, gere um novo arquivo JS com estes dados):");
    console.log(JSON.stringify(cableDatabase, null, 2));
}

document.addEventListener('DOMContentLoaded', function() {
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

    // Controle de abas (mesmo código anterior)
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            button.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Pesquisa por TAG (mesmo código anterior, mas usando cableDatabase direto)
    searchBtn.addEventListener('click', pesquisarPorTag);
    tagInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') pesquisarPorTag();
    });

    function pesquisarPorTag() {
        const tag = tagInput.value.trim();
        if (!tag) {
            alert('Por favor, digite uma TAG para pesquisar.');
            return;
        }

        const painel = cableDatabase.paineis.find(p => p.tag === tag);
        
        if (painel) {
            document.getElementById('painel-tag').textContent = painel.tag;
            document.getElementById('painel-local').textContent = painel.localizacao;
            document.getElementById('painel-desc').textContent = painel.descricao || '-';
            
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

    // Adicionar campo de cabo no cadastro (mesmo código anterior)
    addCaboBtn.addEventListener('click', function() {
        const caboId = Date.now();
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
        
        caboDiv.querySelector('.remove-cabo').addEventListener('click', function() {
            cabosCadastro.removeChild(caboDiv);
        });
    });

    // Cadastro de novo painel e cabos (modificado para trabalhar com cableDatabase)
    cadastroForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const tag = document.getElementById('cad-tag').value.trim();
        const localizacao = document.getElementById('cad-local').value.trim();
        const descricao = document.getElementById('cad-desc').value.trim();
        
        if (!tag || !localizacao) {
            alert('Preencha pelo menos a TAG e Localização do painel.');
            return;
        }
        
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
        
        const painelIndex = cableDatabase.paineis.findIndex(p => p.tag === tag);
        
        if (painelIndex >= 0) {
            // Atualiza painel existente
            cableDatabase.paineis[painelIndex] = {
                tag,
                localizacao,
                descricao,
                cabos
            };
        } else {
            // Adiciona novo painel
            cableDatabase.paineis.push({
                tag,
                localizacao,
                descricao,
                cabos
            });
        }
        
        // Chama a função para "salvar" (na prática, você precisaria gerar um novo arquivo)
        saveDatabase();
        
        // Limpa o formulário
        cadastroForm.reset();
        cabosCadastro.innerHTML = '';
        
        // Exibe mensagem de sucesso
        alert('Painel e cabos cadastrados com sucesso!\n\nObservação: Para persistir as alterações permanentemente, você precisa atualizar o arquivo script.js com os novos dados.');
        
        // Volta para a aba de pesquisa
        document.querySelector('.tab-button[data-tab="pesquisa"]').click();
    });

    // Exportar dados (mostra o JSON completo)
    exportBtn.addEventListener('click', function() {
        exportData.value = JSON.stringify(cableDatabase, null, 2);
    });

    // Importar dados (modificado para trabalhar com cableDatabase)
    importBtn.addEventListener('click', function() {
        try {
            const importedData = JSON.parse(importData.value);
            if (importedData && importedData.paineis) {
                // Substitui os dados atuais
                cableDatabase.paineis = importedData.paineis;
                
                alert('Dados importados com sucesso!\n\nObservação: Para persistir as alterações permanentemente, você precisa atualizar o arquivo script.js com estes dados.');
                
                // Atualiza a exportação para mostrar os novos dados
                exportData.value = JSON.stringify(cableDatabase, null, 2);
            } else {
                alert('Formato de dados inválido.');
            }
        } catch (e) {
            alert('Erro ao importar dados: ' + e.message);
        }
    });
});