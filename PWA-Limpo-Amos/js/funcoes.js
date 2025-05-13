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
