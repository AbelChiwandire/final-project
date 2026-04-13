import { loadHeaderFooter } from "./modules/utils.mjs";
import PortfolioManager from "./modules/PortfolioManager.mjs";
import { User } from "./modules/auth.mjs";
import { setPortfolioManager } from "./modules/features.mjs";

import initDashboardController from "./Controller/dashboardController.mjs";
import initHeaderController from "./Controller/headerController.mjs";

import { renderApp } from "./UI/renderApp.mjs";

(async function initApp() {
  try {
    await loadHeaderFooter();

    const currentUser = User.getCurrentUserId();
    const portfolioManager = new PortfolioManager(currentUser);
    setPortfolioManager(portfolioManager);

    // controllers remain unchanged
    initHeaderController(portfolioManager);
    initDashboardController("#portfolio-container", portfolioManager);

    await portfolioManager.loadPortfolio();

    // INITIAL RENDER
    renderApp(portfolioManager);

    // CENTRAL UPDATE LOOP
    document.addEventListener("portfolioUpdated", async () => {
      renderApp(portfolioManager);
    });

  } catch (err) {
    console.error("Error initializing app:", err);
  }
})();