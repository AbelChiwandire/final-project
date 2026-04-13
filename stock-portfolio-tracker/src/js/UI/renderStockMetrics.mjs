import { renderSummary } from "./renderSummary.js";
import { formatNumber, formatPercent } from "../modules/utils.mjs";

export function renderStockMetrics(stockDetails, containerEl) {
  const metricsData = [
    { label: "P/E Ratio", value: formatNumber(stockDetails.metrics.peRatio) },
    { label: "Gross Margin", value: formatPercent(stockDetails.metrics.grossMargin) },
    { label: "Dividend Yield", value: formatPercent(stockDetails.metrics.dividendYield) },
    { label: "Debt/Equity", value: formatNumber(stockDetails.metrics.debtEquity) },
    { label: "Revenue Growth", value: formatPercent(stockDetails.growth.revenueGrowth) },
    { label: "Beta", value: formatNumber(stockDetails.profile.beta) },
    { label: "52W High", value: formatNumber(stockDetails.quote.yearHigh) },
    { label: "52W Low", value: formatNumber(stockDetails.quote.yearLow) },
  ];

  renderSummary(metricsData, containerEl);
}