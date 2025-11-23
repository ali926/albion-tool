import axios from "axios";
import cache from "./cache.js";

const API_URL = "https://west.albion-online-data.com/api/v2/stats/prices";

export async function fetchMarketPrices(itemList, cityList) {
  const cacheKey = `prices_${itemList.join(",")}_${cityList.join(",")}`;

  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const url = `${API_URL}/${itemList.join(",")}?locations=${cityList.join(",")}`;

  const { data } = await axios.get(url);

  cache.set(cacheKey, data);
  return data;
}
