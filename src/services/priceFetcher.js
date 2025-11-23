import axios from "axios";
import { CITIES } from "../utils/cities.js";
import { cache } from "./cache.js";

const API_BASE = "https://europe.albion-online-data.com/api/v2/stats/prices";

export async function fetchItemPrice(itemId) {
    const url = `${API_BASE}/${itemId}?locations=${CITIES.join(",")}`;

    const { data } = await axios.get(url);
    return data;
}

export async function fetchMultiplePrices(itemIds) {
    const url = `${API_BASE}/${itemIds.join(",")}?locations=${CITIES.join(",")}`;

    const { data } = await axios.get(url);
    return data;
}

export async function updateAllPrices() {
    console.log("Refreshing all prices...");

    const items = Object.values(cache.get("items") || []);
    if (!items.length) return;

    for (const item of items) {
        const prices = await fetchItemPrice(item.id);
        cache.set(`price_${item.id}`, prices);
    }

    console.log("Price update complete.");
}

export function startAutoPriceUpdate() {
    setInterval(updateAllPrices, 1000 * 60 * 5); // 5 min
}
