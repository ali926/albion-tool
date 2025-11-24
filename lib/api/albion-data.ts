import type { PriceData, City, Quality } from "@/types/albion"

const ALBION_DATA_API = "https://www.albion-online-data.com/api/v2/stats"

interface CacheEntry {
  data: PriceData[]
  timestamp: number
}

const priceCache = new Map<string, CacheEntry>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export interface FetchPricesOptions {
  itemIds: string[]
  cities?: City[]
  qualities?: Quality[]
  useCache?: boolean
}

/**
 * Fetches current market prices from Albion Online Data Project
 */
export async function fetchPrices({
  itemIds,
  cities,
  qualities = [1],
  useCache = true,
}: FetchPricesOptions): Promise<PriceData[]> {
  const cacheKey = `${itemIds.join(",")}-${cities?.join(",") || "all"}-${qualities.join(",")}`

  if (useCache) {
    const cached = priceCache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log("[v0] Using cached price data")
      return cached.data
    }
  }

  const params = new URLSearchParams()
  const itemList = itemIds.join(",")

  if (cities && cities.length > 0) {
    params.append("locations", cities.join(","))
  }

  if (qualities.length > 0) {
    params.append("qualities", qualities.join(","))
  }

  try {
    const url = `${ALBION_DATA_API}/prices/${itemList}?${params.toString()}`
    console.log("[v0] Fetching prices from Albion API:", url)

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    priceCache.set(cacheKey, {
      data: data as PriceData[],
      timestamp: Date.now(),
    })

    console.log("[v0] Successfully fetched", data.length, "price entries")
    return data as PriceData[]
  } catch (error) {
    console.error("[v0] Error fetching Albion price data:", error)
    throw error
  }
}

/**
 * Gets the best buy/sell prices for an item across cities
 */
export function getBestPrices(prices: PriceData[]) {
  if (prices.length === 0) return null

  const bestBuy = prices.reduce((best, current) => (current.buy_price_max > best.buy_price_max ? current : best))

  const bestSell = prices.reduce((best, current) => (current.sell_price_min < best.sell_price_min ? current : best))

  return { bestBuy, bestSell }
}

/**
 * Formats item ID for the Albion Data API
 * Format: T{tier}_{ITEM_NAME}@{enchantment}
 */
export function formatItemId(baseItemId: string, tier: number, enchantment = 0): string {
  const enchantmentSuffix = enchantment > 0 ? `@${enchantment}` : ""
  return `T${tier}_${baseItemId}${enchantmentSuffix}`
}

/**
 * Fetches history data for price charts
 */
export async function fetchPriceHistory({
  itemIds,
  cities,
  timescale = "24",
}: FetchPricesOptions & { timescale?: string }): Promise<any[]> {
  const params = new URLSearchParams({
    timescale,
  })
  const itemList = itemIds.join(",")

  if (cities && cities.length > 0) {
    params.append("locations", cities.join(","))
  }

  try {
    const response = await fetch(`${ALBION_DATA_API}/history/${itemList}?${params.toString()}`)

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("[v0] Error fetching Albion history data:", error)
    throw error
  }
}

/**
 * Fetches gold prices for silver-to-gold conversions
 */
export async function fetchGoldPrices(cities?: City[]): Promise<PriceData[]> {
  const params = new URLSearchParams({
    items: "GOLD",
  })

  if (cities && cities.length > 0) {
    params.append("locations", cities.join(","))
  }

  try {
    console.log("[v0] Fetching gold prices from Albion API")

    const response = await fetch(`${ALBION_DATA_API}/prices?${params.toString()}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data as PriceData[]
  } catch (error) {
    console.error("[v0] Error fetching gold prices:", error)
    throw error
  }
}

export function clearPriceCache() {
  priceCache.clear()
  console.log("[v0] Price cache cleared")
}

export function getCacheAge(itemIds: string[], cities?: City[]): number | null {
  const cacheKey = `${itemIds.join(",")}-${cities?.join(",") || "all"}-1`
  const cached = priceCache.get(cacheKey)
  if (!cached) return null
  return Date.now() - cached.timestamp
}
