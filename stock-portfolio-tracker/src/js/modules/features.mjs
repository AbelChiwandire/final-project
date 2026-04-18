import PortfolioManager from "../modules/PortfolioManager.mjs";
import { openFormModal } from "./modalHandler.mjs";
import { addStockTemplate, authTemplate } from "../UI/templates.mjs";
import { User } from "../modules/auth.mjs";
import { getUserTheme, setUserTheme } from "./themeStorage.mjs";
import { settingsTemplate } from "../UI/templates.mjs";
import { openModal } from "./modal.mjs";
import {
  validatePassword,
  checkUsernameAvailability,
  showValidationMessage,
  clearValidationMessage,
  updatePasswordRequirements,
} from "./validation.mjs";

let portfolioManager = new PortfolioManager(User.getCurrentUserId() || null);

export function setPortfolioManager(manager) {
  portfolioManager = manager;
}

// ---- Portfolio Modal ----
export function openAddStockModal(position = null) {
  openFormModal(
    () => addStockTemplate(!!position),
    async (elements, closeModal) => {
      const { symbol, shares, avgCost, companyName } = elements;
      const submitBtn = elements.form?.querySelector('button[type="submit"]');

      try {
        // Validate symbol first
        const symbolToValidate = symbol.value.trim().toUpperCase();
        console.log("Validating symbol:", symbolToValidate);

        const validation = await portfolioManager.validateSymbol(symbolToValidate);
        console.log("Validation result:", validation);

        if (!validation.valid) {
          console.log("Symbol validation failed, showing error:", validation.error);

          // Show error message to user
          const errorDiv = document.createElement("div");
          errorDiv.className = "validation-error";
          errorDiv.textContent = validation.error;
          errorDiv.style.cssText =
            "color: #ef4444; font-size: 14px; margin-top: 8px;";

          // Remove existing error message
          const existingError =
            symbol.parentElement.querySelector(".validation-error");
          if (existingError) existingError.remove();

          // Add new error message
          symbol.parentElement.appendChild(errorDiv);
          symbol.style.borderColor = "#ef4444";

          // Reset after 3 seconds
          setTimeout(() => {
            errorDiv.remove();
            symbol.style.borderColor = "";
          }, 3000);

          return; // Stop execution - do not add stock
        }

        console.log("Symbol validation passed, adding stock to portfolio");

        // If validation passes, add the position
        portfolioManager.setPosition(
          symbolToValidate,
          Number(shares.value),
          Number(avgCost.value),
          companyName.value,
        );

        // Force reload portfolio to ensure cache is updated
        await portfolioManager.loadPortfolio(true);

        closeModal();

        // Ensure portfolio data is available before dispatching event
        document.dispatchEvent(new CustomEvent("portfolioUpdated"));
      } catch (error) {
        console.error("Error adding stock:", error);

        // Show generic error message
        const errorDiv = document.createElement("div");
        errorDiv.className = "validation-error";
        errorDiv.textContent = "Failed to add stock. Please try again.";
        errorDiv.style.cssText =
          "color: #ef4444; font-size: 14px; margin-top: 8px;";

        const existingError =
          submitBtn.parentElement.querySelector(".validation-error");
        if (existingError) existingError.remove();

        submitBtn.parentElement.appendChild(errorDiv);

        setTimeout(() => {
          errorDiv.remove();
        }, 3000);
      }
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

        // Clear validation errors on input
        elements.symbol.addEventListener("input", () => {
          elements.symbol.style.borderColor = "";
          const existingError =
            elements.symbol.parentElement.querySelector(".validation-error");
          if (existingError) existingError.remove();
        });
      },
    },
  );
}

// ---- Auth Modal ----
export function openAuthModal() {
  openFormModal(
    authTemplate,
    async (elements, closeModal) => {
      const { username, password, action } = elements;
      const isSignUp = action.value === "signup";

      // Clear previous validation messages
      clearValidationMessage(
        username,
        document.getElementById("username-validation"),
      );
      clearValidationMessage(
        password,
        document.getElementById("password-validation"),
      );

      // Validate based on mode
      if (isSignUp) {
        // Validate password strength for sign up
        const passwordValidation = validatePassword(password.value);
        if (!passwordValidation.isValid) {
          showValidationMessage(
            password,
            document.getElementById("password-validation"),
            "Password does not meet requirements",
          );
          return;
        }
      }

      // Handle authentication
      const user = new User(username.value, password.value);
      let result;

      if (action.value === "signin") {
        result = await user.login();
      } else {
        result = await user.register();
      }

      if (!result.success) {
        // Show inline validation messages based on error type
        if (result.error.includes("Username")) {
          showValidationMessage(
            username,
            document.getElementById("username-validation"),
            result.error,
          );
        } else if (
          result.error.includes("password") ||
          result.error.includes("Password")
        ) {
          showValidationMessage(
            password,
            document.getElementById("password-validation"),
            result.error,
          );
        } else {
          // General error - show on password field as it's more prominent
          showValidationMessage(
            password,
            document.getElementById("password-validation"),
            result.error,
          );
        }
        return;
      }

      // Update PortfolioManager with new/current user
      portfolioManager.userId = result.user.id;

      await portfolioManager.loadPortfolio();

      // Close modal and re-render app state
      closeModal();

      // Ensure portfolio is fully loaded before dispatching events

      // Force immediate render to ensure portfolio loads after login
      document.dispatchEvent(new CustomEvent("portfolioUpdated"));

      // Also trigger immediate render for login flow specifically
      setTimeout(() => {
        document.dispatchEvent(new CustomEvent("portfolioUpdated"));
      }, 10);
    },
    {
      onInit: (elements) => {
        const form = document.querySelector("#modal-root #auth-form");
        if (!form) return;

        const usernameInput = form.querySelector('[name="username"]');
        const passwordInput = form.querySelector('[name="password"]');
        const usernameValidation = document.getElementById(
          "username-validation",
        );
        const passwordValidation = document.getElementById(
          "password-validation",
        );
        const passwordRequirements = document.getElementById(
          "password-requirements",
        );
        const passwordToggle = document.getElementById("password-toggle");
        const actionInput = form.querySelector('[name="action"]');

        // Password visibility toggle
        passwordToggle.addEventListener("click", () => {
          const isPassword = passwordInput.type === "password";
          passwordInput.type = isPassword ? "text" : "password";
          passwordToggle.classList.toggle("active", isPassword);
        });

        // Username validation for sign up
        usernameInput.addEventListener("input", () => {
          if (actionInput.value === "signup") {
            checkUsernameAvailability(usernameInput.value, (result) => {
              if (usernameInput.value.trim().length > 0) {
                showValidationMessage(
                  usernameInput,
                  usernameValidation,
                  result.message,
                  !result.available,
                );
              } else {
                clearValidationMessage(usernameInput, usernameValidation);
              }
            });
          } else {
            clearValidationMessage(usernameInput, usernameValidation);
          }
        });

        // Password validation for sign up
        passwordInput.addEventListener("input", () => {
          if (actionInput.value === "signup") {
            const isValid = updatePasswordRequirements(
              passwordInput.value,
              passwordRequirements,
            );
            if (passwordInput.value.length > 0) {
              showValidationMessage(
                passwordInput,
                passwordValidation,
                isValid
                  ? "Strong password"
                  : "Password does not meet requirements",
                !isValid,
              );
            } else {
              clearValidationMessage(passwordInput, passwordValidation);
            }
          } else {
            clearValidationMessage(passwordInput, passwordValidation);
          }
        });

        // Handle mode switching
        const switchBtn = form.querySelector("#switch-action");
        const submitBtn = form.querySelector('button[type="submit"]');

        switchBtn.addEventListener("click", () => {
          if (actionInput.value === "signin") {
            actionInput.value = "signup";
            submitBtn.textContent = "Create Account";
            switchBtn.innerHTML = `Already have an account? <span class="modal-link-text">Sign In</span>`;
            passwordRequirements.style.display = "block";

            // Clear validation and check current inputs
            clearValidationMessage(usernameInput, usernameValidation);
            clearValidationMessage(passwordInput, passwordValidation);

            // Trigger validation for current values
            if (usernameInput.value.trim().length > 0) {
              usernameInput.dispatchEvent(new Event("input"));
            }
            if (passwordInput.value.length > 0) {
              passwordInput.dispatchEvent(new Event("input"));
            }
          } else {
            actionInput.value = "signin";
            submitBtn.textContent = "Log In";
            switchBtn.innerHTML = `Do not have an account? <span class="modal-link-text">Sign Up</span>`;
            passwordRequirements.style.display = "none";

            // Clear validation messages for sign in mode
            clearValidationMessage(usernameInput, usernameValidation);
            clearValidationMessage(passwordInput, passwordValidation);
          }
        });
      },
    },
  );
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
