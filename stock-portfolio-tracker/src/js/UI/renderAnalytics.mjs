import { renderSummary } from "./renderSummary.js";

export function renderAnalytics(stockDetails, containerEl) {
  if (!containerEl) return;

  const costBasis = stockDetails.costBasis ?? null;
  const totalPnL = stockDetails.totalPnL ?? null;

  const currentPrice = stockDetails.currentPrice ?? null;
  const avgCost = stockDetails.avgCost ?? null;
  const yearHigh = stockDetails.quote?.yearHigh ?? null;

  const pnlPercent =
    costBasis > 0 && totalPnL != null ? (totalPnL / costBasis) * 100 : null;

  const distanceFromHigh =
    yearHigh && currentPrice
      ? ((currentPrice - yearHigh) / yearHigh) * 100
      : null;

  const returnPerShare =
    avgCost && currentPrice ? ((currentPrice - avgCost) / avgCost) * 100 : null;

  const data = [
    { label: "PnL %", value: pnlPercent, type: "percent" },
    { label: "From 52W High", value: distanceFromHigh, type: "percent" },
    { label: "Return vs Avg Cost", value: returnPerShare, type: "percent" },
  ];

  renderSummary(data, containerEl);
}
