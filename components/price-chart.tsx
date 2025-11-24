"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import type { PriceHistoryData, PriceChange } from "@/types/albion"

interface PriceChartProps {
  itemName: string
  historyData: PriceHistoryData[]
  priceChange: PriceChange | null
  averageVolume: number
}

export function PriceChart({ itemName, historyData, priceChange, averageVolume }: PriceChartProps) {
  const data = historyData[0]?.data || []

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Price History - {itemName}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">No historical data available</p>
        </CardContent>
      </Card>
    )
  }

  // Calculate min/max for scaling
  const prices = data.map((d) => d.avg_price)
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)
  const priceRange = maxPrice - minPrice

  // Generate simple line chart points
  const chartPoints = data
    .map((point, index) => {
      const x = (index / (data.length - 1)) * 100
      const y = 100 - ((point.avg_price - minPrice) / priceRange) * 80
      return `${x},${y}`
    })
    .join(" ")

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Price History - {itemName}</CardTitle>
          {priceChange && (
            <div className="flex items-center gap-2">
              {priceChange.trend === "up" && <TrendingUp className="h-4 w-4 text-green-500" />}
              {priceChange.trend === "down" && <TrendingDown className="h-4 w-4 text-red-500" />}
              {priceChange.trend === "stable" && <Minus className="h-4 w-4 text-muted-foreground" />}
              <span
                className={
                  priceChange.trend === "up"
                    ? "text-green-500 font-semibold"
                    : priceChange.trend === "down"
                      ? "text-red-500 font-semibold"
                      : "text-muted-foreground"
                }
              >
                {priceChange.changePercent > 0 ? "+" : ""}
                {priceChange.changePercent.toFixed(1)}%
              </span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Simple SVG line chart */}
          <div className="relative w-full h-48 bg-muted/20 rounded-lg p-4">
            <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
              <polyline
                points={chartPoints}
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="text-xs text-muted-foreground">Current Price</div>
              <div className="text-lg font-semibold">{priceChange?.current.toLocaleString() || 0}</div>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="text-xs text-muted-foreground">7d Change</div>
              <div className="text-lg font-semibold">
                {priceChange?.change ? (
                  <span className={priceChange.change > 0 ? "text-green-500" : "text-red-500"}>
                    {priceChange.change > 0 ? "+" : ""}
                    {priceChange.change.toLocaleString()}
                  </span>
                ) : (
                  "N/A"
                )}
              </div>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="text-xs text-muted-foreground">Avg Volume</div>
              <div className="text-lg font-semibold">{averageVolume.toLocaleString()}</div>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="text-xs text-muted-foreground">Market Status</div>
              <div className="text-lg">
                {priceChange?.trend === "up" && <Badge className="bg-green-500">Rising</Badge>}
                {priceChange?.trend === "down" && <Badge variant="destructive">Falling</Badge>}
                {priceChange?.trend === "stable" && <Badge variant="secondary">Stable</Badge>}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
