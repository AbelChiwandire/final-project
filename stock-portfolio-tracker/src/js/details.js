import { loadHeaderFooter } from "./modules/utils.mjs";
import StockData from "./api/StockData.mjs";

loadHeaderFooter();

const stock = new StockData();
stock.getData("AAPL");

console.log("Detail page JS running");
