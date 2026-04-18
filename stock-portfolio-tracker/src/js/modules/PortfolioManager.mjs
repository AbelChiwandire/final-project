import { getUserPortfolio, setUserPortfolio } from "./storage.mjs";
import StockData from "./../api/StockData.mjs";

const stockData = new StockData();

export default class PortfolioManager {
  constructor(userId = null) {
    this._userId = userId;
    this.cache = {};
    this.hasLoaded = false;
    this.isRefreshing = false;
    this.detailsCache = {};
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

  set userId(newUserId) {
    // Reset loading state when user changes
    if (this._userId !== newUserId) {
      this.hasLoaded = false;
      this.cache = {};
      this.detailsCache = {};
      this.fmpCache = {};
    }
    this._userId = newUserId;
  }

  get userId() {
    return this._userId;
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

  async loadPortfolio(force = false) {
    if (this.hasLoaded && !force) {
      return this.getPortfolio();
    }

    const portfolio = getUserPortfolio(this.userId);

    const fetchPromises = portfolio.map(async (position) => {
      try {
        const response = await stockData.getData(position.symbol);
        const data = response?.data || response;

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

    this.hasLoaded = true;
    return this.getPortfolio();
  }

  computePositionValues(position, currentPrice) {
    const marketValue =
      currentPrice != null && Number.isFinite(currentPrice)
        ? currentPrice * position.quantity
        : null;

    const costBasis =
      position.avgCost != null && Number.isFinite(position.avgCost)
        ? position.avgCost * position.quantity
        : null;

    const totalPnL =
      marketValue != null && costBasis != null ? marketValue - costBasis : null;

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
      { label: "Total Value", value: totalValue, type: "currency" },
      { label: "Total Cost", value: totalCost, type: "currency" },
      { label: "Total PnL", value: totalPnL, type: "currency" },
      { label: "Return %", value: returnPercentage, type: "percent" },
    ];
  }

  async validateSymbol(symbol) {
    return await stockData.validateSymbol(symbol);
  }

  async refreshPortfolio() {
    if (this.isRefreshing) return;

    this.isRefreshing = true;

    try {
      await this.loadPortfolio(true);

      // clear details cache so FMP refetches
      this.detailsCache = {};

      return this.getPortfolioSummary();
    } finally {
      this.isRefreshing = false;
    }
  }

  getRefreshState() {
    return this.isRefreshing;
  }

  async getStockDetails(symbol, force = false) {
    if (this.detailsCache[symbol] && !force) {
      return this.detailsCache[symbol];
    }

    const portfolio = getUserPortfolio(this.userId);
    const position = portfolio.find((p) => p.symbol === symbol);

    if (!position) {
      throw new Error("Position does not exist in user portfolio");
    }

    let finnhubData = this.cache[symbol];

    if (!finnhubData || force) {
      try {
        const fetched = await stockData.getData(symbol);

        finnhubData = {
          ...position,
          ...this.DEFAULT_STOCK_DATA,
          ...(fetched?.data || {}),
          fetchFailed: false,
        };

        this.cache[symbol] = finnhubData;
      } catch (err) {
        console.error(`Finnhub fallback failed for ${symbol}:`, err);

        finnhubData = {
          ...position,
          ...this.DEFAULT_STOCK_DATA,
          fetchFailed: true,
        };
      }
    }

    // Ensure FMP cache container exists
    if (!this.fmpCache) {
      this.fmpCache = {};
    }

    if (!this.fmpCache[symbol] || force) {
      const safeFetch = async (fn, fallback) => {
        try {
          const result = await fn();
          return result?.data ?? fallback;
        } catch {
          return fallback;
        }
      };

      const [profile, metrics, growth, quote, news] = await Promise.all([
        safeFetch(() => stockData.getStockProfile(symbol), {}),
        safeFetch(() => stockData.getStockMetrics(symbol), {}),
        safeFetch(() => stockData.getStockGrowth(symbol), {}),
        safeFetch(() => stockData.getStockFMPQuote(symbol), {}),
        safeFetch(() => stockData.getStockNews(symbol), []),
      ]);

      this.fmpCache[symbol] = {
        profile,
        metrics,
        growth,
        quote,
        news,
      };
    }

    const { profile, metrics, growth, quote, news } = this.fmpCache[symbol];

    const computedValues =
      finnhubData.currentPrice != null
        ? this.computePositionValues(position, finnhubData.currentPrice)
        : {
            marketValue: null,
            costBasis: null,
            totalPnL: null,
          };

    const result = {
      symbol,
      quantity: position.quantity,
      avgCost: position.avgCost,
      companyName: position.companyName,

      ...this.validateStockData(finnhubData),

      profile,
      metrics,
      growth,
      quote,

      ...computedValues,

      news,
      fetchFailed: finnhubData.fetchFailed || false,
    };

    this.detailsCache[symbol] = result;

    return result;
  }
}
