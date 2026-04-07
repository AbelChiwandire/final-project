import { loadHeaderFooter } from "./modules/utils.mjs";
import { setUserPortfolio } from "./modules/portfolioStorage.mjs";
import PortfolioManager from "./modules/PortfolioManager.mjs";
import { renderPortfolio } from "./UI/renderPortfolio.js";
import { renderSummary } from "./UI/renderSummary.js";
import { openAddStockModal } from "./modules/features.mjs";

const portfolioManager = new PortfolioManager("test-user");

const userId = "test-user";

const mockPortfolio = [
  { symbol: "AAPL", quantity: 10, avgPrice: 175 },
  { symbol: "TSLA", quantity: 5, avgPrice: 820 },
  { symbol: "MSFT", quantity: 8, avgPrice: 310 },
];

setUserPortfolio(userId, mockPortfolio);

async function initUI() {
  try {
    const portfolioData = await portfolioManager.loadPortfolio();

    renderPortfolio(portfolioData, "#portfolio-container");

    const summaryData = portfolioManager.getPortfolioSummary();
    renderSummary(summaryData, "#portfolio-summary");
  } catch (err) {
    console.error("Error loading portfolio:", err);
  }
}

async function main() {
  try {
    await loadHeaderFooter();

    const addStockBtn = document.getElementById("add-stock-btn");
    if (addStockBtn) {
      addStockBtn.addEventListener("click", openAddStockModal);
    } else {
      console.warn("Add stock button not found after header load.");
    }

    await initUI();
  } catch (err) {
    console.error("Error initializing app:", err);
  }
}

main();
