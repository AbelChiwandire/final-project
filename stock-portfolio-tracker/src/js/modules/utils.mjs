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
    return "text-green-600";
  } else if (
    value < 0 &&
    (label === "PnL" || label === "Return %" || label === "Change")
  ) {
    return "text-red-600";
  } else {
    return "text-gray-500";
  }
}

export function formatNumber(value) {
  return typeof value === "number" && !isNaN(value) ? value.toFixed(2) : "0.00";
}
