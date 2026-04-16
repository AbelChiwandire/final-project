/**
 * Skeleton loading states module
 * Provides reusable skeleton templates for loading states
 */

// Skeleton templates for different UI components
export const SkeletonTemplates = {
  // Summary card skeleton - matches renderSummary structure
  summaryCard: () => `
    <div class="card-content metric-card shimmer-item">
      <div class="metric-label skeleton-text skeleton-text--small"></div>
      <div class="metric-value skeleton-text skeleton-text--large"></div>
    </div>
  `,

  // Portfolio card skeleton - matches renderPortfolio structure exactly
  portfolioCard: () => `
    <div class="portfolio-card cursor shimmer-item">
      <div class="card-inner">
        <!-- FRONT FACE -->
        <div class="card-face card-front">
          <div class="card-content">
            <div class="flex-between">
              <div class="flex-col-gap">
                <div class="flex items-center gap-sm">
                  <span class="stock-symbol skeleton-text skeleton-text--medium"></span>
                  <div class="stock-percent-change skeleton-text skeleton-text--small"></div>
                </div>
                <span class="stock-name skeleton-text skeleton-text--small"></span>
              </div>
              <div class="flex-col items-end">
                <div class="stock-price skeleton-text skeleton-text--large"></div>
                <span class="stock-change skeleton-text skeleton-text--small"></span>
              </div>
            </div>

            <div class="flex-between summary-metrics-row">
              <div class="summary-metric">
                <p class="skeleton-text skeleton-text--small"></p>
                <span class="skeleton-text skeleton-text--medium"></span>
              </div>
              <div class="summary-metric">
                <p class="skeleton-text skeleton-text--small"></p>
                <span class="skeleton-text skeleton-text--medium"></span>
              </div>
            </div>

            <div class="flex-between summary-metrics-row">
              <div class="summary-metric">
                <p class="skeleton-text skeleton-text--small"></p>
                <span class="skeleton-text skeleton-text--medium"></span>
              </div>
              <div class="summary-metric">
                <p class="skeleton-text skeleton-text--small"></p>
                <span class="skeleton-text skeleton-text--medium"></span>
              </div>
            </div>
          </div>
        </div>

        <!-- BACK FACE -->
        <div class="card-face card-back">
          <div class="card-content">
            <div class="back-metrics">
              <div class="back-metric">
                <p class="skeleton-text skeleton-text--small"></p>
                <span class="skeleton-text skeleton-text--medium"></span>
              </div>
              <div class="back-metric">
                <p class="skeleton-text skeleton-text--small"></p>
                <span class="skeleton-text skeleton-text--medium"></span>
              </div>
              <div class="back-metric">
                <p class="skeleton-text skeleton-text--small"></p>
                <span class="skeleton-text skeleton-text--medium"></span>
              </div>
              <div class="back-metric">
                <p class="skeleton-text skeleton-text--small"></p>
                <span class="skeleton-text skeleton-text--medium"></span>
              </div>
              <div class="back-metric">
                <p class="skeleton-text skeleton-text--small"></p>
                <span class="skeleton-text skeleton-text--medium"></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ACTIONS -->
      <div class="card-actions">
        <button class="action-btn skeleton-text skeleton-text--small"></button>
        <button class="action-btn skeleton-text skeleton-text--small"></button>
        <button class="action-btn skeleton-text skeleton-text--small"></button>
      </div>
    </div>
  `,

  // Stock profile skeleton - matches renderStockProfile structure exactly
  stockProfile: () => `
    <div class="profile page-container page-section shimmer-item">
      <div class="profile-header">
        <div class="profile-left">
          <div class="skeleton-avatar profile-logo"></div>
          <div class="profile-text">
            <div class="profile-title-row">
              <h1 class="skeleton-text skeleton-text--large"></h1>
              <span class="profile-name skeleton-text skeleton-text--medium"></span>
              <span class="profile-sector skeleton-text skeleton-text--small"></span>
            </div>
            <a class="profile-website skeleton-text skeleton-text--small"></a>
          </div>
        </div>
        <div class="profile-right">
          <div class="profile-price skeleton-text skeleton-text--large"></div>
          <div class="profile-change skeleton-text skeleton-text--small"></div>
        </div>
      </div>
      <div class="profile-summary portfolio-summary shimmer-group">
        <!-- Summary cards will be added by renderSummary -->
      </div>
    </div>
  `,

  // Stock metrics skeleton - matches analytics grid layout
  stockMetrics: () => `
    ${Array(3).fill('').map(() => `
      <div class="card-content metric-card shimmer-item">
        <div class="metric-label skeleton-text skeleton-text--small"></div>
        <div class="metric-value skeleton-text skeleton-text--large"></div>
      </div>
    `).join('')}
  `,

  // News card skeleton - matches renderNews structure exactly
  newsCard: () => `
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
  `
};

// Skeleton state manager
export class SkeletonManager {
  constructor() {
    this.activeSkeletons = new Set();
  }

  // Show skeleton for a container
  showSkeleton(container, skeletonType) {
    const containerEl = typeof container === "string"
      ? document.querySelector(container)
      : container;

    if (!containerEl) return;

    const skeletonKey = `${containerEl.id || container}-${skeletonType}`;

    // Don't show skeleton if already showing for this container
    if (this.activeSkeletons.has(skeletonKey)) return;

    // Store original content if not already stored
    if (!containerEl.dataset.originalContent) {
      containerEl.dataset.originalContent = containerEl.innerHTML;
    }

    // Add skeleton class to container for shimmer animation
    containerEl.classList.add("shimmer-group");

    // Render skeleton template
    const template = SkeletonTemplates[skeletonType];
    if (template) {
      containerEl.innerHTML = template();
      this.activeSkeletons.add(skeletonKey);
    }
  }

  // Hide skeleton and restore content
  hideSkeleton(container, content = null) {
    const containerEl = typeof container === "string"
      ? document.querySelector(container)
      : container;

    if (!containerEl) return;

    // Remove skeleton class
    containerEl.classList.remove("shimmer-group");

    // Restore or set new content
    if (content !== null) {
      containerEl.innerHTML = content;
    } else if (containerEl.dataset.originalContent) {
      containerEl.innerHTML = containerEl.dataset.originalContent;
      delete containerEl.dataset.originalContent;
    }

    // Clear active skeleton tracking
    this.activeSkeletons.forEach(key => {
      if (key.startsWith(containerEl.id || container)) {
        this.activeSkeletons.delete(key);
      }
    });
  }

  // Check if skeleton is active for container
  isSkeletonActive(container) {
    const containerEl = typeof container === "string"
      ? document.querySelector(container)
      : container;

    if (!containerEl) return false;

    return Array.from(this.activeSkeletons).some(key =>
      key.startsWith(containerEl.id || container)
    );
  }

  // Clear all skeletons
  clearAll() {
    this.activeSkeletons.clear();
    document.querySelectorAll('.shimmer-group').forEach(el => {
      el.classList.remove('shimmer-group');
      if (el.dataset.originalContent) {
        el.innerHTML = el.dataset.originalContent;
        delete el.dataset.originalContent;
      }
    });
  }
}

// Global skeleton manager instance
export const skeletonManager = new SkeletonManager();

// Helper functions for common skeleton operations
export const showSkeleton = (container, type) => skeletonManager.showSkeleton(container, type);
export const hideSkeleton = (container, content) => skeletonManager.hideSkeleton(container, content);
export const isSkeletonActive = (container) => skeletonManager.isSkeletonActive(container);
