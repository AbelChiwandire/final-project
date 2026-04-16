import PortfolioManager from "../modules/PortfolioManager.mjs";
import { openFormModal } from "./modalHandler.mjs";
import { addStockTemplate, authTemplate } from "../UI/templates.mjs";
import { User } from "../modules/auth.mjs";
import { getUserTheme, setUserTheme } from "./themeStorage.mjs";
import { settingsTemplate } from "../UI/templates.mjs";
import { openModal } from "./modal.mjs";

let portfolioManager = new PortfolioManager(User.getCurrentUserId() || null);

export function setPortfolioManager(manager) {
  portfolioManager = manager;
}

// ---- Portfolio Modal ----
export function openAddStockModal(position = null) {
  openFormModal(
    addStockTemplate,
    async (elements, closeModal) => {
      const { symbol, shares, avgCost, companyName } = elements;

      portfolioManager.setPosition(
        symbol.value.toUpperCase(),
        Number(shares.value),
        Number(avgCost.value),
        companyName.value,
      );

      await portfolioManager.loadPortfolio();

      closeModal();
      document.dispatchEvent(new CustomEvent("portfolioUpdated"));
    },
    {
      onInit: (elements) => {
        if (position) {
          elements.symbol.value = position.symbol;
          elements.shares.value = position.quantity;
          elements.avgCost.value = position.avgCost;
          elements.companyName.value = position.companyName;
          elements.symbol.disabled = true;
          elements.companyName.disabled = true;
        }
      },
    },
  );
}

// ---- Auth Modal ----
export function openAuthModal() {
  openFormModal(authTemplate, async (elements, closeModal) => {
    const { username, password, action } = elements;

    // Handle switching between Sign In / Sign Up
    const user = new User(username.value, password.value);
    let result;

    if (action.value === "signin") {
      result = await user.login();
    } else {
      result = await user.register();
    }

    if (!result.success) {
      alert(result.error);
      return;
    }

    // Update PortfolioManager with new/current user
    portfolioManager.userId = result.user.id;

    await portfolioManager.loadPortfolio();

    // Close modal and re-render app state
    closeModal();
    document.dispatchEvent(new CustomEvent("portfolioUpdated"));
  });

  const form = document.querySelector("#modal-root #auth-form");
  if (!form) return;

  const switchBtn = form.querySelector("#switch-action");
  const actionInput = form.querySelector('[name="action"]');
  const submitBtn = form.querySelector('button[type="submit"]');

  switchBtn.addEventListener("click", () => {
    if (actionInput.value === "signin") {
      actionInput.value = "signup";
      submitBtn.textContent = "Create Account";
      switchBtn.innerHTML = `Already have an account? <span class="modal-link-text">Sign In</span>`;
    } else {
      actionInput.value = "signin";
      submitBtn.textContent = "Log In";
      switchBtn.innerHTML = `Do not have an account? <span class="modal-link-text">Sign Up</span>`;
    }
  });
}

export function openSettingsModal() {
  openModal((root, closeModal) => {
    const user = User.getCurrentUser();
    if (!user) return;

    const theme = getUserTheme(user.id);
    const formattedUsername = user.username
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

    root.innerHTML = settingsTemplate({
      username: formattedUsername,
      theme,
    });

    const closeBtn = root.querySelector(".modal-close");
    if (closeBtn) {
      closeBtn.addEventListener("click", closeModal);
    }

    root
      .querySelector(".settings-theme-select")
      .addEventListener("change", (e) => {
        const newTheme = e.target.value;

        setUserTheme(user.id, newTheme);

        document.documentElement.classList.toggle("dark", newTheme === "dark");
      });

    root
      .querySelector(".settings-signout-btn")
      .addEventListener("click", () => {
        User.logout();

        portfolioManager.userId = null;
        portfolioManager.cache = {};

        closeModal();

        // reset UI theme immediately (safe fallback)
        document.documentElement.setAttribute("data-theme", "light");

        document.dispatchEvent(new CustomEvent("portfolioUpdated"));
      });
  });
}
