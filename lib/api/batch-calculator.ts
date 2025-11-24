import { fetchPrices } from "./albion-data"
import { buildItemId } from "./item-helpers"
import { CRAFTABLE_ITEMS, REFINABLE_RESOURCES, FLIPPABLE_ITEMS } from "../constants/items"
import { CITIES } from "../constants/cities"
import { getCraftingRecipe } from "../constants/recipes"
import type { City, Tier, Enchantment } from "@/types/albion"
import type { TopProfitItem } from "@/components/top-profits-table"

export interface BatchCalculationOptions {
  tiers?: Tier[]
  enchantments?: Enchantment[]
  cities?: City[]
  minProfit?: number
  minMargin?: number
  maxInvestment?: number
  useFocus?: boolean
  useJournal?: boolean
}

/**
 * Batch calculate crafting profits for all items
 */
export async function batchCalculateCrafting(options: BatchCalculationOptions = {}): Promise<TopProfitItem[]> {
  const {
    tiers = [4, 5, 6, 7, 8],
    enchantments = [0, 1],
    cities = CITIES,
    minProfit = 0,
    minMargin = 0,
    maxInvestment = Number.POSITIVE_INFINITY,
    useFocus = false,
    useJournal = false,
  } = options

  const results: TopProfitItem[] = []

  const allItemIds: string[] = []
  for (const item of CRAFTABLE_ITEMS) {
    for (const tier of tiers) {
      for (const enchantment of enchantments) {
        const itemId = buildItemId(item.id, tier, enchantment)
        allItemIds.push(itemId)

        const recipe = getCraftingRecipe(item.id, tier)
        if (recipe) {
          recipe.materials.forEach((mat) => {
            if (!allItemIds.includes(mat.itemId)) {
              allItemIds.push(mat.itemId)
            }
          })
        }
      }
    }
  }

  console.log("[v0] Fetching prices for", allItemIds.length, "items for crafting calculation")

  try {
    const allPrices = await fetchPrices({
      itemIds: allItemIds,
      cities,
      qualities: [1],
    })

    const priceMap = new Map<string, typeof allPrices>()
    for (const price of allPrices) {
      const key = `${price.item_id}-${price.city}`
      if (!priceMap.has(key)) {
        priceMap.set(key, [])
      }
      priceMap.get(key)!.push(price)
    }

    // Calculate profit for each item combination
    for (const item of CRAFTABLE_ITEMS) {
      for (const tier of tiers) {
        for (const enchantment of enchantments) {
          const itemId = buildItemId(item.id, tier, enchantment)
          const recipe = getCraftingRecipe(item.id, tier)

          if (!recipe) continue

          for (const city of cities) {
            const outputPriceKey = `${itemId}-${city}`
            const outputPrices = priceMap.get(outputPriceKey)

            if (!outputPrices || outputPrices.length === 0) continue

            const sellPrice = outputPrices[0].sell_price_min
            if (sellPrice === 0) continue

            let materialCost = 0
            let allMaterialsAvailable = true

            for (const material of recipe.materials) {
              const matPriceKey = `${material.itemId}-${city}`
              const matPrices = priceMap.get(matPriceKey)

              if (!matPrices || matPrices.length === 0) {
                allMaterialsAvailable = false
                break
              }

              const matBuyPrice = matPrices[0].buy_price_max
              if (matBuyPrice === 0) {
                allMaterialsAvailable = false
                break
              }

              materialCost += matBuyPrice * material.quantity
            }

            if (!allMaterialsAvailable) continue

            const craftingFee = 500 * tier * (1 + enchantment * 0.5)
            const totalCost = materialCost + craftingFee
            const profit = sellPrice * 0.955 - totalCost // Account for 4.5% tax
            const profitMargin = (profit / totalCost) * 100

            // Apply filters
            if (profit < minProfit) continue
            if (profitMargin < minMargin) continue
            if (totalCost > maxInvestment) continue

            results.push({
              itemName: item.name,
              itemId: item.id,
              tier,
              enchantment,
              city,
              profit: Math.round(profit),
              profitMargin,
              details: `${item.category}`,
            })
          }
        }
      }
    }

    console.log("[v0] Crafting calculation complete:", results.length, "profitable items found")
  } catch (error) {
    console.error("[v0] Error in batch crafting calculation:", error)
    throw error
  }

  // Sort by profit descending
  return results.sort((a, b) => b.profit - a.profit).slice(0, 50)
}

/**
 * Batch calculate refining profits for all resources
 */
export async function batchCalculateRefining(options: BatchCalculationOptions = {}): Promise<TopProfitItem[]> {
  const { tiers = [4, 5, 6, 7, 8], cities = CITIES, minProfit = 0, minMargin = 0, useFocus = false } = options

  const results: TopProfitItem[] = []

  const allItemIds: string[] = []
  for (const resource of REFINABLE_RESOURCES) {
    for (const tier of tiers) {
      const rawItemId = buildItemId(resource.id, tier, 0)
      const refinedItemId = buildItemId(resource.refined, tier, 0)
      allItemIds.push(rawItemId, refinedItemId)
    }
  }

  console.log("[v0] Fetching prices for", allItemIds.length, "items for refining calculation")

  try {
    const prices = await fetchPrices({
      itemIds: allItemIds,
      cities,
      qualities: [1],
    })

    // Group by city and item
    const pricesByCity = prices.reduce(
      (acc, price) => {
        if (!acc[price.city]) acc[price.city] = {}
        acc[price.city][price.item_id] = price
        return acc
      },
      {} as Record<string, any>,
    )

    for (const resource of REFINABLE_RESOURCES) {
      for (const tier of tiers) {
        const rawItemId = buildItemId(resource.id, tier, 0)
        const refinedItemId = buildItemId(resource.refined, tier, 0)

        for (const city of cities) {
          const cityPrices = pricesByCity[city]
          if (!cityPrices || !cityPrices[rawItemId] || !cityPrices[refinedItemId]) continue

          const rawPrice = cityPrices[rawItemId].buy_price_max
          const refinedPrice = cityPrices[refinedItemId].sell_price_min

          if (rawPrice === 0 || refinedPrice === 0) continue

          // Calculate profit with real return rates
          const cityBonus = getCityRefiningBonus(city, resource.category)
          const returnRate = useFocus ? 0.534 + cityBonus : 0.432 + cityBonus

          const rawCost = rawPrice * 2 // Most refining uses 2 raw resources
          const refiningFee = 500 * tier
          const output = refinedPrice * (1 + returnRate)

          const profit = output * 0.955 - rawCost - refiningFee
          const profitMargin = (profit / (rawCost + refiningFee)) * 100

          if (profit < minProfit) continue
          if (profitMargin < minMargin) continue

          results.push({
            itemName: resource.name,
            itemId: resource.id,
            tier,
            enchantment: 0,
            city,
            profit: Math.round(profit),
            profitMargin,
            details: resource.category,
          })
        }
      }
    }

    console.log("[v0] Refining calculation complete:", results.length, "profitable items found")
  } catch (error) {
    console.error("[v0] Error in batch refining calculation:", error)
    throw error
  }

  return results.sort((a, b) => b.profit - a.profit).slice(0, 50)
}

/**
 * Batch calculate BM flip profits
 */
export async function batchCalculateBMFlips(options: BatchCalculationOptions = {}): Promise<TopProfitItem[]> {
  const { tiers = [4, 5, 6, 7, 8], enchantments = [0, 1, 2], cities = CITIES, minProfit = 0, minMargin = 0 } = options

  const results: TopProfitItem[] = []

  const searchCities = Array.from(new Set([...cities, "Black Market"]))

  for (const item of FLIPPABLE_ITEMS) {
    for (const tier of tiers) {
      for (const enchantment of enchantments) {
        const itemId = buildItemId(item.id, tier, enchantment)

        try {
          const prices = await fetchPrices({
            itemIds: [itemId],
            cities: searchCities,
            qualities: [1],
          })

          const bmPrice = prices.find((p) => p.city === "Black Market")
          if (!bmPrice || bmPrice.sell_price_min === 0) continue

          for (const cityPrice of prices.filter((p) => p.city !== "Black Market")) {
            const buyPrice = cityPrice.buy_price_max
            if (buyPrice === 0) continue

            const bmSellPrice = bmPrice.sell_price_min
            const transportFee = 0 // User can add manually
            const tax = bmSellPrice * 0.15

            const profit = bmSellPrice - tax - buyPrice - transportFee
            const profitMargin = (profit / buyPrice) * 100

            if (profit < minProfit) continue
            if (profitMargin < minMargin) continue

            results.push({
              itemName: item.name,
              itemId: item.id,
              tier,
              enchantment,
              buyCity: cityPrice.city,
              profit: Math.round(profit),
              profitMargin,
              details: `${item.category}`,
            })
          }
        } catch (error) {
          console.error(`[v0] Error calculating BM flip ${itemId}:`, error)
        }
      }
    }
  }

  return results.sort((a, b) => b.profit - a.profit).slice(0, 50)
}

/**
 * Batch calculate city-to-city flip profits
 */
export async function batchCalculateFlips(options: BatchCalculationOptions = {}): Promise<TopProfitItem[]> {
  const { tiers = [4, 5, 6, 7, 8], enchantments = [0, 1], cities = CITIES, minProfit = 0, minMargin = 5 } = options

  const results: TopProfitItem[] = []

  for (const item of FLIPPABLE_ITEMS) {
    for (const tier of tiers) {
      for (const enchantment of enchantments) {
        const itemId = buildItemId(item.id, tier, enchantment)

        try {
          const prices = await fetchPrices({
            itemIds: [itemId],
            cities,
            qualities: [1],
          })

          // Find best buy and sell cities
          for (const buyPrice of prices) {
            for (const sellPrice of prices) {
              if (buyPrice.city === sellPrice.city) continue
              if (buyPrice.buy_price_max === 0 || sellPrice.sell_price_min === 0) continue

              const buy = buyPrice.buy_price_max
              const sell = sellPrice.sell_price_min
              const tax = sell * 0.045
              const transportFee = buy * 0.05 // 5% transport

              const profit = sell - tax - buy - transportFee
              const profitMargin = (profit / buy) * 100

              if (profit < minProfit) continue
              if (profitMargin < minMargin) continue

              results.push({
                itemName: item.name,
                itemId: item.id,
                tier,
                enchantment,
                buyCity: buyPrice.city,
                sellCity: sellPrice.city,
                profit: Math.round(profit),
                profitMargin,
                details: item.category,
              })
            }
          }
        } catch (error) {
          console.error(`[v0] Error calculating flip ${itemId}:`, error)
        }
      }
    }
  }

  return results.sort((a, b) => b.profit - a.profit).slice(0, 50)
}

// Helper function for city refining bonuses
function getCityRefiningBonus(city: City, resourceType: string): number {
  const bonuses: Record<City, Record<string, number>> = {
    "Fort Sterling": { Ore: 0.15, Fiber: 0, Hide: 0, Wood: 0, Stone: 0 },
    Lymhurst: { Ore: 0, Fiber: 0.15, Hide: 0, Wood: 0, Stone: 0 },
    Bridgewatch: { Ore: 0, Fiber: 0, Hide: 0.15, Wood: 0, Stone: 0 },
    Martlock: { Ore: 0, Fiber: 0, Hide: 0, Wood: 0.15, Stone: 0 },
    Thetford: { Ore: 0, Fiber: 0, Hide: 0, Wood: 0, Stone: 0.15 },
    Caerleon: { Ore: 0, Fiber: 0, Hide: 0, Wood: 0, Stone: 0 },
    "Black Market": { Ore: 0, Fiber: 0, Hide: 0, Wood: 0, Stone: 0 },
  }

  return bonuses[city]?.[resourceType] || 0
}
