export function createMetricCard({ label, value, tone = "neutral" }) {
  return `
    <div class="p-4 rounded-lg shadow-md bg-white flex flex-col justify-between">
      <div class="text-sm font-medium text-gray-500">${label}</div>
      <div class="mt-1 text-lg font-semibold ${tone}">${value}</div>
    </div>
  `;
}
