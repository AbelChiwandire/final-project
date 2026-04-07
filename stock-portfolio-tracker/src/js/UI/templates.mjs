export function addStockTemplate() {
  return `
    <div class="modal-header">
      <button class="modal-close">&times;</button>
      <h2>Add Stock</h2>
    </div>
    <form id="add-stock-form" class="modal-form">
      <label>
        Ticker Symbol*:
        <input type="text" name="symbol" required />
      </label>
      <label>
        Company Name:
        <input type="text" name="companyName" />
      </label>
      <label>
        Shares*:
        <input type="number" name="shares" required />
      </label>
      <label>
        Average Cost*:
        <input type="number" name="avgCost" required />
      </label>
      <div class="modal-actions">
        <button type="button" class="modal-cancel">Cancel</button>
        <button type="submit" class="modal-submit">Add Stock</button>
      </div>
    </form>
  `;
}

export const authTemplate = () => `
  <h2 class="text-xl font-bold mb-4">Sign In / Sign Up</h2>
  <form id="auth-form" class="flex flex-col gap-4">
    <input type="text" name="username" placeholder="Username" required class="border p-2 rounded"/>
    <input type="password" name="password" placeholder="Password" required class="border p-2 rounded"/>
    <input type="hidden" name="action" value="signin"/>
    <div class="flex justify-between">
      <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Sign In</button>
      <button type="button" id="switch-action" class="text-blue-500 underline">Sign Up</button>
    </div>
  </form>
`;
