import PortfolioManager from "../modules/PortfolioManager.mjs";
import { renderPortfolio } from "../UI/renderPortfolio.js";
import { renderSummary } from "../UI/renderSummary.js";
import { openFormModal } from "./modalHandler.mjs";
import { addStockTemplate } from "../UI/templates.mjs";

const portfolioManager = new PortfolioManager("test-user");

// ---- Portfolio Modal ----
export function openAddStockModal() {
  openFormModal(addStockTemplate, (elements, closeModal) => {
    const { symbol, shares, avgCost } = elements;

    portfolioManager.setPosition(
      symbol.value.toUpperCase(),
      Number(shares.value),
      Number(avgCost.value),
    );

    closeModal();
    renderPortfolio(portfolioManager.getPortfolio(), "#portfolio-container");
    renderSummary(portfolioManager.getPortfolioSummary(), "#portfolio-summary");
  });
}

// ---- Auth Modals ----
export function openSignUpModal() {
  openFormModal(authTemplate, (elements, closeModal) => {
    const { userId, password } = elements;
    // handle signup logic
    closeModal();
  });
}

export function openSignInModal() {
  openFormModal(authTemplate, (elements, closeModal) => {
    const { userId, password } = elements;
    // handle signin logic
    closeModal();
  });
}
