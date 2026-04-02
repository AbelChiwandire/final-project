import { getUserPortfolio, setUserPortfolio } from "./portfolioStorage.mjs";
import StockData from "./../api/StockData.mjs";

const stockData = new StockData();

export default class PortfolioManager {
    constructor(userId) {
      this.userId = userId;
      this.cache = []; 
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

    // Field-level validation rules
    validateField(key, value) {
      const zeroValidFields = ["change", "percentageChange"];

      if (value == null) return null;

      if (value === 0 && !zeroValidFields.includes(key)) {
        return null;
      }

      return value;
    }

    // Apply validation across all stock fields
    validateStockData(stock) {
      const validated = { ...stock };

      Object.keys(this.DEFAULT_STOCK_DATA).forEach((key) => {
        validated[key] = this.validateField(key, validated[key]);
      });

      return validated;
    }

    // Load the user's portfolio, fetch current stock data, and cache it
    async loadPortfolio() {
      const portfolio = getUserPortfolio(this.userId);

      const fetchPromises = portfolio.map(async (position) => {
        try {
          const data = await stockData.getData(position.symbol);

          const merged = {
            ...position,
            ...this.DEFAULT_STOCK_DATA,
            ...data,
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

      this.cache = await Promise.all(fetchPromises);
      return this.cache;
    }

    // Get full cached portfolio
    getPortfolio() {
        return this.cache;
    }

    // Get a single stock's merged data from cache
    getStock(symbol) {
        return this.cache.find((s) => s.symbol === symbol) || null;
    }

    // Add or edit a stock in the portfolio
    setPosition(symbol, quantity, avgCost) {
        if (!symbol || quantity == null || avgCost == null) {
            throw new Error("Invalid position data");
        }

        const portfolio = getUserPortfolio(this.userId);

        const existingIndex = portfolio.findIndex((p) => p.symbol === symbol);

        if (existingIndex > -1) {
            portfolio[existingIndex] = { symbol, quantity, avgCost };
        } else {
            portfolio.push({ symbol, quantity, avgCost });
        }

        setUserPortfolio(this.userId, portfolio);

        const cachedIndex = this.cache.findIndex((s) => s.symbol === symbol);
        if (cachedIndex > -1) {
            this.cache[cachedIndex] = {
                ...this.cache[cachedIndex],
                quantity,
                avgCost,
            };
        } else {
            this.cache.push({ symbol, quantity, avgCost });
        }
    }

    // Remove a stock from portfolio and cache
    removePosition(symbol) {
        let portfolio = getUserPortfolio(this.userId);
        portfolio = portfolio.filter((p) => p.symbol !== symbol);
        setUserPortfolio(this.userId, portfolio);

        this.cache = this.cache.filter((s) => s.symbol !== symbol);
    }
}