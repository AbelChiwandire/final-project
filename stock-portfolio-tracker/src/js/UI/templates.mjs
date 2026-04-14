export function addStockTemplate() {
  return `
    <div class="modal-panel">

      <div class="modal-header">
        <h2>Add Stock</h2>
        <button class="modal-close">&times;</button>
      </div>

      <form id="add-stock-form" class="modal-body modal-form">
        <label>
          Ticker Symbol*
          <input type="text" name="symbol" required />
        </label>

        <label>
          Company Name*
          <input type="text" name="companyName" required />
        </label>

        <label>
          Shares*
          <input type="number" name="shares" required />
        </label>

        <label>
          Average Cost*
          <input type="number" name="avgCost" required />
        </label>

        <div class="modal-actions">
          <button type="button" class="modal-cancel">Cancel</button>
          <button type="submit" class="button-primary">Add Stock</button>
        </div>
      </form>

    </div>
  `;
}
export const authTemplate = () => `
  <div class="modal-panel">

    <div class="modal-header">
      <h2>Account</h2>
      <button type="button" class="modal-close">&times;</button>
    </div>

    <form id="auth-form" class="modal-body modal-form">
      <input type="text" name="username" placeholder="Username" required />
      <input type="password" name="password" placeholder="Password" required />
      <input type="hidden" name="action" value="signin"/>

      <button type="button" id="switch-action" class="modal-link">
      Do not have an account? <span class="modal-link-text">Sign Up</span>
      </button>

      <button type="submit" class="button-primary">Log In</button>
      
    </form>

  </div>
`;

export function settingsTemplate({ username, theme }) {
  return `
    <div class="modal-panel">

      <div class="modal-header">
        <h2>Settings</h2>
        <button type="button" class="modal-close">&times;</button>
      </div>

      <div class="modal-body">

        <div class="modal-section">
          <p class="modal-username">${username}</p>
        </div>

        <div class="modal-section">
          <label>
            Theme
            <select class="settings-theme-select modal-select">
              <option value="light" ${theme === "light" ? "selected" : ""}>Light</option>
              <option value="dark" ${theme === "dark" ? "selected" : ""}>Dark</option>
            </select>
          </label>
        </div>

        <div class="modal-actions">
          <button class="settings-signout-btn modal-danger">Sign Out</button>
        </div>

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

  const buttonText = isAuth ? "Get Started" : "Add Your First Stock";

  const buttonId = isAuth ? "fallback-signin-btn" : "fallback-add-btn";

  return `
    <div class="fallback-container">
      <div class="fallback-icon">
        <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g id="Edit / Add_Plus">
          <path id="Vector" d="M6 12H12M12 12H18M12 12V18M12 12V6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </g>
        </svg>
      </div>

      <h2 class="fallback-title">${heading}</h2>

      <p class="fallback-text">
        ${text}
      </p>

      <button id="${buttonId}" class="fallback-btn button-primary">
        ${buttonText}
      </button>
    </div>
  `;
}
