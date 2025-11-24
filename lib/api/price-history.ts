import type { City, PriceHistoryData, PriceChange } from "@/types/albion"

const ALBION_DATA_API = "https://www.albion-online-data.com/api/v2/stats"

interface HistoryCacheEntry {
  data: PriceHistoryData[]
  timestamp: number
}

const historyCache = new Map<string, HistoryCacheEntry>()
const CACHE_DURATION = 10 * 60 * 1000 // 10 minutes for history data

export interface FetchHistoryOptions {
  itemIds: string[]
  cities?: City[]
  timescale?: "1" | "6" | "24" | "168" // hours: 1h, 6h, 24h, 7d
  qualities?: number[]
  useCache?: boolean
}

/**
 * Fetches price history data from Albion Online Data Project
 */
export async function fetchPriceHistory({
  itemIds,
  cities,
  timescale = "168",
  qualities = [1],
  useCache = true,
}: FetchHistoryOptions): Promise<PriceHistoryData[]> {
  const cacheKey = `history-${itemIds.join(",")}-${cities?.join(",") || "all"}-${timescale}`

  if (useCache) {
    const cached = historyCache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log("[v0] Using cached history data")
      return cached.data
    }
  }

  const params = new URLSearchParams({
    items: itemIds.join(","),
    timescale,
  })

  if (cities && cities.length > 0) {
    params.append("locations", cities.join(","))
  }

  if (qualities.length > 0) {
    params.append("qualities", qualities.join(","))
  }

  try {
    console.log("[v0] Fetching price history from Albion API")

    const response = await fetch(`${ALBION_DATA_API}/history?${params.toString()}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    historyCache.set(cacheKey, {
      data: data as PriceHistoryData[],
      timestamp: Date.now(),
    })

    console.log("[v0] Successfully fetched history data")
    return data as PriceHistoryData[]
  } catch (error) {
    console.error("[v0] Error fetching price history:", error)
    throw error
  }
}

/**
 * Calculate price change from history data
 */
export function calculatePriceChange(historyData: PriceHistoryData[]): PriceChange | null {
  if (!historyData || historyData.length === 0) return null

  const data = historyData[0]?.data
  if (!data || data.length < 2) return null

  const current = data[data.length - 1].avg_price
  const previous = data[0].avg_price

  const change = current - previous
  const changePercent = (change / previous) * 100

  let trend: "up" | "down" | "stable" = "stable"
  if (Math.abs(changePercent) > 2) {
    trend = change > 0 ? "up" : "down"
  }

  return {
    current,
    previous,
    change,
    changePercent,
    trend,
  }
}

/**
 * Get average volume from history data
 */
export function getAverageVolume(historyData: PriceHistoryData[]): number {
  if (!historyData || historyData.length === 0) return 0

  const data = historyData[0]?.data
  if (!data || data.length === 0) return 0

  const totalVolume = data.reduce((sum, point) => sum + point.item_count, 0)
  return Math.round(totalVolume / data.length)
}

export function clearHistoryCache() {
  historyCache.clear()
  console.log("[v0] History cache cleared")
}
