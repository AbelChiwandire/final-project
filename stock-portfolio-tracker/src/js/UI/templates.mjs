export function addStockTemplate(isEdit = false) {
  return `
    <div class="modal-panel">

      <div class="modal-header">
        <h2>${isEdit ? "Edit Stock" : "Add Stock"}</h2>
        <button class="modal-close" aria-label="Close modal">&times;</button>
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
          <button type="button" class="modal-cancel" aria-label="Cancel">Cancel</button>
          <button type="submit" class="button-primary animated-border cta">${isEdit ? "Edit Stock" : "Add Stock"}</button>
        </div>
      </form>

    </div>
  `;
}
export const authTemplate = () => `
  <div class="modal-panel">

    <div class="modal-header">
      <h2>Account</h2>
      <button type="button" class="modal-close" aria-label="Close account modal">&times;</button>
    </div>

    <form id="auth-form" class="modal-body modal-form">
      <div class="form-group">
        <input type="text" name="username" placeholder="Username" required />
        <span class="validation-message" id="username-validation"></span>
      </div>
      
      <div class="form-group email-field" style="display: none;">
        <input type="email" name="email" placeholder="Email" required />
        <span class="validation-message" id="email-validation"></span>
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

      <button type="button" id="switch-action" class="modal-link" aria-label="Switch to sign up">
      Do not have an account? <span class="modal-link-text">Sign Up</span>
      </button>

      <button type="submit" class="button-primary animated-border cta" aria-label="Log in">Log In</button>
      
    </form>

  </div>
`;

export function settingsTemplate({ username, theme, email }) {
  return `
    <div class="modal-panel">

      <div class="modal-header">
        <h2>Settings</h2>
        <button type="button" class="modal-close">&times;</button>
      </div>

      <div class="modal-body">

        <div class="modal-section user-info">
          <div class="user-icon-container">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" class="user-icon">
              <path fill="currentColor" d="M9.993 10.573a4.5 4.5 0 1 0 0-9a4.5 4.5 0 0 0 0 9ZM10 0a6 6 0 0 1 3.04 11.174c3.688 1.11 6.458 4.218 6.955 8.078c.047.367-.226.7-.61.745c-.383.045-.733-.215-.78-.582c-.54-4.19-4.169-7.345-8.57-7.345c-4.425 0-8.101 3.161-8.64 7.345c-.047.367-.397.627-.78.582c-.384-.045-.657-.378-.61-.745c.496-3.844 3.281-6.948 6.975-8.068A6 6 0 0 1 10 0Z"/>
            </svg>
          </div>
          <div class="user-header">
            <p class="modal-username">${username}</p>
            ${email ? `<span class="user-email">${email}</span>` : ''}
          </div>
        </div>

        <div class="modal-section">
          <label>
            Theme
            <div class="theme-button-group">
              <button type="button" class="theme-btn ${theme === "light" ? "active" : ""}" data-theme="light">Light</button>
              <button type="button" class="theme-btn ${theme === "dark" ? "active" : ""}" data-theme="dark">Dark</button>
            </div>
          </label>
        </div>

        <div class="modal-actions flex-end">
          <button class="settings-signout-btn modal-danger" aria-label="Sign Out">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" class="sign-out-icon">
              <path fill="currentColor" d="M9 20.75H6a2.64 2.64 0 0 1-2.75-2.53V5.78A2.64 2.64 0 0 1 6 3.25h3a.75.75 0 0 1 0 1.5H6a1.16 1.16 0 0 0-1.25 1v12.47a1.16 1.16 0 0 0 1.25 1h3a.75.75 0 0 1 0 1.5Zm7-4a.74.74 0 0 1-.53-.22a.75.75 0 0 1 0-1.06L18.94 12l-3.47-3.47a.75.75 0 1 1 1.06-1.06l4 4a.75.75 0 0 1 0 1.06l-4 4a.74.74 0 0 1-.53.22Z"/>
              <path fill="currentColor" d="M20 12.75H9a.75.75 0 0 1 0-1.5h11a.75.75 0 0 1 0 1.5Z"/>
            </svg>
            Sign Out
          </button>
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

      <button id="${buttonId}" class="fallback-btn button-primary" aria-label="${buttonText}">
        ${buttonText}
      </button>
    </div>
  `;
}

export function stockDetailsHeaderTemplate(symbol) {
  return `
    <div class="page-container flex-between">
      <div class="flex-between">
        <button id="back-to-portfolio" class="details-back-btn" aria-label="Back to portfolio">
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
