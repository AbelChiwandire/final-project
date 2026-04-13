import { loadHeaderFooter } from "./modules/utils.mjs";
import PortfolioManager from "./modules/PortfolioManager.mjs";
import { renderStockNews } from "./UI/renderNews.mjs";
import { renderStockProfile } from "./UI/renderStockProfile.mjs";
import { renderStockMetrics } from "./UI/renderStockMetrics.mjs";
import { User } from "./modules/auth.mjs";

function getSymbolFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("symbol");
}

(async () => {
  await loadHeaderFooter();

  const userId = User.getCurrentUserId();
  const portfolioManager = new PortfolioManager(userId);

  let stockDetails = null;

  const symbol = getSymbolFromURL();

  if (!symbol) {
    console.error("No symbol provided in URL");
    return;
  }

  try {
    stockDetails = await portfolioManager.getStockDetails(symbol);
    console.log("Stock Details:", stockDetails);
  } catch (err) {
    console.error("Error fetching stock details:", err);
  }

  const profileContainerEl = document.getElementById("stock-profile-container");
  const metricsContainerEl = document.getElementById("stock-metrics");
  const newsContainerEl = document.getElementById("stock-news-container");

  renderStockProfile(stockDetails, profileContainerEl);
  renderStockMetrics(stockDetails, metricsContainerEl);
  renderStockNews(stockDetails.news, newsContainerEl);
})();