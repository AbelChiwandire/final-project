import { loadHeaderFooter } from "./modules/utils.mjs";
import PortfolioManager from "./modules/PortfolioManager.mjs";
import { renderStockNews } from "./UI/renderNews.mjs";
import { renderStockProfile } from "./UI/renderStockProfile.mjs";
import { renderStockMetrics } from "./UI/renderStockMetrics.mjs";
import { renderStockDetailsHeader } from "./UI/renderStockDetailsHeader.mjs";
import { renderAnalytics } from "./UI/renderAnalytics.mjs";
import { User } from "./modules/auth.mjs";
import { getUserTheme } from "./modules/themeStorage.mjs";


// -----------------------------
// Theme handling
// -----------------------------
const userId = User.getCurrentUserId();
const portfolioManager = new PortfolioManager(userId);

if (userId) {
  const theme = getUserTheme(userId);
  document.documentElement.classList.toggle("dark", theme === "dark");
} else {
  document.documentElement.classList.remove("dark");
}

function getSymbolFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("symbol");
}

const symbol = getSymbolFromURL();

renderStockDetailsHeader(symbol, "details-header-root", portfolioManager);

(async () => {
  await loadHeaderFooter();

  let stockDetails = null;

  try {
    stockDetails = await portfolioManager.getStockDetails(symbol);
    console.log("Stock Details:", stockDetails);
  } catch (err) {
    console.error("Error fetching stock details:", err);
  }

  const profileContainerEl = document.getElementById("stock-profile-container");
  const metricsContainerEl = document.getElementById("stock-metrics");
  const analyticsContainerEl = document.getElementById("stock-analytics");
  const newsContainerEl = document.getElementById("stock-news-container");

  renderStockProfile(portfolioManager.getAAPL(), profileContainerEl);
  renderStockMetrics(portfolioManager.getAAPL(), metricsContainerEl);
  renderAnalytics(portfolioManager.getAAPL(), analyticsContainerEl);
  renderStockNews(portfolioManager.getAAPL().news, newsContainerEl);
})();