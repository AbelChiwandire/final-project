import { openAuthModal, openAddStockModal } from "../modules/features.mjs";
import { renderPortfolio } from "./renderPortfolio.js";
import { renderSummary } from "./renderSummary.js";
import { getFallbackTemplate } from "./templates.mjs";
import { getUserTheme } from "../modules/themeStorage.mjs";
import { showSkeleton, hideSkeleton, isSkeletonActive } from "../modules/skeleton.mjs";

function updateLastUpdated() {
  const el = document.getElementById("last-updated");
  if (el) {
    const now = new Date();
    const formatted = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    el.textContent = `Updated: ${formatted}`;
  }
}

export function renderApp(portfolioManager, isLoading = false) {
  const user = portfolioManager.userId;

  const fallbackRoot = document.getElementById("fallback-root");
  const containerEl = document.getElementById("portfolio-container");

  const portfolio = portfolioManager.getPortfolio();
  const summary = portfolioManager.getPortfolioSummary();

  // Debug logging to understand state
  console.log('renderApp called:', { user, portfolioLength: portfolio?.length, portfolio, isLoading });

  // -----------------------------
  // Theme handling
  // -----------------------------
  if (user) {
    const theme = getUserTheme(user);
    document.documentElement.classList.toggle("dark", theme === "dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  // -----------------------------
  // Handle loading states
  // -----------------------------
  if (isLoading) {
    // Show 4 skeleton cards for summary
    const summaryEl = document.querySelector("#portfolio-summary");
    if (summaryEl) {
      summaryEl.innerHTML = Array(4).fill('').map(() => `
        <div class="card-content metric-card shimmer-item">
          <div class="metric-label skeleton-text skeleton-text--small"></div>
          <div class="metric-value skeleton-text skeleton-text--large"></div>
        </div>
      `).join('');
    }

    // Show 6 skeleton cards for portfolio (2 rows of 3)
    const portfolioEl = document.querySelector("#portfolio-container");
    if (user && (!portfolio || portfolio.length === 0) && portfolioEl) {
      portfolioEl.innerHTML = Array(6).fill('').map(() => `
        <div class="portfolio-card cursor shimmer-item">
          <div class="card-inner">
            <!-- FRONT FACE -->
            <div class="card-face card-front">
              <div class="card-content">
                <div class="flex-between">
                  <div class="flex-col-gap">
                    <div class="flex items-center gap-sm">
                      <span class="stock-symbol skeleton-text skeleton-text--medium"></span>
                      <div class="stock-percent-change skeleton-text skeleton-text--small"></div>
                    </div>
                    <span class="stock-name skeleton-text skeleton-text--small"></span>
                  </div>
                  <div class="flex-col items-end">
                    <div class="stock-price skeleton-text skeleton-text--large"></div>
                    <span class="stock-change skeleton-text skeleton-text--small"></span>
                  </div>
                </div>

                <div class="flex-between summary-metrics-row">
                  <div class="summary-metric">
                    <p class="skeleton-text skeleton-text--small"></p>
                    <span class="skeleton-text skeleton-text--medium"></span>
                  </div>
                  <div class="summary-metric">
                    <p class="skeleton-text skeleton-text--small"></p>
                    <span class="skeleton-text skeleton-text--medium"></span>
                  </div>
                </div>

                <div class="flex-between summary-metrics-row">
                  <div class="summary-metric">
                    <p class="skeleton-text skeleton-text--small"></p>
                    <span class="skeleton-text skeleton-text--medium"></span>
                  </div>
                  <div class="summary-metric">
                    <p class="skeleton-text skeleton-text--small"></p>
                    <span class="skeleton-text skeleton-text--medium"></span>
                  </div>
                </div>
              </div>
            </div>

            <!-- BACK FACE -->
            <div class="card-face card-back">
              <div class="card-content">
                <div class="back-metrics">
                  <div class="back-metric">
                    <p class="skeleton-text skeleton-text--small"></p>
                    <span class="skeleton-text skeleton-text--medium"></span>
                  </div>
                  <div class="back-metric">
                    <p class="skeleton-text skeleton-text--small"></p>
                    <span class="skeleton-text skeleton-text--medium"></span>
                  </div>
                  <div class="back-metric">
                    <p class="skeleton-text skeleton-text--small"></p>
                    <span class="skeleton-text skeleton-text--medium"></span>
                  </div>
                  <div class="back-metric">
                    <p class="skeleton-text skeleton-text--small"></p>
                    <span class="skeleton-text skeleton-text--medium"></span>
                  </div>
                  <div class="back-metric">
                    <p class="skeleton-text skeleton-text--small"></p>
                    <span class="skeleton-text skeleton-text--medium"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ACTIONS -->
          <div class="card-actions">
            <button class="action-btn shimmer-item">
              <div class="skeleton-avatar" style="width: 16px; height: 16px;"></div>
              <span class="skeleton-text skeleton-text--small"></span>
            </button>
            <button class="action-btn shimmer-item">
              <div class="skeleton-avatar" style="width: 16px; height: 16px;"></div>
              <span class="skeleton-text skeleton-text--small"></span>
            </button>
            <button class="action-btn shimmer-item">
              <div class="skeleton-avatar" style="width: 16px; height: 16px;"></div>
              <span class="skeleton-text skeleton-text--small"></span>
            </button>
          </div>
        </div>
      `).join('');
    }

    // Don't render the rest of the UI while loading
    return;
  }

  // Hide skeletons when loading is complete
  if (isSkeletonActive("#portfolio-summary")) {
    hideSkeleton("#portfolio-summary");
  }
  if (isSkeletonActive("#portfolio-container")) {
    hideSkeleton("#portfolio-container");
  }

  // -----------------------------
  // Always render summary
  // -----------------------------
  renderSummary(summary, "#portfolio-summary");

  // -----------------------------
  // Decide UI state
  // -----------------------------
  let stateType;

  if (!user) {
    stateType = "signin";
  } else if (!portfolio || portfolio.length === 0) {
    stateType = "empty";
  } else {
    stateType = "portfolio";
  }

  // -----------------------------
  // Render fallback
  // -----------------------------
  const renderFallback = (state) => {
    containerEl.innerHTML = "";
    containerEl.classList.add("hidden");

    fallbackRoot.classList.remove("hidden");
    fallbackRoot.innerHTML = getFallbackTemplate(state);

    if (state === "signin") {
      const btn = document.getElementById("fallback-signin-btn");
      if (btn) btn.addEventListener("click", openAuthModal);
      return;
    }

    const btn = document.getElementById("fallback-add-btn");
    if (btn) btn.addEventListener("click", () => openAddStockModal(null));
  };

  // -----------------------------
  // Render portfolio
  // -----------------------------
  const renderPortfolioState = () => {
    fallbackRoot.innerHTML = "";
    fallbackRoot.classList.add("hidden");

    containerEl.classList.remove("hidden");

    renderPortfolio(portfolio, "#portfolio-container");
  };

  // -----------------------------
  // Execute render
  // -----------------------------
  switch (stateType) {
    case "signin":
      renderFallback("signin");
      break;

    case "empty":
      renderFallback("empty");
      break;

    case "portfolio":
      renderPortfolioState();
      break;
  }

  updateLastUpdated();
}
