document.addEventListener("DOMContentLoaded", async () => {

    const vendas = await apiRequest("ProdutoVariacaoRest", "loadAll");

    console.log(vendas);
});
