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
          <button type="submit" class="button-primary animated-border cta">Add Stock</button>
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
      <div class="form-group">
        <input type="text" name="username" placeholder="Username" required />
        <span class="validation-message" id="username-validation"></span>
      </div>
      
      <div class="form-group">
        <div class="password-input-container">
          <input type="password" name="password" placeholder="Password" required />
          <button type="button" class="password-toggle" id="password-toggle" aria-label="Toggle password visibility">
            <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.0007 12C15.0007 13.6569 13.6576 15 12.0007 15C10.3439 15 9.00073 13.6569 9.00073 12C9.00073 10.3431 10.3439 9 12.0007 9C13.6576 9 15.0007 10.3431 15.0007 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M12.0012 5C7.52354 5 3.73326 7.94288 2.45898 12C3.73324 16.0571 7.52354 19 12.0012 19C16.4788 19 20.2691 16.0571 21.5434 12C20.2691 7.94291 16.4788 5 12.0012 5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        <span class="validation-message" id="password-validation"></span>
        <div class="password-requirements" id="password-requirements" style="display: none;">
          <div class="requirement" data-requirement="length">
            <span class="requirement-icon">·</span> 12-14 characters
          </div>
          <div class="requirement" data-requirement="uppercase">
            <span class="requirement-icon">·</span> Uppercase letter
          </div>
          <div class="requirement" data-requirement="lowercase">
            <span class="requirement-icon">·</span> Lowercase letter
          </div>
          <div class="requirement" data-requirement="number">
            <span class="requirement-icon">·</span> Number
          </div>
          <div class="requirement" data-requirement="symbol">
            <span class="requirement-icon">·</span> Symbol (!@#$%^&* etc.)
          </div>
        </div>
      </div>
      
      <input type="hidden" name="action" value="signin"/>

      <button type="button" id="switch-action" class="modal-link">
      Do not have an account? <span class="modal-link-text">Sign Up</span>
      </button>

      <button type="submit" class="button-primary animated-border cta">Log In</button>
      
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

  const heading = isAuth ? "Welcome" : "No positions yet";

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

export function stockDetailsHeaderTemplate(symbol) {
  return `
    <div class="page-container flex-between">
      <div class="flex-between">
        <button id="back-to-portfolio" class="details-back-btn">
          <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M11.7071 4.29289C12.0976 4.68342 12.0976 5.31658 11.7071 5.70711L6.41421 11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13H6.41421L11.7071 18.2929C12.0976 18.6834 12.0976 19.3166 11.7071 19.7071C11.3166 20.0976 10.6834 20.0976 10.2929 19.7071L3.29289 12.7071C3.10536 12.5196 3 12.2652 3 12C3 11.7348 3.10536 11.4804 3.29289 11.2929L10.2929 4.29289C10.6834 3.90237 11.3166 3.90237 11.7071 4.29289Z" fill="currentColor"/>
          </svg>
          <span>Portfolio</span>
        </button>

        <div class="details-symbol">
          <span class="details-slash">/</span>
          <span class="details-symbol-text">${symbol}</span>
        </div>
      </div>

      <button
        id="refresh-btn"
        aria-label="Refresh data"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
          <path d="M21 3v5h-5"></path>
          <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
          <path d="M8 16H3v5"></path>
        </svg>
      </button>

    </div>
  `;
}
