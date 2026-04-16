import { formatNumber, formatPrice, formatPercent, getToneClass, displayValue } from "../modules/utils.mjs";

export function renderPortfolio(portfolioData, container) {
  const containerEl =
    typeof container === "string"
      ? document.querySelector(container)
      : container;
  if (!containerEl) return;

  console.log("Rendering portfolio with data:", portfolioData);

  const cardsHTML = portfolioData
    .map((item) => {
      const price = formatPrice(item.currentPrice, { allowZero: false });
      const quantity = formatNumber(item.quantity);
      const averageCost = formatPrice(item.avgCost);
      const marketValue = formatPrice(item.marketValue);
      const costBasis = formatPrice(item.costBasis);
      const high = formatPrice(item.highPrice, { allowZero: false });
      const low = formatPrice(item.lowPrice, { allowZero: false });
      const open = formatPrice(item.openPrice, { allowZero: false });
      const prevClose = formatPrice(item.previousClose, { allowZero: false });
      const percentageChange = formatPercent(item.percentageChange);
      const change = formatPrice(item.change);
      const changeTone = getToneClass("Change", item.change);
      const percentTone = getToneClass("percentageChange", item.percentageChange);
      const dayRange = prevClose !== "—" && high !== "—" ? `${prevClose} - ${high}` : "—";
      const symbol = displayValue(item.symbol);
      const companyName = displayValue(item.companyName);

      return `
        <div class="portfolio-card cursor" data-symbol="${symbol}">
          
          <div class="card-inner">

            <!-- FRONT FACE -->
            <div class="card-face card-front">

              <div class="card-content">

                <div class="flex-between">
                  <div class="flex-col-gap">
                    <div class="flex items-center gap-sm">
                      <span class="stock-symbol">${symbol}</span>
                      <div class="stock-percent-change ${percentTone} text-small">${percentageChange}</div>
                    </div>
                    <span class="stock-name">${companyName}</span>
                  </div>

                  <div class="flex-col items-end">
                    <div class="stock-price">${price}</div>
                    <span class="stock-change text-small ${changeTone}">${change}</span>
                  </div>
                </div>

                <div class="flex-between summary-metrics-row">
                  <div class="summary-metric">
                    <p>Shares</p>
                    <span class="stock-quantity">${quantity}</span>
                  </div>

                  <div class="summary-metric">
                    <p>Average Cost</p>
                    <span class="stock-average-cost">${averageCost}</span>
                  </div>
                </div>

                <div class="flex-between summary-metrics-row">
                  <div class="summary-metric">
                    <p>Market Value</p>
                    <span class="stock-market-value">${marketValue}</span>
                  </div>

                  <div class="summary-metric">
                    <p>Cost Basis</p>
                    <span class="stock-cost-basis">${costBasis}</span>
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
                    <span>${high}</span>
                  </div>

                  <div class="back-metric">
                    <p>Low</p>
                    <span>${low}</span>
                  </div>

                  <div class="back-metric">
                    <p>Open</p>
                    <span>${open}</span>
                  </div>

                  <div class="back-metric">
                    <p>Prev Close</p>
                    <span>${prevClose}</span>
                  </div>

                  <div class="back-metric">
                    <p>Day Range</p>
                    <span>${dayRange}</span>
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
