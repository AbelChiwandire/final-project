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
