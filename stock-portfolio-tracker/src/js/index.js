import {
  loadHeaderFooter,
  setRotatingClass,
  removeRotatingClass,
} from "./modules/utils.mjs";
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

    initHeaderController(portfolioManager);
    initDashboardController("#portfolio-container", portfolioManager);

    //  REFRESH BUTTON
    const refreshBtn = document.querySelector("#refresh-btn svg");

    // INITIAL LOAD (only once)
    setRotatingClass(refreshBtn);
    await portfolioManager.loadPortfolio();

    renderApp(portfolioManager);
    removeRotatingClass(refreshBtn);

    document.addEventListener("portfolioUpdated", () => {
      renderApp(portfolioManager);
    });

    if (refreshBtn) {
      refreshBtn.addEventListener("click", async () => {
        if (portfolioManager.getRefreshState()) return;

        setRotatingClass(refreshBtn);

        await portfolioManager.refreshPortfolio();

        renderApp(portfolioManager);

        removeRotatingClass(refreshBtn);
      });
    }

    //  INTERVAL REFRESH
    setInterval(async () => {
      if (portfolioManager.getRefreshState()) return;

      setRotatingClass(refreshBtn);

      try {
        await portfolioManager.refreshPortfolio();
        renderApp(portfolioManager);
      } finally {
        removeRotatingClass(refreshBtn);
      }
    }, 600000); // 60 sec (safe for API limits)
  } catch (err) {
    console.error("Error initializing app:", err);
  }
})();
