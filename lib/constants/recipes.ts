/**
 * Crafting recipes for common items
 * Maps output items to their required materials
 */

export interface Recipe {
  output: string
  materials: Array<{
    itemId: string
    quantity: number
  }>
}

// Example recipes - expand as needed
export const CRAFTING_RECIPES: Record<string, Recipe> = {
  // T4 Soldier Helmet
  T4_HEAD_PLATE_SET1: {
    output: "T4_HEAD_PLATE_SET1",
    materials: [
      { itemId: "T4_METALBAR", quantity: 16 },
      { itemId: "T3_LEATHER", quantity: 8 },
    ],
  },
  // T5 Mercenary Jacket
  T5_ARMOR_LEATHER_SET1: {
    output: "T5_ARMOR_LEATHER_SET1",
    materials: [
      { itemId: "T5_LEATHER", quantity: 16 },
      { itemId: "T4_CLOTH", quantity: 8 },
    ],
  },
  // T6 Assassin Shoes
  T6_SHOES_LEATHER_SET1: {
    output: "T6_SHOES_LEATHER_SET1",
    materials: [
      { itemId: "T6_LEATHER", quantity: 16 },
      { itemId: "T5_METALBAR", quantity: 8 },
    ],
  },
}

/**
 * Refining recipes mapping raw resources to refined materials
 */
export const REFINING_RECIPES: Record<string, Recipe> = {
  // Copper Bar
  T2_METALBAR: {
    output: "T2_METALBAR",
    materials: [{ itemId: "T2_ORE", quantity: 2 }],
  },
  // Bronze Bar
  T3_METALBAR: {
    output: "T3_METALBAR",
    materials: [
      { itemId: "T3_ORE", quantity: 2 },
      { itemId: "T2_METALBAR", quantity: 1 },
    ],
  },
  // Steel Bar
  T4_METALBAR: {
    output: "T4_METALBAR",
    materials: [
      { itemId: "T4_ORE", quantity: 2 },
      { itemId: "T3_METALBAR", quantity: 1 },
    ],
  },
  // Leather
  T3_LEATHER: {
    output: "T3_LEATHER",
    materials: [{ itemId: "T3_HIDE", quantity: 2 }],
  },
  T4_LEATHER: {
    output: "T4_LEATHER",
    materials: [
      { itemId: "T4_HIDE", quantity: 2 },
      { itemId: "T3_LEATHER", quantity: 1 },
    ],
  },
  // Cloth
  T3_CLOTH: {
    output: "T3_CLOTH",
    materials: [{ itemId: "T3_FIBER", quantity: 2 }],
  },
  T4_CLOTH: {
    output: "T4_CLOTH",
    materials: [
      { itemId: "T4_FIBER", quantity: 2 },
      { itemId: "T3_CLOTH", quantity: 1 },
    ],
  },
}

/**
 * Gets the crafting recipe for a specific item
 */
export function getCraftingRecipe(itemId: string, tier: number): (Recipe & { baseReturnRate: number }) | null {
  // Try exact match first
  const exactKey = `T${tier}_${itemId}`
  if (CRAFTING_RECIPES[exactKey]) {
    return {
      ...CRAFTING_RECIPES[exactKey],
      baseReturnRate: 0.15, // 15% base return rate for crafting
    }
  }

  // Try without tier prefix (for base item IDs)
  if (CRAFTING_RECIPES[itemId]) {
    return {
      ...CRAFTING_RECIPES[itemId],
      baseReturnRate: 0.15,
    }
  }

  // Generate a default recipe based on tier if no specific recipe exists
  // This is a fallback for items we haven't defined yet
  return {
    output: exactKey,
    materials: [
      { itemId: `T${tier}_METALBAR`, quantity: 16 },
      { itemId: `T${Math.max(2, tier - 1)}_LEATHER`, quantity: 8 },
    ],
    baseReturnRate: 0.15,
  }
}

/**
 * Gets the refining recipe for a specific material
 */
export function getRefiningRecipe(itemId: string): (Recipe & { baseReturnRate: number }) | null {
  if (REFINING_RECIPES[itemId]) {
    return {
      ...REFINING_RECIPES[itemId],
      baseReturnRate: 0.432, // 43.2% base return rate for refining
    }
  }

  return null
}
