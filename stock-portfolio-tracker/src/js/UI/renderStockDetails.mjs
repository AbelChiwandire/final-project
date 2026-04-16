import { renderStockProfile } from "./renderStockProfile.mjs";
import { renderStockMetrics } from "./renderStockMetrics.mjs";
import { renderAnalytics } from "./renderAnalytics.mjs";
import { renderStockNews } from "./renderNews.mjs";

export function renderStockDetails(stockDetails, containers) {
  const {
    profileContainerEl,
    metricsContainerEl,
    analyticsContainerEl,
    newsContainerEl
  } = containers;

  renderStockProfile(stockDetails, profileContainerEl);
  renderStockMetrics(stockDetails, metricsContainerEl);
  renderAnalytics(stockDetails, analyticsContainerEl);
  renderStockNews(stockDetails.news || [], newsContainerEl);
}

// -----------------------------
// Controlled Refresh (flag-aware)
// -----------------------------
export function startAutoRefresh({
  portfolioManager,
  symbol,
  containers,
  onRefreshStart,
  onRefreshEnd,
  interval = 60000
}) {
  return setInterval(async () => {
    // prevent overlapping refresh cycles
    if (portfolioManager.getRefreshState?.()) return;

    try {
      onRefreshStart?.();

      // IMPORTANT: mark refreshing at source
      portfolioManager.isRefreshing = true;

      // 1. Refresh portfolio FIRST
      await portfolioManager.loadPortfolio({ forceRefresh: true });

      // 2. Refresh stock details (forced)
      const stockDetails = await portfolioManager.getStockDetails(symbol, true);

      renderStockDetails(stockDetails, containers);

    } catch (err) {
      console.error("Stock details refresh failed:", err);
    } finally {
      portfolioManager.isRefreshing = false;
      onRefreshEnd?.();
    }
  }, interval);
}