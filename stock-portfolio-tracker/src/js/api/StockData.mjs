const API_KEY = import.meta.env.VITE_FINNHUB_API_KEY;
const FMP_API_KEY = import.meta.env.VITE_FMP_API_KEY;
const FMP_BASE_URL = import.meta.env.VITE_FMP_BASE_URL;

export default class StockData {
  async convertToJson(res) {
    const jsonResponse = await res.json();
    if (res.ok) return jsonResponse;
    throw new Error(JSON.stringify(jsonResponse));
  }

  // ---------------------------
  // FALLBACK SHAPES
  // ---------------------------

  getEmptyQuote() {
    return {
      currentPrice: null,
      change: null,
      percentageChange: null,
      highPrice: null,
      lowPrice: null,
      openPrice: null,
      previousClose: null,
      timestamp: null,
    };
  }

  getEmptyProfile() {
    return {
      companyName: null,
      logo: null,
      website: null,
      sector: null,
      beta: null,
      marketCap: null,
    };
  }

  getEmptyMetrics() {
    return {
      grossMargin: null,
      peRatio: null,
      dividendYield: null,
      debtEquity: null,
    };
  }

  getEmptyQuoteFMP() {
    return {
      yearHigh: null,
      yearLow: null,
    };
  }

  getEmptyGrowth() {
    return {
      revenueGrowth: null,
    };
  }

  getEmptyNews() {
    return [];
  }

  // ---------------------------
  // DATA FETCHING
  // ---------------------------

  async validateSymbol(symbol) {
    console.log("StockData.validateSymbol called with:", symbol);
    console.log("API_KEY available:", !!API_KEY);

    try {
      const response = await fetch(
        `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`,
      );

      console.log("Response status:", response.status, response.ok);

      if (!response.ok) {
        console.log("Response not ok, checking status code");
        // Handle different HTTP status codes with specific error messages
        if (response.status === 401) {
          return { valid: false, error: "API configuration error - please check API key" };
        } else if (response.status === 403) {
          return { valid: false, error: "API access forbidden - please check API key" };
        } else if (response.status === 429) {
          return { valid: false, error: "API rate limit exceeded - please try again later" };
        } else if (response.status >= 500) {
          return { valid: false, error: "Service temporarily unavailable - please try again later" };
        } else {
          return { valid: false, error: "Unable to validate symbol - please refresh and try again" };
        }
      }

      const data = await this.convertToJson(response);
      console.log("API response data:", data);

      // Check if the response contains valid data
      // Finnhub returns null values for invalid symbols
      if (data.c === null && data.h === null && data.l === null) {
        console.log("All values are null, symbol is invalid");
        return { valid: false, error: "Invalid stock symbol" };
      }

      // Additional check: if current price is 0 or null, it's likely invalid
      if (data.c === 0 || data.c === null) {
        console.log("Current price is 0 or null, symbol likely invalid");
        return { valid: false, error: "Invalid stock symbol" };
      }

      console.log("Symbol validation passed");
      return { valid: true };
    } catch (error) {
      console.error("Error validating symbol:", error);

      // Distinguish between network errors and other errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        return { valid: false, error: "Network error - please check connection and try again" };
      } else if (error.name === 'AbortError') {
        return { valid: false, error: "Request timed out - please refresh and try again" };
      } else {
        return { valid: false, error: "Unable to validate symbol - please refresh and try again" };
      }
    }
  }

  async getData(symbol) {
    try {
      const response = await fetch(
        `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`,
      );

      const data = await this.convertToJson(response);
      const normalized = this.normalizeData(data);

      return {
        status: "success",
        data: { ...this.getEmptyQuote(), ...normalized },
      };
    } catch (error) {
      console.error("Error fetching quote:", error);
      return {
        status: "error",
        data: this.getEmptyQuote(),
      };
    }
  }

  async getStockNews(symbol) {
    const toDate = new Date();
    const fromDate = new Date();
    fromDate.setDate(toDate.getDate() - 7);

    const formatDate = (date) => date.toISOString().split("T")[0];

    const url = `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${formatDate(fromDate)}&to=${formatDate(toDate)}&token=${API_KEY}`;

    try {
      const response = await fetch(url);
      const data = await this.convertToJson(response);

      if (!data || data.length === 0) {
        return { status: "error", data: this.getEmptyNews() };
      }

      const limited = data.slice(0, 8);

      return {
        status: "success",
        data: limited.map((article) => ({
          headline: article.headline || "",
          summary: article.summary || null,
          source: article.source || "",
          datetime: article.datetime || null,
          url: article.url || "",
          image: article.image || null,
        })),
      };
    } catch (error) {
      console.error("Error fetching stock news:", error);
      return {
        status: "error",
        data: this.getEmptyNews(),
      };
    }
  }

  async getStockProfile(symbol) {
    try {
      const response = await fetch(
        `${FMP_BASE_URL}/profile?symbol=${symbol}&apikey=${FMP_API_KEY}`,
      );

      const data = await this.convertToJson(response);

      if (!data || data.length === 0) {
        return { status: "error", data: this.getEmptyProfile() };
      }

      const item = data[0];

      return {
        status: "success",
        data: {
          ...this.getEmptyProfile(),
          companyName: item.companyName ?? null,
          logo: item.image ?? null,
          website: item.website ?? null,
          sector: item.sector ?? null,
          beta: item.beta ?? null,
          marketCap: item.marketCap ?? null,
        },
      };
    } catch (error) {
      console.error("Error fetching stock profile:", error);
      return {
        status: "error",
        data: this.getEmptyProfile(),
      };
    }
  }

  async getStockMetrics(symbol) {
    try {
      const response = await fetch(
        `${FMP_BASE_URL}/ratios?symbol=${symbol}&apikey=${FMP_API_KEY}`,
      );

      const data = await this.convertToJson(response);

      if (!data || data.length === 0) {
        return { status: "error", data: this.getEmptyMetrics() };
      }

      const item = data[0];

      return {
        status: "success",
        data: {
          ...this.getEmptyMetrics(),
          grossMargin: item.grossProfitMargin ?? null,
          peRatio: item.priceToEarningsRatio ?? null,
          dividendYield: item.dividendYield ?? null,
          debtEquity: item.debtToEquityRatio ?? null,
        },
      };
    } catch (error) {
      console.error("Error fetching stock metrics:", error);
      return {
        status: "error",
        data: this.getEmptyMetrics(),
      };
    }
  }

  async getStockFMPQuote(symbol) {
    try {
      const response = await fetch(
        `${FMP_BASE_URL}/quote?symbol=${symbol}&apikey=${FMP_API_KEY}`,
      );

      const data = await this.convertToJson(response);

      if (!data || data.length === 0) {
        return { status: "error", data: this.getEmptyQuoteFMP() };
      }

      const item = data[0];

      return {
        status: "success",
        data: {
          ...this.getEmptyQuoteFMP(),
          yearHigh: item.yearHigh ?? null,
          yearLow: item.yearLow ?? null,
        },
      };
    } catch (error) {
      console.error("Error fetching stock quote:", error);
      return {
        status: "error",
        data: this.getEmptyQuoteFMP(),
      };
    }
  }

  async getStockGrowth(symbol) {
    try {
      const response = await fetch(
        `${FMP_BASE_URL}/financial-growth?symbol=${symbol}&apikey=${FMP_API_KEY}`,
      );

      const data = await this.convertToJson(response);

      if (!data || data.length === 0) {
        return { status: "error", data: this.getEmptyGrowth() };
      }

      const item = data[0];

      return {
        status: "success",
        data: {
          ...this.getEmptyGrowth(),
          revenueGrowth: item.revenueGrowth ?? null,
        },
      };
    } catch (error) {
      console.error("Error fetching stock growth data:", error);
      return {
        status: "error",
        data: this.getEmptyGrowth(),
      };
    }
  }

  // ---------------------------
  // NORMALIZATION
  // ---------------------------

  normalizeData(object) {
    const base = this.getEmptyQuote();

    if (!object) return base;

    return {
      currentPrice: object.c ?? null,
      change: object.d ?? null,
      percentageChange: object.dp ?? null,
      highPrice: object.h ?? null,
      lowPrice: object.l ?? null,
      openPrice: object.o ?? null,
      previousClose: object.pc ?? null,
      timestamp: object.t ?? null,
    };
  }
}
