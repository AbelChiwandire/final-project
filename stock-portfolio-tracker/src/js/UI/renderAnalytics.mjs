import { renderSummary } from "./renderSummary.js";
import {
  renderErrorState,
  hasApiFailures,
  getFailedDataSources,
} from "../modules/utils.mjs";

export function renderAnalytics(stockDetails, containerEl) {
  if (!containerEl) return;

  // Check for API failures and show error state if needed
  if (hasApiFailures(stockDetails)) {
    const failedSources = getFailedDataSources(stockDetails);
    const analyticsFailures = failedSources.filter((source) =>
      ["Price Data", "52W Data", "Growth Data"].includes(source),
    );

    if (analyticsFailures.length > 0) {
      const message =
        analyticsFailures.length > 1
          ? `Failed to load: ${analyticsFailures.join(", ")}`
          : `Failed to load ${analyticsFailures[0]}`;

      renderErrorState(containerEl, message);
      return;
    }
  }

  const costBasis = stockDetails.costBasis ?? null;
  const totalPnL = stockDetails.totalPnL ?? null;

  const currentPrice = stockDetails.currentPrice ?? null;
  const avgCost = stockDetails.avgCost ?? null;
  const yearHigh = stockDetails.quote?.yearHigh ?? null;
  const yearLow = stockDetails.quote?.yearLow ?? null;
  const previousClose = stockDetails.previousClose ?? null;

  // Existing calculations
  const pnlPercent =
    costBasis > 0 && totalPnL != null ? (totalPnL / costBasis) * 100 : null;

  const distanceFromHigh =
    yearHigh && currentPrice
      ? ((currentPrice - yearHigh) / yearHigh) * 100
      : null;

  const returnPerShare =
    avgCost && currentPrice ? ((currentPrice - avgCost) / avgCost) * 100 : null;

  // NEW: Distance from 52W Low - shows upside potential
  const distanceFromLow =
    yearLow && currentPrice ? ((currentPrice - yearLow) / yearLow) * 100 : null;

  // NEW: PEG Ratio - valuation vs growth (combines FMP metrics + Finnhub data)
  const peRatio = stockDetails.metrics?.peRatio ?? null;
  const revenueGrowth = stockDetails.growth?.revenueGrowth ?? null;
  const pegRatio =
    peRatio && revenueGrowth && revenueGrowth > 0
      ? peRatio / (revenueGrowth / 100)
      : null;

  // NEW: Today's Performance - intraday movement
  const todayPerformance =
    previousClose && currentPrice
      ? ((currentPrice - previousClose) / previousClose) * 100
      : null;

  const data = [
    { label: "PnL %", value: pnlPercent, type: "percent" },
    { label: "From 52W High", value: distanceFromHigh, type: "percent" },
    { label: "Return vs Avg Cost", value: returnPerShare, type: "percent" },
    { label: "From 52W Low", value: distanceFromLow, type: "percent" },
    { label: "PEG Ratio", value: pegRatio, type: "number" },
    { label: "Today's Performance", value: todayPerformance, type: "percent" },
  ];

  renderSummary(data, containerEl);
}
