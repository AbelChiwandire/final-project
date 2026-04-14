// ---------------------------
// DOM Utilities
// ---------------------------
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

// ---------------------------
// Rendering Utilities
// ---------------------------

export function renderListWithTemplate(
  template,
  parentElement,
  list,
  position = "afterbegin",
  clear = false,
) {
  if (!parentElement) return; //

  const htmlStrings = list.map(template);

  if (clear) {
    parentElement.innerHTML = "";
  }

  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

export function renderWithTemplate(template, parentElement, data, callback) {
  if (!parentElement) return; //

  parentElement.innerHTML = template;
  if (callback) callback(data);
}

// ---------------------------
// Template Loading
// ---------------------------

export async function loadTemplate(path) {
  const response = await fetch(path);
  return await response.text();
}

// Dynamic header and footer loading
export async function loadHeaderFooter() {
  const header = qs("#header");
  const footer = qs("#footer");

  try {
    // load header only if it exists
    if (header) {
      const headerHtml = await loadTemplate("/partials/header.html");
      renderWithTemplate(headerHtml, header, null, null);
    }

    // load footer only if it exists
    if (footer) {
      const footerHtml = await loadTemplate("/partials/footer.html");
      renderWithTemplate(footerHtml, footer, null, null);
    }
  } catch (err) {
    console.error("Error loading header/footer:", err);
  }
}

// ----------------------------------------------------
// Data Formatting and Tone Utilities
// ----------------------------------------------------

export function getToneClass(label, value) {
  if (
    value > 0 &&
    (label === "PnL" || label === "Return %" || label === "Change")
  ) {
    return "tone-positive";
  } else if (
    value < 0 &&
    (label === "PnL" || label === "Return %" || label === "Change")
  ) {
    return "tone-negative";
  } else {
    return "tone-neutral";
  }
}

export function formatNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number.toFixed(2) : "0.00";
}

export function formatPercent(value) {
  const number = Number(value);
  return Number.isFinite(number) ? `${(number * 100).toFixed(2)}%` : "—";
}

export function formatTimeAgo(timestamp) {
  if (!timestamp) return "";

  const now = Date.now();
  const time = timestamp * 1000;
  const diff = now - time;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (seconds < 60) return `${seconds}s ago`;
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}