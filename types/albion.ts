// Core types for Albion Online tools

export type City = "Bridgewatch" | "Caerleon" | "Fort Sterling" | "Lymhurst" | "Martlock" | "Thetford" | "Black Market"

export type Tier = 2 | 3 | 4 | 5 | 6 | 7 | 8

export type Enchantment = 0 | 1 | 2 | 3 | 4

export type Quality = 1 | 2 | 3 | 4 | 5

// API Response types
export interface PriceData {
  item_id: string
  city: City
  quality: Quality
  sell_price_min: number
  sell_price_max: number
  buy_price_min: number
  buy_price_max: number
  updated_at: string
}

export interface ItemData {
  itemId: string
  name: string
  tier: Tier
  enchantment: Enchantment
}

// Crafting types
export interface CraftingMaterial {
  itemId: string
  quantity: number
}

export interface CraftingRecipe {
  outputItemId: string
  materials: CraftingMaterial[]
  baseReturnRate: number // Base percentage of materials returned
}

export interface CraftingCalculation {
  itemId: string
  materialCosts: number
  craftingFee: number
  outputValue: number
  profit: number
  profitPercentage: number
}

// Refining types
export interface RefiningRecipe {
  outputItemId: string
  inputItemId: string
  inputQuantity: number
  outputQuantity: number
  baseReturnRate: number
}

export interface RefiningCalculation {
  outputItemId: string
  inputCost: number
  refiningFee: number
  outputValue: number
  profit: number
  profitPercentage: number
}

// Price history types for tracking trends
export interface PriceHistoryData {
  item_id: string
  location: City
  quality: Quality
  data: PriceHistoryPoint[]
}

export interface PriceHistoryPoint {
  timestamp: string
  avg_price: number
  item_count: number
}

export interface PriceChange {
  current: number
  previous: number
  change: number
  changePercent: number
  trend: "up" | "down" | "stable"
}
