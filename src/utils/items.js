import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "src", "data", "allItems.json");

// Load JSON file once at startup
let allItems = [];

try {
    const raw = fs.readFileSync(filePath, "utf8");
    allItems = JSON.parse(raw);
} catch (err) {
    console.error("Failed to load allItems.json:", err);
}

export function getAllItems() {
    return allItems;
}

export function getCraftableItems() {
    return allItems.filter(i => i.isCraftable);
}

export function getItemById(id) {
    return allItems.find(i => i.id === id) || null;
}
