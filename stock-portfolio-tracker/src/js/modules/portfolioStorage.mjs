const STORAGE_KEY = "portfolios";

// Safe JSON parse
function safeParse(data) {
  try {
    return JSON.parse(data);
  } catch (err) {
    console.error("Storage parse error:", err);
    return {};
  }
}

// Get all portfolios
export function getPortfolios() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) return {};

    const parsed = safeParse(raw);

    // Ensure we always return an object
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (err) {
    console.error("Storage read error:", err);
    return {};
  }
}

// Save all portfolios
export function savePortfolios(portfolios) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(portfolios));
  } catch (err) {
    console.error("Storage write error:", err);
  }
}

// Get a specific user's portfolio
export function getUserPortfolio(userId) {
  try {
    const portfolios = getPortfolios();
    return portfolios[userId] || [];
  } catch (err) {
    console.error("Storage user read error:", err);
    return [];
  }
}

// Set a specific user's portfolio
export function setUserPortfolio(userId, portfolio) {
  try {
    const portfolios = getPortfolios();

    portfolios[userId] = portfolio;

    savePortfolios(portfolios);
  } catch (err) {
    console.error("Storage user write error:", err);
  }
}
