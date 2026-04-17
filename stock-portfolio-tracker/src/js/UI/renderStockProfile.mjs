import { renderSummary } from "./renderSummary.js";
import {
  formatNumber,
  formatPercent,
  formatPrice,
  displayValue,
  applyImageFallback,
  getToneClass,
} from "../modules/utils.mjs";

export function renderStockProfile(data, containerEl) {
  if (!containerEl) return;

  containerEl.innerHTML = "";

  const profile = data?.profile || {};

  const wrapper = document.createElement("div");
  wrapper.className = "profile";

  wrapper.innerHTML = `
    <div class="profile-header page-container page-section">
      
      <div class="profile-left">
        <img class="profile-logo" src="${profile.logo || ""}" alt="${displayValue(profile.companyName) || displayValue(data?.symbol) || 'Company logo'}" />

        <div class="profile-text">
          <div class="profile-title-row">
            <h1>${displayValue(data?.symbol)}</h1>
            <span class="profile-name">
              ${displayValue(profile.companyName)}
            </span>
            <span class="profile-sector">
              ${displayValue(profile.sector)}
            </span>
          </div>
          <a class="profile-website" 
             href="${profile.website || "#"}" 
             target="_blank" 
             rel="noopener noreferrer">
            ${displayValue(profile.website)}
          </a>
        </div>
      </div>

      <div class="profile-right">
        <div class="profile-price">
          ${data?.currentPrice != null
      ? `${formatPrice(data.currentPrice, { allowZero: false })}`
      : "-"
    }
        </div>
        <div class="profile-change">-</div>
      </div>

    </div>

    <div class="profile-summary portfolio-summary"></div>
  `;

  // --- Image fallback (safe) ---
  const logo = wrapper.querySelector(".profile-logo");
  if (logo) {
    applyImageFallback(logo, data?.symbol);
  }

  // --- Change + Tone handling (safe) ---
  const changeEl = wrapper.querySelector(".profile-change");

  if (changeEl) {
    let toneClass = "tone-neutral";

    if (typeof data?.change === "number") {
      toneClass = getToneClass("Change", data.change);
    }

    changeEl.classList.add(toneClass);

    if (
      typeof data?.change === "number" &&
      typeof data?.percentageChange === "number"
    ) {
      changeEl.textContent = `${formatNumber(data.change)} (${formatPercent(
        data.percentageChange,
      )})`;
    } else {
      changeEl.textContent = "-";
    }
  }

  // --- Summary (safe calculation) ---
  const summaryContainer = wrapper.querySelector(".profile-summary");

  if (summaryContainer) {
    const hasMarketValue = typeof data?.marketValue === "number";
    const hasCostBasis = typeof data?.costBasis === "number";

    const totalPnL =
      hasMarketValue && hasCostBasis ? data.marketValue - data.costBasis : null;

    const summaryData = [
      { label: "Shares Held", value: data?.quantity },
      { label: "Avg Cost", value: data?.avgCost },
      { label: "Market Value", value: data?.marketValue },
      { label: "Total P&L", value: totalPnL },
    ];

    renderSummary(summaryData, summaryContainer);
  }

  containerEl.appendChild(wrapper);
}
