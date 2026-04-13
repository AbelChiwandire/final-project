const API_KEY = import.meta.env.VITE_FINNHUB_API_KEY;
const FMP_API_KEY = import.meta.env.VITE_FMP_API_KEY;
const FMP_BASE_URL = import.meta.env.VITE_FMP_BASE_URL;

export default class StockData {
  async convertToJson(res) {
    const jsonResponse = await res.json();
    if (res.ok) {
      return jsonResponse;
    } else {
      throw new Error(JSON.stringify(jsonResponse));
    }
  }

  async getData(symbol) {
    const response = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`,
    );
    const data = await this.convertToJson(response);
    const normalizedData = this.normalizeData(data);
    console.log(normalizedData);
    return normalizedData;
  }

   async getStockNews(symbol) {
    // Calculate date range (last 7 days)
    const toDate = new Date();
    const fromDate = new Date();
    fromDate.setDate(toDate.getDate() - 7);

    const formatDate = (date) => date.toISOString().split("T")[0];

    const url = `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${formatDate(fromDate)}&to=${formatDate(toDate)}&token=${API_KEY}`;

    try {
      const response = await fetch(url);

      const data = await this.convertToJson(response);

      if (!data || data.length === 0) return [];

      // Take first 8 articles, no sorting
      const limited = data.slice(0, 8);

      // Normalize
      return limited.map(article => ({
        headline: article.headline || "",
        summary: article.summary || null,
        source: article.source || "",
        datetime: article.datetime || null,
        url: article.url || "",
        image: article.image || null
      }));

    } catch (error) {
      console.error("Error fetching stock news:", error);
      return [];
    }
  }

  async getStockProfile(symbol) {
    try {
      const response = await fetch(
        `${FMP_BASE_URL}/profile?symbol=${symbol}&apikey=${FMP_API_KEY}`
      );

      const data = await this.convertToJson(response);

      if (!data || data.length === 0) return null;

      const item = data[0];

      return {
        companyName: item.companyName,
        logo: item.image,
        website: item.website,
        sector: item.sector,
        beta: item.beta,
        marketCap: item.marketCap
      };
    } catch (error) {
      console.error("Error fetching stock profile:", error);
      return null;
    }
  }
  
  async getStockMetrics(symbol) {
    try {
      const response = await fetch(
        `${FMP_BASE_URL}/ratios?symbol=${symbol}&apikey=${FMP_API_KEY}`
      );

      const data = await this.convertToJson(response);

      if (!data || data.length === 0) return null;

      const item = data[0];

      return {
        grossMargin: item.grossProfitMargin,
        peRatio: item.priceToEarningsRatio,
        dividendYield: item.dividendYield,
        debtEquity: item.debtToEquityRatio,
      };
    } catch (error) {
      console.error("Error fetching stock metrics:", error);
      return null;
    }
  }

  async getStockFMPQuote(symbol) {
    try {
      const response = await fetch(
        `${FMP_BASE_URL}/quote?symbol=${symbol}&apikey=${FMP_API_KEY}`
      );

      const data = await this.convertToJson(response);

      if (!data || data.length === 0) return null;

      const item = data[0];

      return {
        yearHigh: item.yearHigh,
        yearLow: item.yearLow
      };
    } catch (error) {
      console.error("Error fetching stock quote:", error);
      return null;
    }
  }

  async getStockGrowth(symbol) {
    try {
      const response = await fetch(
        `${FMP_BASE_URL}/financial-growth?symbol=${symbol}&apikey=${FMP_API_KEY}`
      );
      
      const data = await this.convertToJson(response);

      if (!data || data.length === 0) return null;

      const item = data[0];

      return {
        revenueGrowth: item.revenueGrowth,
      };
    } catch (error) {
      console.error("Error fetching stock growth data:", error);
      return null;
    }
  }  

  normalizeData(object) {
    if (!object) return {};
    return Object.keys(object).reduce((normalized, key) => {
      const value = object[key];
      if (value == null) return normalized; // minimal validation
      switch (key) {
        case "c":
          normalized.currentPrice = value;
          break;
        case "d":
          normalized.change = value;
          break;
        case "dp":
          normalized.percentageChange = value;
          break;
        case "h":
          normalized.highPrice = value;
          break;
        case "l":
          normalized.lowPrice = value;
          break;
        case "o":
          normalized.openPrice = value;
          break;
        case "pc":
          normalized.previousClose = value;
          break;
        case "t":
          normalized.timestamp = value;
          break;
      }
      return normalized;
    }, {});
  }
}
