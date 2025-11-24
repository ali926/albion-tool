import type { RefiningRecipe } from "@/types/albion"

export const RESOURCE_CATEGORIES = [
  { id: "ore", name: "Ore → Metal Bars" },
  { id: "hide", name: "Hide → Leather" },
  { id: "wood", name: "Wood → Planks" },
  { id: "fiber", name: "Fiber → Cloth" },
  { id: "stone", name: "Stone → Stone Blocks" },
] as const

export const REFINING_TIERS = [
  { tier: 2, name: "T2" },
  { tier: 3, name: "T3" },
  { tier: 4, name: "T4" },
  { tier: 5, name: "T5" },
  { tier: 6, name: "T6" },
  { tier: 7, name: "T7" },
  { tier: 8, name: "T8" },
] as const

export const CITY_BONUSES: Record<string, Record<string, number>> = {
  "Fort Sterling": { ore: 15, stone: 0, hide: 0, wood: 0, fiber: 0 },
  Lymhurst: { ore: 0, stone: 0, hide: 0, wood: 15, fiber: 0 },
  Bridgewatch: { ore: 0, stone: 15, hide: 0, wood: 0, fiber: 0 },
  Martlock: { ore: 0, stone: 0, hide: 0, wood: 0, fiber: 15 },
  Thetford: { ore: 0, stone: 0, hide: 15, wood: 0, fiber: 0 },
  Caerleon: { ore: 0, stone: 0, hide: 0, wood: 0, fiber: 0 },
}

// Base return rate without city bonuses
export const BASE_RETURN_RATE = 15.2

// Mock refining recipes (in reality, these would be fetched or more comprehensive)
export const REFINING_RECIPES: Record<string, RefiningRecipe> = {
  T4_ORE: {
    outputItemId: "T4_METALBAR",
    inputItemId: "T4_ORE",
    inputQuantity: 2,
    outputQuantity: 1,
    tier: 4,
    enchantment: 0,
  },
  T5_ORE: {
    outputItemId: "T5_METALBAR",
    inputItemId: "T5_ORE",
    inputQuantity: 2,
    outputQuantity: 1,
    tier: 5,
    enchantment: 0,
  },
  // Add more recipes as needed
}
