/**
 * scripts/generate_item_files.js
 *
 * Loads src/utils/items.js (the optimized generator you already have),
 * generates two JSON files:
 *  - src/data/craftableItems.json  (only craftable categories)
 *  - src/data/allItems.json        (craftables + resources + common items)
 *
 * Usage: node scripts/generate_item_files.js
 */

import fs from "fs";
import path from "path";

// adjust path if your items util lives elsewhere:
import itemsUtil from "../src/utils/items.js";

const OUT_DIR = path.join(process.cwd(), "src", "data");
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

function writeJson(filename, obj) {
  fs.writeFileSync(path.join(OUT_DIR, filename), JSON.stringify(obj, null, 2), "utf8");
  console.log("Wrote", filename);
}

/**
 * Strategy (Optimized B):
 *  - craftableItems.json:
 *      include categories: WEAPONS_1H, WEAPONS_2H, RANGED, ARMOR, CRAFTED
 *      tiers: T3-T8 (lower tiers less useful for profit calc)
 *      enchants: 0..4
 *
 *  - allItems.json:
 *      include craftables above + RESOURCES + TOOLS
 *      keep tiers: resources T1-T5, gear T3-T8
 *      enchants: 0..4 for gear
 */

// craftable categories
const CRAFT_CATS = ["WEAPONS_1H", "WEAPONS_2H", "RANGED", "ARMOR", "CRAFTED"];

// generate craftable items (map of id => meta)
const craftMap = itemsUtil.generateAllItemsObject({
  categories: CRAFT_CATS,
  // filter tiers to T3-T8 for craftables
  tierFilter: (t) => t >= 3 && t <= 8,
  // enchants 0-4
  enchantFilter: (e) => e >= 0 && e <= 4
});

// allItems categories (craftables + resources + tools)
const ALL_CATS = ["WEAPONS_1H", "WEAPONS_2H", "RANGED", "ARMOR", "CRAFTED", "RESOURCES", "TOOLS"];
const allMap = itemsUtil.generateAllItemsObject({
  categories: ALL_CATS,
  // gear tiers T3-T8, resources T1-T5 (the generator respects per-category tiers)
  tierFilter: (t) => t >= 1 && t <= 8,
  enchantFilter: (e) => e >= 0 && e <= 4
});

// Convert both to arrays for easier scanning in client code (you can switch to object if you prefer)
const craftArray = Object.entries(craftMap).map(([id, meta]) => ({ id, ...meta }));
const allArray = Object.entries(allMap).map(([id, meta]) => ({ id, ...meta }));

// Save files
writeJson("craftableItems.json", craftArray);
writeJson("allItems.json", allArray);

// Print quick preview counts
console.log("Craftable items count:", craftArray.length);
console.log("All items count:", allArray.length);

// Print first 20 craftable items as a preview
console.log("Preview (first 20 craftable items):");
console.log(craftArray.slice(0, 20).map(i => i.id).join(", "));
