export function createMetricCard({ label, value, tone = "neutral" }) {
  return `
    <div class="card-content metric-card">
      <div class="metric-label">${label}</div>
      <div class="metric-value tone-${tone}">${value}</div>
    </div>
  `;
}
