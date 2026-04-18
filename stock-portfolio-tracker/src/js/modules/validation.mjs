// validation.mjs
import { getUsernameIndex } from "./auth.mjs";

// Password validation function
export function validatePassword(password) {
  const requirements = {
    length: password.length >= 12 && password.length <= 14,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    symbol: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };

  const isValid = Object.values(requirements).every((req) => req === true);

  return { isValid, requirements };
}

// Username availability check with debouncing
let usernameCheckTimeout;
export function checkUsernameAvailability(username, callback) {
  clearTimeout(usernameCheckTimeout);

  usernameCheckTimeout = setTimeout(() => {
    if (!username || username.trim().length < 3) {
      callback({
        available: false,
        message: "Username must be at least 3 characters",
      });
      return;
    }

    const normalizedUsername = username.trim().toLowerCase();
    const index = getUsernameIndex();
    const isAvailable = !index[normalizedUsername];

    callback({
      available: isAvailable,
      message: isAvailable ? "Username available" : "Username already taken",
    });
  }, 300); // 300ms debounce
}

// Show validation message
export function showValidationMessage(
  inputElement,
  messageElement,
  message,
  isError = true,
) {
  if (!messageElement) return;

  messageElement.textContent = message;
  messageElement.className = "validation-message";

  if (!isError) {
    messageElement.classList.add("success");
  }

  // Update input border color
  inputElement.classList.remove("input-error", "input-success");
  if (message) {
    inputElement.classList.add(isError ? "input-error" : "input-success");
  }
}

// Clear validation message
export function clearValidationMessage(inputElement, messageElement) {
  if (messageElement) {
    messageElement.textContent = "";
    messageElement.className = "validation-message";
  }
  inputElement.classList.remove("input-error", "input-success");
}

// Update password requirements UI
export function updatePasswordRequirements(password, requirementsContainer) {
  if (!requirementsContainer) return;

  const validation = validatePassword(password);
  const requirementElements =
    requirementsContainer.querySelectorAll(".requirement");

  requirementElements.forEach((element) => {
    const requirement = element.dataset.requirement;
    const isMet = validation.requirements[requirement];

    if (isMet) {
      element.classList.add("met");
    } else {
      element.classList.remove("met");
    }
  });

  return validation.isValid;
}
