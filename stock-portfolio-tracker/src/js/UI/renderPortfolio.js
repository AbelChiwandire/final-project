import { getToneClass, formatNumber } from "../modules/utils.mjs";

export function renderPortfolio(portfolioData, container) {
  const containerEl =
    typeof container === "string"
      ? document.querySelector(container)
      : container;
  if (!containerEl) return;

  console.log("Rendering portfolio with data:", portfolioData);

  const cardsHTML = portfolioData
    .map((item) => {
      const price = formatNumber(item.currentPrice);
      const plTone = getToneClass("Return %", item.percentageChange);
      const pl = formatNumber(item.percentageChange);

      return `
        <div class="portfolio-card" data-symbol="${item.symbol}">
          
          <div class="card-content">
            <div class="stock-symbol">${item.symbol}</div>
            <div class="stock-quantity">${item.quantity}</div>
            <div class="stock-price">${price}</div>
            <div class="stock-pl ${plTone}">${pl}%</div>
          </div>

          <div class="card-actions">
            <button data-action="flip">Flip</button>
            <button data-action="edit">Edit</button>
            <button data-action="delete">Delete</button>
          </div>

        </div>
      `;
    })
    .join("");

  containerEl.innerHTML = cardsHTML;
}
