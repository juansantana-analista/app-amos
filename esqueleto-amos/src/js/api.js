const API_URL = "https://escritorio.g3pay.com.br/rest.php";
const AUTH_TOKEN = "Basic 50119e057567b086d83fe5dd18336042ff2cf7bef3c24807bc55e34dbe5a";

/**
 * Faz uma requisição à API com os parâmetros fornecidos.
 * @param {string} className - Nome da classe na API.
 * @param {string} method - Método a ser chamado na API.
 * @param {Object} params - Parâmetros adicionais (opcional).
 * @returns {Promise<Object>} - Retorna os dados da API ou um erro.
 */

console.log('teste1');
async function apiRequest(className, method, params = {}) {
    const requestBody = {
        class: className,
        method: method,
        ...params
    };

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": AUTH_TOKEN
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`Erro na API: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Erro ao fazer requisição:", error);
        return { error: error.message };
    }
}
