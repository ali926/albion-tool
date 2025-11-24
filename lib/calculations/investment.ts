import { fetchPrices } from "../api/albion-data"
import { buildItemId } from "../api/item-helpers"
import { getCraftingRecipe } from "../constants/recipes"
import type { City, Tier, Enchantment } from "@/types/albion"

export interface InvestmentOption {
  itemName: string
  itemId: string
  tier: Tier
  enchantment: Enchantment
  city: City
  costPerUnit: number
  quantity: number
  totalCost: number
  profitPerUnit: number
  totalProfit: number
  roi: number
  type: "crafting" | "refining" | "flipping" | "bm-flip"
}

/**
 * Calculate best investment options for a given amount of silver
 */
export async function calculateInvestmentOptions(
  availableSilver: number,
  type: "crafting" | "refining" | "flipping" | "bm-flip",
  options: {
    tiers?: Tier[]
    cities?: City[]
  } = {},
): Promise<InvestmentOption[]> {
  const { tiers = [4, 5, 6, 7, 8], cities = ["Caerleon", "Martlock", "Lymhurst"] } = options

  const results: InvestmentOption[] = []

  // For crafting investment calculations
  if (type === "crafting") {
    // Example calculation for a few items
    const exampleItems = [
      { id: "T5_BAG", name: "Journeyman's Bag" },
      { id: "T6_SHOES_CLOTH_SET1", name: "Adept's Scholar Sandals" },
      { id: "T7_2H_ARCANESTAFF", name: "Expert's Enigmatic Staff" },
    ]

    for (const item of exampleItems) {
      for (const tier of tiers) {
        const itemId = buildItemId(item.id, tier, 0)
        const recipe = getCraftingRecipe(item.id, tier)

        if (!recipe) continue

        for (const city of cities) {
          try {
            const allIds = [itemId, ...recipe.materials.map((m) => m.itemId)]
            const prices = await fetchPrices({
              itemIds: allIds,
              cities: [city],
              qualities: [1],
            })

            const outputPrice = prices.find((p) => p.item_id === itemId)
            if (!outputPrice || outputPrice.sell_price_min === 0) continue

            let materialCost = 0
            for (const mat of recipe.materials) {
              const matPrice = prices.find((p) => p.item_id === mat.itemId)
              if (!matPrice || matPrice.buy_price_max === 0) {
                materialCost = 0
                break
              }
              materialCost += matPrice.buy_price_max * mat.quantity
            }

            if (materialCost === 0) continue

            const craftingFee = 500 * tier
            const costPerUnit = materialCost + craftingFee
            const sellPrice = outputPrice.sell_price_min * 0.955 // After tax

            const profitPerUnit = sellPrice - costPerUnit
            const quantity = Math.floor(availableSilver / costPerUnit)

            if (quantity === 0) continue

            results.push({
              itemName: item.name,
              itemId,
              tier,
              enchantment: 0,
              city,
              costPerUnit: Math.round(costPerUnit),
              quantity,
              totalCost: Math.round(costPerUnit * quantity),
              profitPerUnit: Math.round(profitPerUnit),
              totalProfit: Math.round(profitPerUnit * quantity),
              roi: (profitPerUnit / costPerUnit) * 100,
              type: "crafting",
            })
          } catch (error) {
            console.error(`[v0] Error calculating investment for ${itemId}:`, error)
          }
        }
      }
    }
  }

  return results.sort((a, b) => b.totalProfit - a.totalProfit).slice(0, 20)
}

/**
 * Compare ROI across different investment amounts
 */
export function compareInvestmentAmounts(
  baseOption: InvestmentOption,
  amounts: number[],
): Array<{ amount: number; quantity: number; totalProfit: number; roi: number }> {
  return amounts.map((amount) => {
    const quantity = Math.floor(amount / baseOption.costPerUnit)
    const totalProfit = quantity * baseOption.profitPerUnit
    const roi = (totalProfit / amount) * 100

    return {
      amount,
      quantity,
      totalProfit: Math.round(totalProfit),
      roi,
    }
  })
}
