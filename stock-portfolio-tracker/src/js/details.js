import {
  loadHeaderFooter,
  setRotatingClass,
  removeRotatingClass,
} from "./modules/utils.mjs";
import PortfolioManager from "./modules/PortfolioManager.mjs";
import { renderStockDetailsHeader } from "./UI/renderStockDetailsHeader.mjs";
import {
  renderStockDetails,
  startAutoRefresh,
} from "./UI/renderStockDetails.mjs";
import { User } from "./modules/auth.mjs";
import { getUserTheme } from "./modules/themeStorage.mjs";

// -----------------------------
// Setup
// -----------------------------
const userId = User.getCurrentUserId();
const portfolioManager = new PortfolioManager(userId);

// Theme
if (userId) {
  const theme = getUserTheme(userId);
  document.documentElement.classList.toggle("dark", theme === "dark");
} else {
  document.documentElement.classList.remove("dark");
}

// Symbol
function getSymbolFromURL() {
  return new URLSearchParams(window.location.search).get("symbol");
}

const symbol = getSymbolFromURL();

renderStockDetailsHeader(symbol, "details-header-root", portfolioManager);
const containers = {
  profileContainerEl: document.getElementById("stock-profile-container"),
  metricsContainerEl: document.getElementById("stock-metrics"),
  analyticsContainerEl: document.getElementById("stock-analytics"),
  newsContainerEl: document.getElementById("stock-news-container"),
};

const btn = document.querySelector("#refresh-btn svg");
if (btn) {
  btn.addEventListener("click", async () => {
    if (portfolioManager.getRefreshState()) return;

    setRotatingClass(btn);

    try {
      // Show loading state with skeletons
      renderStockDetails(null, containers, true);

      await portfolioManager.loadPortfolio(true);
      const stockDetails = await portfolioManager.getStockDetails(symbol, true);
      renderStockDetails(stockDetails, containers);
    } finally {
      removeRotatingClass(btn);
    }
  });
}

// -----------------------------
// Main
// -----------------------------
(async () => {
  await loadHeaderFooter();

  try {
    // INITIAL LOAD
    setRotatingClass(btn);

    // Show loading state with skeletons
    renderStockDetails(null, containers, true);

    const stockDetails = await portfolioManager.getStockDetails(symbol);

    renderStockDetails(stockDetails, containers);
    removeRotatingClass(btn);
    // AUTO REFRESH
    startAutoRefresh({
      portfolioManager,
      symbol,
      containers,
      onRefreshStart: setRotatingClass,
      onRefreshEnd: removeRotatingClass,
      interval: 60000,
    });
  } catch (err) {
    portfolioManager.isRefreshing = false;
    console.error("Error loading stock details:", err);
  }
})();
