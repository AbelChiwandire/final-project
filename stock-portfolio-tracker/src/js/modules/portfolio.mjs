import StockData from "../api/StockData.mjs";

const stockData = new StockData();

const portfolioSymbols = ["AAPL", "MSFT", "GOOG"];

export async function loadPortfolio() {
  const fetchPromises = portfolioSymbols.map(async (symbol) => {
    try {
      return await stockData.getData(symbol);
    } catch (err) {
      console.error(symbol, err);
      return null;
    }
  });

  return await Promise.all(fetchPromises);
}
