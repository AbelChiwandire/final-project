import { stockDetailsHeaderTemplate } from "./templates.mjs";

export function renderStockDetailsHeader(symbol, containerId, manager) {
  const headerRoot = document.getElementById(containerId);

  headerRoot.innerHTML = stockDetailsHeaderTemplate(symbol);

  document.getElementById("back-to-portfolio").addEventListener("click", () => {
    window.location.href = "../index.html";
  });
}
