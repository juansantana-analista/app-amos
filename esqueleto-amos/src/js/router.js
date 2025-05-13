const routes = {
    "/": { html: "home.html", css: "src/css/home.css" },
    "/vendas": { html: "vendas.html", css: "src/css/vendas.css" }
};

function navigate(event, path) {
    event.preventDefault();
    window.history.pushState({}, "", path);
    loadPage(path);
}

function loadPage(path) {
    const route = routes[path] || routes["/"];
    
    // Carregar o HTML
    fetch(route.html)
        .then(response => response.text())
        .then(html => {
            document.getElementById("app").innerHTML = html;
            loadCSS(route.css);
        })
        .catch(error => console.error("Erro ao carregar página:", error));
}

// Função para carregar o CSS dinâmico
function loadCSS(cssFile) {
    let link = document.getElementById("dynamic-css");
    
    if (!link) {
        link = document.createElement("link");
        link.id = "dynamic-css";
        link.rel = "stylesheet";
        document.head.appendChild(link);
    }
    
    link.href = cssFile;
}

// Captura o botão de voltar/avançar do navegador
window.onpopstate = () => loadPage(window.location.pathname);

// Carrega a página inicial correta
loadPage(window.location.pathname);
