import { renderSummary } from "./renderSummary.js";
import {
  formatNumber,
  formatPercent,
  formatPrice,
  renderErrorState,
  hasApiFailures,
  getFailedDataSources,
} from "../modules/utils.mjs";

export function renderStockMetrics(stockDetails, containerEl) {
  // Check for API failures and show error state if needed
  if (hasApiFailures(stockDetails)) {
    const failedSources = getFailedDataSources(stockDetails);
    const metricsFailures = failedSources.filter((source) =>
      ["Financial Metrics", "52W Data"].includes(source),
    );

    if (metricsFailures.length > 0) {
      const message =
        metricsFailures.length > 1
          ? `Failed to load: ${metricsFailures.join(", ")}`
          : `Failed to load ${metricsFailures[0]}`;

      renderErrorState(containerEl, message);
      return;
    }
  }

  const metricsData = [
    { label: "P/E Ratio", value: formatNumber(stockDetails.metrics?.peRatio) },
    {
      label: "Gross Margin",
      value: formatPercent(stockDetails.metrics?.grossMargin),
    },
    {
      label: "Dividend Yield",
      value: formatPercent(stockDetails.metrics?.dividendYield),
    },
    {
      label: "Debt/Equity",
      value: formatNumber(stockDetails.metrics?.debtEquity),
    },
    {
      label: "Revenue Growth",
      value: formatPercent(stockDetails.growth?.revenueGrowth),
    },
    { label: "Beta", value: formatNumber(stockDetails.profile?.beta) },
    {
      label: "52W High",
      value: formatPrice(stockDetails.quote?.yearHigh, { allowZero: false }),
      type: "currency",
    },
    {
      label: "52W Low",
      value: formatPrice(stockDetails.quote?.yearLow, { allowZero: false }),
      type: "currency",
    },
  ];

  renderSummary(metricsData, containerEl);
}
