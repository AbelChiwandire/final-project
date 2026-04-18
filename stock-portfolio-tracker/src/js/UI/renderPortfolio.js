import {
  formatNumber,
  formatPrice,
  formatPercent,
  getToneClass,
  displayValue,
} from "../modules/utils.mjs";

export function renderPortfolio(portfolioData, container) {
  const containerEl =
    typeof container === "string"
      ? document.querySelector(container)
      : container;
  if (!containerEl) return;

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
      const percentTone = getToneClass(
        "percentageChange",
        item.percentageChange,
      );
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
                    <span class="stock-change flex flex-end text-small ${changeTone}">${change}</span>
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

              <!-- ACTIONS now inside front face -->
              <div class="card-actions">
                <button class="action-btn" data-action="flip" aria-label="View stock details">
                  <svg fill="currentColor" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
                    width="800px" height="800px" viewBox="0 0 528.919 528.918"
                    xml:space="preserve">
                  <g>
                    <g>
                      <path d="M70.846,324.059c3.21,3.926,8.409,3.926,11.619,0l69.162-84.621c3.21-3.926,1.698-7.108-3.372-7.108h-36.723
                        c-5.07,0-8.516-4.061-7.427-9.012c18.883-85.995,95.625-150.564,187.207-150.564c105.708,0,191.706,85.999,191.706,191.706
                        c0,105.709-85.998,191.707-191.706,191.707c-12.674,0-22.95,10.275-22.95,22.949s10.276,22.949,22.95,22.949
                        c131.018,0,237.606-106.588,237.606-237.605c0-131.017-106.589-237.605-237.606-237.605
                        c-116.961,0-214.395,84.967-233.961,196.409c-0.878,4.994-5.52,9.067-10.59,9.067H5.057c-5.071,0-6.579,3.182-3.373,7.108
                        L70.846,324.059z"/>
                    </g>
                  </g>
                  </svg>
                  <span>Details</span>
                </button>
                <button class="action-btn" data-action="edit">
                <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 10L21 7L17 3L14 6M18 10L8 20H4V16L14 6M18 10L14 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>Edit</span>
                </button>
                <button class="action-btn" data-action="delete">
                <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 11V17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M14 11V17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M4 7H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M6 7H12H18V18C18 19.6569 16.6569 21 15 21H9C7.34315 21 6 19.6569 6 18V7Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>Delete</span>
                </button>
              </div>

            </div>

            <!-- BACK FACE -->
            <div class="card-face card-back">

              <div class="card-content">
              <div class="back-card-header flex-between">
                  <span>AAPL — Extra Info</span>
                  <div class="flip-back-icon">
                    <button class="action-btn flip-back-btn" data-action="flip" aria-label="Flip back to front">
                      <svg fill="currentColor" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
                        width="800px" height="800px" viewBox="0 0 528.919 528.918"
                        xml:space="preserve">
                      <g>
                        <g>
                          <path d="M70.846,324.059c3.21,3.926,8.409,3.926,11.619,0l69.162-84.621c3.21-3.926,1.698-7.108-3.372-7.108h-36.723
                            c-5.07,0-8.516-4.061-7.427-9.012c18.883-85.995,95.625-150.564,187.207-150.564c105.708,0,191.706,85.999,191.706,191.706
                            c0,105.709-85.998,191.707-191.706,191.707c-12.674,0-22.95,10.275-22.95,22.949s10.276,22.949,22.95,22.949
                            c131.018,0,237.606-106.588,237.606-237.605c0-131.017-106.589-237.605-237.606-237.605
                            c-116.961,0-214.395,84.967-233.961,196.409c-0.878,4.994-5.52,9.067-10.59,9.067H5.057c-5.071,0-6.579,3.182-3.373,7.108
                            L70.846,324.059z"/>
                        </g>
                      </g>
                      </svg>
                    </button>
                  </div>
                </div>

                <div class="back-metrics">

                  <div class="back-metric">
                    <p>Open</p>
                    <span>${open}</span>
                  </div>

                  <div class="back-metric">
                    <p>High</p>
                    <span>${high}</span>
                  </div>

                  <div class="back-metric">
                    <p>Low</p>
                    <span>${low}</span>
                  </div>

                  <div class="back-metric">
                    <p>Prev Close</p>
                    <span>${prevClose}</span>
                  </div>

                </div>

              </div>

              <div class="card-actions">
                <div class="click-details-text">
                  Click card to view full details
                </div>
              </div>

            </div>

          </div>

        </div>
      `;
    })
    .join("");

  containerEl.innerHTML = cardsHTML;
}
