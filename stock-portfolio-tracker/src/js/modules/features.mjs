import PortfolioManager from "../modules/PortfolioManager.mjs";
import { renderPortfolio } from "../UI/renderPortfolio.js";
import { renderSummary } from "../UI/renderSummary.js";
import { openFormModal } from "./modalHandler.mjs";
import { addStockTemplate, authTemplate } from "../UI/templates.mjs";
import { User } from "../modules/auth.mjs";

const portfolioManager = new PortfolioManager(User.getCurrent()?.id || null);

// ---- Portfolio Modal ----
export function openAddStockModal() {
  openFormModal(addStockTemplate, async (elements, closeModal) => {
    const { symbol, shares, avgCost } = elements;

    portfolioManager.setPosition(
      symbol.value.toUpperCase(),
      Number(shares.value),
      Number(avgCost.value),
    );

    await portfolioManager.loadPortfolio();

    closeModal();
    renderPortfolio(portfolioManager.getPortfolio(), "#portfolio-container");
    renderSummary(portfolioManager.getPortfolioSummary(), "#portfolio-summary");
  });
}

// ---- Auth Modal ----
export function openAuthModal() {
  // Only show if no user is logged in or if modal hasn't been dismissed before in this session
  if (User.getCurrent() || sessionStorage.getItem("authDismissed") === "true") return;

  openFormModal(authTemplate, async (elements, closeModal) => {
    const { username, password, action } = elements;

    // Handle switching between Sign In / Sign Up
    const user = new User(username.value, password.value);
    let result;

    if (action.value === "signin") {
      result = await user.login();
    } else {
      result = await user.register();
    }

    if (!result.success) {
      alert(result.error);
      return;
    }

    // Update PortfolioManager with new/current user
    portfolioManager.userId = result.user.id;

    await portfolioManager.loadPortfolio();

    // Close modal and render portfolio
    closeModal();
    renderPortfolio(portfolioManager.getPortfolio(), "#portfolio-container");
    renderSummary(portfolioManager.getPortfolioSummary(), "#portfolio-summary");
  },{
      onClose: () => {
      sessionStorage.setItem("authDismissed", "true");
    }
  });

  const form = document.querySelector("#modal-root #auth-form");
  if (!form) return;

  const switchBtn = form.querySelector("#switch-action");
  const actionInput = form.querySelector('[name="action"]');
  const submitBtn = form.querySelector('button[type="submit"]');

  switchBtn.addEventListener("click", () => {
    if (actionInput.value === "signin") {
      actionInput.value = "signup";
      submitBtn.textContent = "Sign Up";
      switchBtn.textContent = "Sign In";
    } else {
      actionInput.value = "signin";
      submitBtn.textContent = "Sign In";
      switchBtn.textContent = "Sign Up";
    }
  });
}