import type { Tier, Enchantment } from "@/types/albion"

/**
 * Common Albion item base IDs for crafting and refining
 */
export const ITEM_BASE_IDS = {
  // Ores
  COPPER: "ORE",
  TIN: "ORE",
  IRON: "ORE",
  // Bars
  COPPERBAR: "METALBAR",
  BRONZEBAR: "METALBAR",
  IRONBAR: "METALBAR",
  STEELBAR: "METALBAR",
  TITANIUMBAR: "METALBAR",
  // Leather
  RAWHIDE: "HIDE",
  LEATHER: "LEATHER",
  // Cloth
  COTTON: "FIBER",
  CLOTH: "CLOTH",
  // Wood
  ROUGHLOG: "WOOD",
  PLANKS: "PLANKS",
  // Stone
  ROUGHSTONE: "ROCK",
  STONE: "STONEBLOCK",
} as const

/**
 * Builds the full item ID for API requests
 */
export function buildItemId(category: string, tier: Tier, enchantment: Enchantment = 0): string {
  const enchantmentSuffix = enchantment > 0 ? `@${enchantment}` : ""
  return `T${tier}_${category}${enchantmentSuffix}`
}

/**
 * Parse item ID to extract tier and enchantment
 */
export function parseItemId(itemId: string): { tier: number; enchantment: number; baseId: string } {
  const tierMatch = itemId.match(/T(\d+)/)
  const enchantmentMatch = itemId.match(/@(\d+)/)
  const baseId = itemId.replace(/T\d+_/, "").replace(/@\d+/, "")

  return {
    tier: tierMatch ? Number.parseInt(tierMatch[1]) : 4,
    enchantment: enchantmentMatch ? Number.parseInt(enchantmentMatch[1]) : 0,
    baseId,
  }
}
