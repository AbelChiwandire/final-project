const API_KEY = import.meta.env.VITE_FINNHUB_API_KEY;

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
