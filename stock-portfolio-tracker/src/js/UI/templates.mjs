export function addStockTemplate() {
  return `
    <div class="modal-header">
      <button class="modal-close">&times;</button>
      <h2>Add Stock</h2>
    </div>
    <form id="add-stock-form" class="modal-form">
      <label>
        Ticker Symbol*:
        <input type="text" name="symbol" required />
      </label>
      <label>
        Company Name*:
        <input type="text" name="companyName" required />
      </label>
      <label>
        Shares*:
        <input type="number" name="shares" required />
      </label>
      <label>
        Average Cost*:
        <input type="number" name="avgCost" required />
      </label>
      <div class="modal-actions">
        <button type="button" class="modal-cancel">Cancel</button>
        <button type="submit" class="modal-submit">Add Stock</button>
      </div>
    </form>
  `;
}

export const authTemplate = () => `
  <h2 class="text-xl font-bold mb-4">Sign In / Sign Up</h2>
  <form id="auth-form" class="flex flex-col gap-4">
    <input type="text" name="username" placeholder="Username" required class="border p-2 rounded"/>
    <input type="password" name="password" placeholder="Password" required class="border p-2 rounded"/>
    <input type="hidden" name="action" value="signin"/>
    <div class="flex justify-between">
      <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Sign In</button>
      <button type="button" id="switch-action" class="text-blue-500 underline">Sign Up</button>
    </div>
  </form>
`;

export function settingsTemplate({ username, theme }) {
  return `
    <div class="settings-modal">

      <!-- User Section -->
      <div class="settings-section">
        <p class="settings-username">${username}</p>
      </div>

      <!-- Theme Section -->
      <div class="settings-section">
        <label class="settings-label">
          Theme
          <select class="settings-theme-select">
            <option value="light" ${theme === "light" ? "selected" : ""}>Light</option>
            <option value="dark" ${theme === "dark" ? "selected" : ""}>Dark</option>
          </select>
        </label>
      </div>

      <!-- Actions Section -->
      <div class="settings-section">
        <button class="settings-signout-btn">
          Sign Out
        </button>
      </div>

    </div>
  `;
}

export function getFallbackTemplate(state) {
  const isAuth = state === "signin";

  const heading = isAuth
    ? "Welcome"
    : "No positions yet";

  const text = isAuth
    ? "Sign in or create an account to start tracking your portfolio."
    : "Add your first stock position to start tracking your portfolio performance.";

  const buttonText = isAuth ? "Sign In" : "Add Stock";

  const buttonId = isAuth ? "fallback-signin-btn" : "fallback-add-btn";

  return `
    <div class="fallback-container">
      <div class="fallback-icon">
        <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g id="Edit / Add_Plus">
          <path id="Vector" d="M6 12H12M12 12H18M12 12V18M12 12V6" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </g>
        </svg>
      </div>

      <h2 class="fallback-title">${heading}</h2>

      <p class="fallback-text">
        ${text}
      </p>

      <button id="${buttonId}" class="fallback-btn">
        ${buttonText}
      </button>
    </div>
  `;
}