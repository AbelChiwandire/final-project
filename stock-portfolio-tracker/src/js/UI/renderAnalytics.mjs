import { renderSummary } from "./renderSummary.js";
import { formatPercent } from "../modules/utils.mjs";

export function renderAnalytics(stockDetails, containerEl) {
  const costBasis = stockDetails.costBasis ?? 0;
  const totalPnL = stockDetails.totalPnL ?? 0;

  const currentPrice = stockDetails.currentPrice ?? null;
  const avgCost = stockDetails.avgCost ?? null;
  const yearHigh = stockDetails.quote?.yearHigh ?? null;

  const pnlPercent =
    costBasis > 0 ? (totalPnL / costBasis) * 100 : null;

  const distanceFromHigh =
    yearHigh && currentPrice
      ? ((currentPrice - yearHigh) / yearHigh) * 100
      : null;

  const returnPerShare =
    avgCost && currentPrice
      ? ((currentPrice - avgCost) / avgCost) * 100
      : null;

  const data = [
    { label: "PnL %", value: formatPercent(pnlPercent) },
    { label: "From 52W High", value: formatPercent(distanceFromHigh) },
    { label: "Return vs Avg Cost", value: formatPercent(returnPerShare) },
  ];

  renderSummary(data, containerEl);
}