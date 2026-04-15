import { formatTimeAgo, applyImageFallback } from "../modules/utils.mjs";

function getFallbackLabel(source) {
  if (!source) return "N/A";

  return source
    .replace(/[^a-zA-Z]/g, "")   // remove symbols/spaces
    .slice(0, 3)                 // take first 3 letters
    .toUpperCase() || "N/A";
}

export function renderStockNews(news, containerEl) {
  const template = document.getElementById("news-card-template");

  containerEl.innerHTML = "";

  if (!Array.isArray(news) || news.length === 0) {
    containerEl.textContent = "No recent news available";
    return;
  }

  const fragment = document.createDocumentFragment();

  news.forEach(article => {
    const clone = template.content.cloneNode(true);

    const anchor = clone.querySelector(".news-card");
    const img = clone.querySelector(".news-card__image");
    const headline = clone.querySelector(".news-card__headline");
    const source = clone.querySelector(".news-card__source");
    const timestamp = clone.querySelector(".news-card__timestamp");
    const summary = clone.querySelector(".news-card__summary");

    // Anchor
    anchor.href = article.url;

    // Image (never remove)
    img.src = article.image || "";
    img.alt = article.headline || "News image";

    applyImageFallback(img, getFallbackLabel(article.source));

    // Text content
    headline.textContent = article.headline;
    source.textContent = article.source || "Unknown";
    timestamp.textContent = formatTimeAgo(article.datetime);

    // Summary
    if (article.summary) {
      summary.textContent = article.summary;
    } else {
      summary.textContent = "";
    }

    fragment.appendChild(clone);
  });

  containerEl.appendChild(fragment);
}