import { formatNumber } from "../modules/utils.mjs";

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

      return `
        <div class="portfolio-card" data-symbol="${item.symbol}">
          
          <div class="card-inner">

            <!-- FRONT FACE -->
            <div class="card-face card-front">

              <div class="card-content">

                <div class="flex-between">
                  <div class="flex-col-gap">
                    <span class="stock-symbol">${item.symbol}</span>
                    <span class="stock-name">${item.companyName}</span>
                  </div>

                  <div class="stock-price">${price}</div>
                </div>

                <div class="flex-between summary-metrics-row">
                  <div class="summary-metric">
                    <p>Shares</p>
                    <span class="stock-quantity">${item.quantity}</span>
                  </div>

                  <div class="summary-metric">
                    <p>Average Cost</p>
                    <span class="stock-average-cost">${item.averageCost}</span>
                  </div>
                </div>

                <div class="flex-between summary-metrics-row">
                  <div class="summary-metric">
                    <p>Market Value</p>
                    <span class="stock-market-value">${item.marketValue}</span>
                  </div>

                  <div class="summary-metric">
                    <p>Cost Basis</p>
                    <span class="stock-cost-basis">${item.costBasis}</span>
                  </div>
                </div>

              </div>

            </div>

            <!-- BACK FACE -->
            <div class="card-face card-back">

              <div class="card-content">

                <div class="back-metrics">

                  <div class="back-metric">
                    <p>High</p>
                    <span>${item.high}</span>
                  </div>

                  <div class="back-metric">
                    <p>Low</p>
                    <span>${item.low}</span>
                  </div>

                  <div class="back-metric">
                    <p>Open</p>
                    <span>${item.open}</span>
                  </div>

                  <div class="back-metric">
                    <p>Prev Close</p>
                    <span>${item.prevClose}</span>
                  </div>

                  <div class="back-metric">
                    <p>Day Range</p>
                    <span>${item.prevClose} - ${item.high}</span>
                  </div>
                </div>

              </div>

            </div>

          </div>

          <!-- ACTIONS (intentionally outside flip system) -->
          <div class="card-actions">
            <button class="action-btn" data-action="flip">Flip</button>
            <button class="action-btn" data-action="edit">Edit</button>
            <button class="action-btn" data-action="delete">Delete</button>
          </div>

        </div>
      `;
    })
    .join("");

  containerEl.innerHTML = cardsHTML;
}
