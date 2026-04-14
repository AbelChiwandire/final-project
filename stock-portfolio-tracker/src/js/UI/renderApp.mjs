import { openAuthModal, openAddStockModal } from "../modules/features.mjs";
import { renderPortfolio } from "./renderPortfolio.js";
import { renderSummary } from "./renderSummary.js";
import { getFallbackTemplate } from "./templates.mjs";
import { getUserTheme } from "../modules/themeStorage.mjs";

export function renderApp(portfolioManager) {
  const user = portfolioManager.userId;

  const fallbackRoot = document.getElementById("fallback-root");
  const containerEl = document.getElementById("portfolio-container");

  const portfolio = portfolioManager.getPortfolio();
  const summary = portfolioManager.getPortfolioSummary();

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
    if (btn) btn.addEventListener("click", openAddStockModal);
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
}