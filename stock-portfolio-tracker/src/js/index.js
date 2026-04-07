import { loadHeaderFooter } from "./modules/utils.mjs";
import PortfolioManager from "./modules/PortfolioManager.mjs";
import { renderPortfolio } from "./UI/renderPortfolio.js";
import { renderSummary } from "./UI/renderSummary.js";
import { openAddStockModal, openAuthModal } from "./modules/features.mjs";
import { User } from "./modules/auth.mjs";

// --- Initialize PortfolioManager with current user ---
const currentUser = User.getCurrent();
const portfolioManager = new PortfolioManager(currentUser?.id || null);

async function initApp() {
  try {
    await loadHeaderFooter();

    const addStockBtn = document.getElementById("add-stock-btn");
    if (addStockBtn) {
      addStockBtn.addEventListener("click", openAddStockModal);
    } else {
      console.warn("Add stock button not found after header load.");
    }

    // Small delay to let UI settle
    setTimeout(async () => {
      const authDismissed = sessionStorage.getItem("authDismissed") === "true";

      if (!User.getCurrent() && !authDismissed) {
        // No user logged in: show sign-in modal
        openAuthModal();
      } else {
        // User already logged in: load and render portfolio/dashboard
        await portfolioManager.loadPortfolio();
        renderPortfolio(portfolioManager.getPortfolio(), "#portfolio-container");
        renderSummary(portfolioManager.getPortfolioSummary(), "#portfolio-summary");
      }
    }, 300);
  } catch (err) {
    console.error("Error initializing app:", err);
  }
}

initApp();

