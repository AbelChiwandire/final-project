import {
  getToneClass,
  formatNumber,
  formatPercent,
  formatPrice,
  displayValue,
} from "../modules/utils.mjs";

export function renderSummary(summaryData, container) {
  const containerEl =
    typeof container === "string"
      ? document.querySelector(container)
      : container;

  if (!containerEl || !Array.isArray(summaryData)) return;

  // --- UI STATE (shimmer) ---
  const isShimmerGroup = containerEl.classList.contains("shimmer-group");

  const formattedData = summaryData.map((item) => {
    const rawValue = item?.value;
    const type = item?.type || "number";

    const isValidNumber = typeof rawValue === "number" && !isNaN(rawValue);

    let formattedValue;
    let tone = "tone-neutral";

    if (!isValidNumber) {
      formattedValue = displayValue(rawValue);
    } else {
      switch (type) {
        case "percent":
          formattedValue = formatPercent(rawValue);
          break;

        case "currency":
          formattedValue = formatPrice(rawValue, { allowZero: false });
          break;

        case "number":
        default:
          formattedValue = formatNumber(rawValue);
          break;
      }

      tone = getToneClass(item.label, rawValue);
    }

    return {
      ...item,
      value: formattedValue,
      tone,
      shimmer: isShimmerGroup,
    };
  });

  containerEl.innerHTML = formattedData
    .map((item) => {
      const shimmerClass = item.shimmer ? "shimmer-item" : "";

      return `
        <div class="card-content metric-card ${shimmerClass}">
          <div class="metric-label">${item.label}</div>
          <div class="metric-value ${item.tone}">
            ${item.value}
          </div>
        </div>
      `;
    })
    .join("");
}
