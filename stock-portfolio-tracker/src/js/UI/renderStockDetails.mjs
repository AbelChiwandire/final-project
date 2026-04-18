import { renderStockProfile } from "./renderStockProfile.mjs";
import { renderStockMetrics } from "./renderStockMetrics.mjs";
import { renderAnalytics } from "./renderAnalytics.mjs";
import { renderStockNews } from "./renderNews.mjs";
import {
  showSkeleton,
  hideSkeleton,
  isSkeletonActive,
} from "../modules/skeleton.mjs";

export function renderStockDetails(
  stockDetails,
  containers,
  isLoading = false,
) {
  const {
    profileContainerEl,
    metricsContainerEl,
    analyticsContainerEl,
    newsContainerEl,
  } = containers;

  // -----------------------------
  // Handle loading states
  // -----------------------------
  if (isLoading) {
    // Show skeletons for all containers
    showSkeleton(profileContainerEl, "stockProfile");

    // For metrics container, render 8 skeleton cards directly
    if (metricsContainerEl) {
      metricsContainerEl.innerHTML = Array(8)
        .fill("")
        .map(
          () => `
        <div class="card-content metric-card shimmer-item">
          <div class="metric-label skeleton-text skeleton-text--small"></div>
          <div class="metric-value skeleton-text skeleton-text--large"></div>
        </div>
      `,
        )
        .join("");
    }

    // For analytics container, render 3 skeleton cards directly
    if (analyticsContainerEl) {
      analyticsContainerEl.innerHTML = Array(3)
        .fill("")
        .map(
          () => `
        <div class="card-content metric-card shimmer-item">
          <div class="metric-label skeleton-text skeleton-text--small"></div>
          <div class="metric-value skeleton-text skeleton-text--large"></div>
        </div>
      `,
        )
        .join("");
    }

    // For news container, render 8 news skeleton cards
    if (newsContainerEl) {
      newsContainerEl.innerHTML = Array(8)
        .fill("")
        .map(
          () => `
        <a class="news-card card-content shimmer-item" href="#">
          <div class="news-card__main">
            <div class="news-card__image-wrapper">
              <div class="skeleton-image news-card__image"></div>
            </div>
            <div class="news-card__content">
              <h3 class="news-card__headline skeleton-text skeleton-text--medium"></h3>
              <div class="news-card__meta">
                <span class="news-card__source skeleton-text skeleton-text--small"></span>
                <span class="news-card__timestamp skeleton-text skeleton-text--small"></span>
              </div>
            </div>
          </div>
          <p class="news-card__summary">
            <span class="skeleton-text skeleton-text--small"></span>
            <span class="skeleton-text skeleton-text--small"></span>
            <span class="skeleton-text skeleton-text--small"></span>
          </p>
        </a>
      `,
        )
        .join("");
    }

    // Don't render actual content while loading
    return;
  }

  // Hide skeletons when loading is complete
  if (isSkeletonActive(profileContainerEl)) {
    hideSkeleton(profileContainerEl);
  }
  if (isSkeletonActive(metricsContainerEl)) {
    hideSkeleton(metricsContainerEl);
  }
  if (isSkeletonActive(analyticsContainerEl)) {
    hideSkeleton(analyticsContainerEl);
  }
  if (isSkeletonActive(newsContainerEl)) {
    hideSkeleton(newsContainerEl);
  }

  // Render actual content
  renderStockProfile(stockDetails, profileContainerEl);
  renderStockMetrics(stockDetails, metricsContainerEl);
  renderAnalytics(stockDetails, analyticsContainerEl);
  renderStockNews(stockDetails.news || [], newsContainerEl);
}

// -----------------------------
// Controlled Refresh (flag-aware)
// -----------------------------
export function startAutoRefresh({
  portfolioManager,
  symbol,
  containers,
  onRefreshStart,
  onRefreshEnd,
  interval = 600000,
}) {
  return setInterval(async () => {
    // prevent overlapping refresh cycles
    if (portfolioManager.getRefreshState?.()) return;

    try {
      onRefreshStart?.();

      // IMPORTANT: mark refreshing at source
      portfolioManager.isRefreshing = true;

      // Show loading state with skeletons
      renderStockDetails(null, containers, true);

      // 1. Refresh portfolio FIRST
      await portfolioManager.loadPortfolio({ forceRefresh: true });

      // 2. Refresh stock details (forced)
      const stockDetails = await portfolioManager.getStockDetails(symbol, true);

      renderStockDetails(stockDetails, containers);
    } catch (err) {
      console.error("Stock details refresh failed:", err);
    } finally {
      portfolioManager.isRefreshing = false;
      onRefreshEnd?.();
    }
  }, interval);
}
