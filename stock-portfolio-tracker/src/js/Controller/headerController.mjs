import {
  openAddStockModal,
  openSettingsModal,
  openAuthModal,
} from "../modules/features.mjs";
import { User } from "../modules/auth.mjs";

export default function initHeaderController(portfolioManager) {
  const refreshBtn = document.getElementById("refresh-btn");
  const addStockBtn = document.getElementById("add-stock-btn");
  const settingsBtn = document.getElementById("settings-btn");

  function requireAuth() {
    if (!User.getCurrentUser()) {
      openAuthModal();
      return false;
    }
    return true;
  }

  if (refreshBtn) {
    refreshBtn.addEventListener("click", async () => {
      if (!requireAuth()) return;

      try {
        await portfolioManager.refreshPortfolio();

        document.dispatchEvent(new CustomEvent("portfolioUpdated"));
      } catch (err) {
        console.error("Refresh failed:", err);
      }
    });
  }

  if (addStockBtn) {
    addStockBtn.addEventListener("click", () => {
      if (!requireAuth()) return;

      openAddStockModal();
    });
  }

  settingsBtn?.addEventListener("click", () => {
    if (!requireAuth()) return;

    openSettingsModal();
  });
}
