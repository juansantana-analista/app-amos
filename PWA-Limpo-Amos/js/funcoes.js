// Início função validar login
async function validarToken(userAuthToken) {
    if (userAuthToken) {
        const apiServerUrl = 'https://amos.tecskill.com.br/rest.php';

        const headers = {
            "Content-Type": "application/json",
            "Authorization": 'Bearer ' + userAuthToken,
        };

        const body = JSON.stringify({
            class: "ProdutoCategoriaRest",
            method: "loadAll",
            limit: "1"
        });

        const options = {
            method: "POST",
            headers: headers,
            body: body,
        };

        try {
            const response = await fetch(apiServerUrl, options);
            const data = await response.json();
            if (data.status == 'success') {
                // Token válido, continua na página atual
                return true;
            } else {
                // Token inválido, redireciona para a página de login
                return false;
            }
        } catch (error) {
            console.error('Erro ao verificar token:', error);
            return false;
        }
    } else {
        // Token não existe, redireciona para a página de login
        return false;
    }
}
// Função para verificar se o token JWT expirou



async function getClientes() {
    const url = 'https://amos.tecskill.com.br/rest.php';
    const restKey = '50119e057567b086d83fe5dd18336042ff2cf7bef3c24807bc55e34dbe5a';

    const body = {
        class: 'PessoaRest',
        method: 'getClientes'
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + restKey
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error('Erro na requisição: ' + response.status);
        }

        const result = await response.json();
        console.log('Resposta da API:', result);

        const pessoas = result.data?.data || [];

        // Atualizar contador de clientes
        const contador = document.getElementById('clientes-contador');
        const gridContainer = document.querySelector('.grid');
        gridContainer.innerHTML = ''; // limpa antes de adicionar novos

        if (pessoas.length === 0) {
            // Sem clientes encontrados
            if (contador) {
                contador.textContent = 'Nenhum cliente encontrado';
            }

            const noData = document.createElement('div');
            noData.style.padding = '20px';
            noData.style.color = '#777';
            noData.style.fontSize = '14px';
            noData.textContent = 'Nenhum cliente encontrado no momento.';
            gridContainer.appendChild(noData);
            return;
        }

        // Atualiza contador com quantidade
        if (contador) {
            contador.textContent = pessoas.length === 1
                ? '1 cliente encontrado'
                : `${pessoas.length} clientes encontrados`;
        }

        // Renderizar os cards
        pessoas.forEach((pessoa, index) => {
            const nome = pessoa.nome || 'Nome não informado';
            const documento = pessoa.documento || 'Documento não informado';
            const fone = pessoa.fone || 'Telefone não informado';
            const efetivo = pessoa.efetivo === 'S' ? 'Cliente ativo' : 'Inativo';

            const clientCard = document.createElement('div');
            clientCard.classList.add('client-card');
            clientCard.id = `client-${index + 1}`;

            clientCard.innerHTML = `
                <div class="client-image">
                    <div class="client-avatar">
                        <i class="mdi mdi-account"></i>
                    </div>
                </div>
                <div class="client-details">
                    <div class="client-type">Pessoa</div>
                    <div class="client-name">${nome}</div>
                    <div class="client-status">${efetivo}</div>
                    <div class="client-actions">
                        <button class="button button-fill sheet-open" data-sheet=".perfil-sheet">
                            Perfil
                        </button>
                        <button class="button button-tonal sheet-open" data-sheet=".fazendas-sheet">
                            Fazendas
                        </button>
                    </div>
                </div>
            `;

            gridContainer.appendChild(clientCard);
        });

    } catch (error) {
        console.error('Erro:', error);
    }
}


