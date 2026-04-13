import { getUserPortfolio, setUserPortfolio } from "./storage.mjs";
import StockData from "./../api/StockData.mjs";

const stockData = new StockData();

export default class PortfolioManager {
  constructor(userId) {
    this.userId = userId;
    this.cache = {};
    this.DEFAULT_STOCK_DATA = {
      currentPrice: 0,
      highPrice: 0,
      lowPrice: 0,
      openPrice: 0,
      previousClose: 0,
      percentageChange: 0,
      change: 0,
      timestamp: 0,
    };
  }

  validateField(key, value) {
    const zeroValidFields = ["change", "percentageChange"];

    if (value == null) return null;

    if (value === 0 && !zeroValidFields.includes(key)) {
      return null;
    }

    return value;
  }

  validateStockData(stock) {
    const validated = { ...stock };

    Object.keys(this.DEFAULT_STOCK_DATA).forEach((key) => {
      validated[key] = this.validateField(key, validated[key]);
    });

    return validated;
  }

  async loadPortfolio() {
    const portfolio = getUserPortfolio(this.userId);

    const fetchPromises = portfolio.map(async (position) => {
      try {
        const data = await stockData.getData(position.symbol);

        const merged = {
          ...position,
          ...this.DEFAULT_STOCK_DATA,
          ...data,
          ...this.computePositionValues(position, data.currentPrice),
          fetchFailed: false,
        };

        return this.validateStockData(merged);
      } catch (err) {
        console.error(`Failed to fetch ${position.symbol}:`, err);

        const merged = {
          ...position,
          ...this.DEFAULT_STOCK_DATA,
          fetchFailed: true,
        };

        return this.validateStockData(merged);
      }
    });

    const results = await Promise.all(fetchPromises);

    this.cache = results.reduce((acc, stock) => {
      acc[stock.symbol] = stock;
      return acc;
    }, {});

    return this.getPortfolio();
  }

  computePositionValues(position, currentPrice) {
    const marketValue = currentPrice * position.quantity;
    const costBasis = position.avgCost * position.quantity;
    const totalPnL = marketValue - costBasis;
    
    return { marketValue, costBasis, totalPnL };
  }

  getPortfolio() {
    return Object.values(this.cache);
  }

  getPosition(symbol) {
    const cached = this.cache[symbol];
    if (cached) return cached;

    const portfolio = getUserPortfolio(this.userId);
    const position = portfolio.find((p) => p.symbol === symbol);

    if (!position) {
      throw new Error("Position does not exist");
    }

    return position;
  }

  setPosition(symbol, quantity, avgCost, companyName) {
    if (!symbol || quantity == null || avgCost == null || !companyName) {
      throw new Error("Invalid position data");
    }

    const portfolio = getUserPortfolio(this.userId);

    const existingIndex = portfolio.findIndex((p) => p.symbol === symbol);

    if (existingIndex > -1) {
      portfolio[existingIndex] = { symbol, quantity, avgCost, companyName };
    } else {
      portfolio.push({ symbol, quantity, avgCost, companyName });
    }

    setUserPortfolio(this.userId, portfolio);

    if (this.cache[symbol]) {
      this.cache[symbol] = {
        ...this.cache[symbol],
        quantity,
        avgCost,
        companyName,
      };
    } else {
      this.cache[symbol] = {
        symbol,
        quantity,
        avgCost,
        companyName,
      };
    }
  }

  removePosition(symbol) {
    let portfolio = getUserPortfolio(this.userId);
    portfolio = portfolio.filter((p) => p.symbol !== symbol);
    setUserPortfolio(this.userId, portfolio);

    delete this.cache[symbol];
  }

  getPortfolioSummary() {
    const cache = this.cache || {};

    let totalValue = 0;
    let totalCost = 0;

    for (const stock of Object.values(cache)) {
      if (stock.currentPrice == null) continue;

      totalValue += stock.currentPrice * stock.quantity;
      totalCost += stock.avgCost * stock.quantity;
    }

    const totalPnL = totalValue - totalCost;
    const returnPercentage =
      totalCost === 0 ? null : (totalPnL / totalCost) * 100;

    return [
      { label: "Total Value", value: totalValue },
      { label: "Total Cost", value: totalCost },
      { label: "PnL", value: totalPnL },
      { label: "Return %", value: returnPercentage },
    ];
  }

  async refreshPortfolio() {
    await this.loadPortfolio();
    return this.getPortfolioSummary();
  }

  async getStockDetails(symbol) {
    const portfolio = getUserPortfolio(this.userId);
    const position = portfolio.find((p) => p.symbol === symbol);

    if (!position) {
      throw new Error("Position does not exist in user portfolio");
    }

    let finnhubData = this.cache[symbol];

    if (!finnhubData) {
      try {
        const fetched = await stockData.getData(symbol);

        finnhubData = {
          ...position,
          ...fetched,
          fetchFailed: false,
        };

       // this.cache[symbol] = finnhubData;
      } catch (err) {
        console.error(`Finnhub fallback failed for ${symbol}:`, err);

        finnhubData = {
          ...this.DEFAULT_STOCK_DATA,
          fetchFailed: true,
        };
      }
    }

    const [profile, metrics, growth, quote, news] = await Promise.all([
      stockData.getStockProfile(symbol),
      stockData.getStockMetrics(symbol),
      stockData.getStockGrowth(symbol),
      stockData.getStockFMPQuote(symbol),
      stockData.getStockNews(symbol),
    ]);

    const computedValues =
      finnhubData.currentPrice != null
        ? this.computePositionValues(position, finnhubData.currentPrice)
        : {
          marketValue: 0,
          costBasis: 0,
          totalPnL: 0,
        };

    return {
      symbol,
      quantity: position.quantity,
      avgCost: position.avgCost,
      companyName: position.companyName,

      // Finnhub
      ...finnhubData,

      // FMP
      profile,
      metrics,
      growth,
      quote,

      // Derived (from single source of truth)
      ...computedValues,

      // News
      news,

      // Meta
      fetchFailed: finnhubData.fetchFailed || false,
    };
  }
}