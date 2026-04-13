import { openAddStockModal } from "../modules/features.mjs";

export default function initDashboardController(container, portfolioManager) {
  if (!container) return;

  document.querySelector(container).addEventListener("click", (event) => handleClick(event, portfolioManager));
}

function handleClick(event, portfolioManager) {
  const card = event.target.closest(".portfolio-card");
  if (!card) return;

	const symbol = card.dataset.symbol;
	if (!symbol) {
		console.error("Missing data-symbol on portfolio-card");
		return;
	}
  const actionElement = event.target.closest("[data-action]");

  if (actionElement) {
    const action = actionElement.dataset.action;

    // Prevent triggering card navigation
    event.stopPropagation();

    handleAction(action, symbol, card, portfolioManager);
    return;
  }

  navigateToDetails(symbol);
}

function handleAction(action, symbol, card, portfolioManager) {
  switch (action) {
    case "delete":
			deleteStock(symbol, portfolioManager);
      break;

    case "edit":
			openEditModal(symbol, portfolioManager);
      break;

    case "flip":
      toggleCardFlip(card);
      break;

    default:
      break;
  }
}

function navigateToDetails(symbol) {
  const params = new URLSearchParams({ symbol });
  window.location.href = `../stock-details/index.html?${params}`;
}

function deleteStock(symbol, portfolioManager) {
	portfolioManager.removePosition(symbol);

	document.dispatchEvent(new CustomEvent("portfolioUpdated"));
}

function openEditModal(symbol, portfolioManager) {
  const currentPosition = portfolioManager.getPosition(symbol);
	if (!currentPosition) {
			console.error("Position not found for symbol:", symbol);
				return;
	}  
	openAddStockModal(currentPosition);
}

function toggleCardFlip(card) {
  card.classList.toggle("flipped");
}