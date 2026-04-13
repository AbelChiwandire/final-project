import { openAuthModal, openAddStockModal } from "../modules/features.mjs";
import { renderPortfolio } from "./renderPortfolio.js";
import { renderSummary } from "./renderSummary.js";
import { getFallbackTemplate } from "./templates.mjs";
import { getUserTheme } from "../modules/themeStorage.mjs";

export function renderApp(portfolioManager) {
	const user = portfolioManager.userId;
	if (user) {
		const theme = getUserTheme(user);
		document.documentElement.setAttribute("data-theme", theme);
	} else {
		document.documentElement.setAttribute("data-theme", "light");
	}
  const portfolio = portfolioManager.getPortfolio();

  const fallbackRoot = document.getElementById("fallback-root");
  const summaryEl = document.getElementById("portfolio-summary");
  const containerEl = document.getElementById("portfolio-container");

  // Always render summary first (single source of truth)
  const summary = portfolioManager.getPortfolioSummary();
  renderSummary(summary, "#portfolio-summary");

  const showFallback = (state) => {
    summaryEl.style.display = "block";
    containerEl.style.display = "none";
    fallbackRoot.style.display = "block";

    fallbackRoot.innerHTML = getFallbackTemplate(state);

    if (state === "signin") {
      document
        .getElementById("fallback-signin-btn")
        .addEventListener("click", openAuthModal);
      return;
    }

    document
      .getElementById("fallback-add-btn")
      .addEventListener("click", () => openAddStockModal());
  };

  const showPortfolio = () => {
    fallbackRoot.style.display = "none";
    summaryEl.style.display = "block";
    containerEl.style.display = "block";

    renderPortfolio(portfolio, "#portfolio-container");
  };

  // CASE 1: no user
  if (!user) {
    showFallback("signin");
    return;
  }

  // CASE 2: empty portfolio
  if (!portfolio || portfolio.length === 0) {
    showFallback("empty");
    return;
  }

  // CASE 3: full portfolio
  showPortfolio();
}