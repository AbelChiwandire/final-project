import { formatTimeAgo } from "../modules/utils.mjs";

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

    // Image
    if (article.image) {
      img.src = article.image;
      img.alt = article.headline;
    } else {
      img.remove();
    }

    // Text content
    headline.textContent = article.headline;
    source.textContent = article.source;
    timestamp.textContent = formatTimeAgo(article.datetime);

    // Summary
    if (article.summary) {
      summary.textContent = article.summary;
    } else {
      summary.remove();
    }

    fragment.appendChild(clone);
  });

  containerEl.appendChild(fragment);
}