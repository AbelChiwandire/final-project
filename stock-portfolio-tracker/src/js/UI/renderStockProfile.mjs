import { renderSummary } from "./renderSummary.js";

export function renderStockProfile(data, containerEl) {
  containerEl.innerHTML = "";
  const wrapper = document.createElement("div");

  const companyInfo = document.createElement("div");

  const logo = document.createElement("img");
  logo.src = data.profile.logo;

  const infoBlock = document.createElement("div");

  const identity = document.createElement("div");

  const h1 = document.createElement("h1");
  h1.textContent = data.symbol;

  const name = document.createElement("span");
  name.textContent = data.profile.companyName;

  const sector = document.createElement("span");
  sector.textContent = data.profile.sector;

  identity.appendChild(h1);
  identity.appendChild(name);
  identity.appendChild(sector);

  const link = document.createElement("a");
  link.href = data.profile.website;
  link.textContent = data.profile.website;

  infoBlock.appendChild(identity);
  infoBlock.appendChild(link);

  const priceBlock = document.createElement("div");

  const price = document.createElement("div");
  price.textContent = data.currentPrice;

  const change = document.createElement("div");
  change.textContent =
    data.change + " (" + data.percentageChange + ")";

  priceBlock.appendChild(price);
  priceBlock.appendChild(change);

  companyInfo.appendChild(logo);
  companyInfo.appendChild(infoBlock);
  companyInfo.appendChild(priceBlock);

  const summaryContainer = document.createElement("div");

  const summaryData = [
    { label: "Shares Held", value: data.quantity },
    { label: "Avg Cost", value: data.avgCost },
    { label: "Market Value", value: data.marketValue },
    { label: "Total P&L", value: data.marketValue - data.costBasis }
  ];

  renderSummary(summaryData, summaryContainer);

  wrapper.appendChild(companyInfo);
  wrapper.appendChild(summaryContainer);

  containerEl.appendChild(wrapper);
}