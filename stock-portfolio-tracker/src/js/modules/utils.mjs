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
  const toneLabels = new Set(["Change", "PnL", "Return %", "percentageChange"]);

  if (!toneLabels.has(label)) return "tone-neutral";

  if (typeof value !== "number" || isNaN(value)) {
    return "tone-neutral";
  }

  if (value > 0) return "tone-positive";
  if (value < 0) return "tone-negative";

  return "tone-neutral";
}

export const EMPTY_DISPLAY = "—";

export function formatNumber(value, options = {}) {
  const { allowZero = true, decimals = 2 } = options;
  if (value == null || value === "") return EMPTY_DISPLAY;

  const number = Number(value);
  if (!Number.isFinite(number)) return EMPTY_DISPLAY;
  if (number === 0 && !allowZero) return EMPTY_DISPLAY;

  return number.toFixed(decimals);
}

export function formatPercent(value, options = {}) {
  const { allowZero = true, decimals = 2 } = options;
  if (value == null || value === "") return EMPTY_DISPLAY;

  const number = Number(value);
  if (!Number.isFinite(number)) return EMPTY_DISPLAY;
  if (number === 0 && !allowZero) return EMPTY_DISPLAY;

  const sign = number >= 0 ? "+" : "-";
  return `${sign}${Math.abs(number).toFixed(decimals)}%`;
}

export function formatPrice(value, options = {}) {
  const { allowZero = true, decimals = 2 } = options;
  if (value == null || value === "") return EMPTY_DISPLAY;

  const number = Number(value);
  if (!Number.isFinite(number)) return EMPTY_DISPLAY;
  if (number === 0 && !allowZero) return EMPTY_DISPLAY;

  return `$${number.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
}

export function displayValue(value) {
  if (value == null || value === "") return EMPTY_DISPLAY;
  return String(value);
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

export function applyImageFallback(imgEl, fallbackText = "N/A") {
  imgEl.onerror = () => {
    imgEl.onerror = null;

    const svg = `
      <svg xmlns='http://www.w3.org/2000/svg' width='40' height='40'>
        <rect width='100%' height='100%' fill='#2a2a2a'/>
        <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
          font-size='12' fill='#888' font-family='Arial'>
          ${fallbackText}
        </text>
      </svg>
    `;

    imgEl.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  };
}

export function setRotatingClass(btn) {
  if (!btn) return;
  btn.classList.add("is-rotating");
}

export function removeRotatingClass(btn) {
  if (!btn) return;
  btn.classList.remove("is-rotating");
}
