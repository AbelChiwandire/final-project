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
    const marketValue = currentPrice != null && Number.isFinite(currentPrice)
      ? currentPrice * position.quantity
      : null;

    const costBasis = position.avgCost != null && Number.isFinite(position.avgCost)
      ? position.avgCost * position.quantity
      : null;

    const totalPnL = marketValue != null && costBasis != null
      ? marketValue - costBasis
      : null;

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
          marketValue: null,
          costBasis: null,
          totalPnL: null,
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

  getAAPL() {
    const appleData = {
    symbol: "AAPL",
    quantity: 10,
    avgCost: 150,
    currentPrice: 260.48,
    change: -0.01,
    percentageChange: -0.0038,
    highPrice: 262.19,
    lowPrice: 259.023123,
    openPrice: 259.98,
    previousClose: 260.49,
    timestamp: 1775851200,
    fetchFailed: false,
    profile: {
      companyName: "Apple Inc.",
      logo: "https://financialmodelingprep.com",
      website: "https://apple.com",
      sector: "Technology",
      beta: 1.109,
      marketCap: 3828515423772
    },
    metrics: {
      grossMargin: 0.4690516410716045,
      peRatio: 34.092882867601105,
      dividendYield: 0.004038238951672435,
      debtEquity: 1.5241072518411023
    },
    growth: {
      revenueGrowth: 0.0642551178283274
    },
    quote: {
      yearHigh: 288.62,
      yearLow: 189.81
    },
    marketValue: 2604.8, // Calculated: quantity * currentPrice
    costBasis: 1500,     // Calculated: quantity * avgCost
    totalPnL: 1104.8,    // Calculated: marketValue - costBasis
    news: [
      {
        headline: "TSMC’s Record Q1 AI Revenue Puts Capex And Growth In Focus",
        summary: "TSMC (NYSE:TSM) reported preliminary Q1 2026 results showing record revenue growth...",
        source: "Yahoo",
        datetime: 1775977737,
        url: "https://finnhub.io",
        image: "https://yimg.com"
      },
      {
        headline: "2.5 Billion Reasons Apple Might Be the Best Artificial Intelligence (AI) Stock to Buy Today",
        summary: "Apple may not be falling behind in AI after all.",
        source: "Yahoo",
        datetime: 1775943540,
        url: "https://finnhub.io",
        image: "https://yimg.com"
      },
      {
        headline: "Gary Black Says Tesla's 8-Week Slide Driven By 'Disappointing' Deliveries, Robotaxi Doubts...",
        summary: "Investor Gary Black, who is a managing partner at The Future Fund LLC, has outlined...",
        source: "Yahoo",
        datetime: 1775935869,
        url: "https://finnhub.io",
        image: "https://yimg.com"
      },
      {
        headline: "Japan Bets $16 Billion to Propel Rapidus in Global AI Chip Race",
        summary: "(Bloomberg) -- Japan approved ¥631.5 billion ($4 billion) in additional subsidies...",
        source: "Yahoo",
        datetime: 1775906706,
        url: "https://finnhub.io",
        image: "https://yimg.com"
      },
      {
        headline: "VTSAX vs VOO ETF: Which Vanguard Fund Should You Buy in 2026?",
        summary: "For investors seeking low-cost U.S. stock market exposure, two Vanguard funds dominate...",
        source: "Yahoo",
        datetime: 1775905797,
        url: "https://finnhub.io",
        image: "https://yimg.com"
      },
      {
        headline: "After A Chaotic Q1, I'm Buying XLK And XLC As The Market Exhales",
        summary: "XLK outlook: why tech remains a buy despite Q1 volatility.",
        source: "SeekingAlpha",
        datetime: 1775897100,
        url: "https://finnhub.io",
        image: "https://seekingalpha.com"
      },
      {
        headline: "Potential $5,000 Monthly Income: 12 Investments To Buy And Hold For The Next 10 Years",
        summary: "Diversified hands-off retirement portfolio: 12 funds targeting 6% yield + 6% dividend growth.",
        source: "SeekingAlpha",
        datetime: 1775895000,
        url: "https://finnhub.io",
        image: "https://seekingalpha.com"
      },
      {
        headline: "Anthropic, OpenAI And Big Tech's 'Number One Goal' Is To Kill OpenClaw...",
        summary: "Jason Calacanis says competitors are racing to overtake OpenClaw...",
        source: "Benzinga",
        datetime: 1775881740,
        url: "https://finnhub.io",
        image: "https://benzinga.com"
      }
    ]
  };

    return appleData;
  }
}