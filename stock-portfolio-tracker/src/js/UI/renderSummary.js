import { createMetricCard } from "./metricCard.js";
import { getToneClass, formatNumber } from "../modules/utils.mjs";

export function renderSummary(summaryData, container) {
  const containerEl =
    typeof container === "string"
      ? document.querySelector(container)
      : container;

  const formattedData = summaryData.map((item) => {
    const tone = getToneClass(item.label, item.value);
    const value = formatNumber(item.value);
    return { ...item, value, tone };
  });

  const cardsHTML = formattedData.map(createMetricCard).join("");
  containerEl.innerHTML = cardsHTML;
}
