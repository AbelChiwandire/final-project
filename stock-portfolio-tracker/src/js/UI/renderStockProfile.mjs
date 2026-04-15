import { renderSummary } from "./renderSummary.js";
import {
  formatNumber,
  formatPercent,
  displayValue,
  applyImageFallback,
  getToneClass
} from "../modules/utils.mjs";

export function renderStockProfile(data, containerEl) {
  containerEl.innerHTML = "";

  const wrapper = document.createElement("div");
  wrapper.className = "profile";

  wrapper.innerHTML = `
    <div class="profile-header page-container page-section">
      
      <div class="profile-left">
        <img class="profile-logo" src="${data.profile.logo || ""}" />

        <div class="profile-text">
          <div class="profile-title-row">
            <h1>${displayValue(data.symbol)}</h1>
            <span class="profile-name">
              ${displayValue(data.profile.companyName)}
            </span>
            <span class="profile-sector">
              ${displayValue(data.profile.sector)}
            </span>
          </div>
          <a class="profile-website" href="${data.profile.website || "#"}" target="_blank">
            ${displayValue(data.profile.website)}
          </a>
        </div>
      </div>

      <div class="profile-right">
        <div class="profile-price">
          $${formatNumber(data.currentPrice, { allowZero: false })}
        </div>
        <div class="profile-change"></div>
      </div>

    </div>

    <div class="profile-summary portfolio-summary"></div>
  `;

  // --- Image fallback ---
  const logo = wrapper.querySelector(".profile-logo");
  applyImageFallback(logo, data.symbol);

  // --- Tone + Change handling ---
  const changeEl = wrapper.querySelector(".profile-change");

  let toneClass = "tone-neutral";

  if (data.change != null) {
    toneClass = getToneClass("Change", data.change);
  }

  changeEl.classList.add(toneClass);

  changeEl.textContent = `
    ${formatNumber(data.change)} (${formatPercent(data.percentageChange)})
  `;

  // --- Summary ---
  const summaryContainer = wrapper.querySelector(".profile-summary");

  const summaryData = [
    { label: "Shares Held", value: data.quantity },
    { label: "Avg Cost", value: data.avgCost },
    { label: "Market Value", value: data.marketValue },
    {
      label: "Total P&L",
      value:
        data.marketValue != null && data.costBasis != null
          ? data.marketValue - data.costBasis
          : null
    }
  ];

  renderSummary(summaryData, summaryContainer);

  containerEl.appendChild(wrapper);
}