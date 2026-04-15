import { stockDetailsHeaderTemplate } from "./templates.mjs";

export function renderStockDetailsHeader(symbol, containerId, manager) { 
    const headerRoot = document.getElementById(containerId);

    headerRoot.innerHTML = stockDetailsHeaderTemplate(symbol)

    document.getElementById("back-to-portfolio")
    .addEventListener("click", () => {
        window.location.href = "../index.html";
    });

    document.getElementById("details-refresh-btn")
    .addEventListener("click", () => {
        // call your stock-details refresh function here
        manager.refreshPortfolio(symbol);
    });
}