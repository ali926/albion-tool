"use client"

import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { PriceChange } from "@/types/albion"

interface PriceTrendIndicatorProps {
  priceChange: PriceChange | null
  showBadge?: boolean
}

export function PriceTrendIndicator({ priceChange, showBadge = false }: PriceTrendIndicatorProps) {
  if (!priceChange) return null

  const Icon = priceChange.trend === "up" ? TrendingUp : priceChange.trend === "down" ? TrendingDown : Minus

  const colorClass =
    priceChange.trend === "up"
      ? "text-green-500"
      : priceChange.trend === "down"
        ? "text-red-500"
        : "text-muted-foreground"

  if (showBadge) {
    return (
      <Badge
        variant={priceChange.trend === "up" ? "default" : priceChange.trend === "down" ? "destructive" : "secondary"}
        className="gap-1"
      >
        <Icon className="h-3 w-3" />
        {priceChange.changePercent > 0 ? "+" : ""}
        {priceChange.changePercent.toFixed(1)}%
      </Badge>
    )
  }

  return (
    <div className={`flex items-center gap-1 ${colorClass}`}>
      <Icon className="h-4 w-4" />
      <span className="text-sm font-medium">
        {priceChange.changePercent > 0 ? "+" : ""}
        {priceChange.changePercent.toFixed(1)}%
      </span>
    </div>
  )
}
