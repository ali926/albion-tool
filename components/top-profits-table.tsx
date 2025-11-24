"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Star, Copy, Download } from "lucide-react"
import { PriceTrendIndicator } from "@/components/price-trend-indicator"
import { addFavorite, isFavorite, type FavoriteItem } from "@/lib/favorites"
import { useState } from "react"
import type { PriceChange } from "@/types/albion"
import { exportToCSV, copyToClipboard } from "@/lib/export-utils"
import { useToastNotification } from "@/hooks/use-toast-notification"
import { ItemIcon } from "@/components/item-icon"

export interface TopProfitItem {
  itemName: string
  itemId?: string
  tier: number
  enchantment: number
  city?: string
  buyCity?: string
  sellCity?: string
  profit: number
  profitMargin: number
  details?: string
  priceChange?: PriceChange | null
}

interface TopProfitsTableProps {
  items: TopProfitItem[]
  isLoading: boolean
  title?: string
  emptyMessage?: string
  calculatorType?: FavoriteItem["type"]
}

export function TopProfitsTable({
  items,
  isLoading,
  title = "Top Profitable Items",
  emptyMessage = "Click 'Find Best Items' to analyze profits",
  calculatorType = "crafting",
}: TopProfitsTableProps) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const { showSuccess, showError } = useToastNotification()

  const handleAddFavorite = (item: TopProfitItem) => {
    addFavorite(item, calculatorType)
    setFavorites(new Set(favorites).add(item.itemName))
    showSuccess("Added to Favorites", `${item.itemName} has been saved to your watchlist`)
  }

  const handleCopyItemName = async (itemName: string) => {
    try {
      await copyToClipboard(itemName)
      showSuccess("Copied!", `${itemName} copied to clipboard`)
    } catch (error) {
      showError("Failed to copy", "Could not copy item name to clipboard")
    }
  }

  const handleExport = () => {
    try {
      exportToCSV(items, `${calculatorType}-profits`)
      showSuccess("Exported!", "CSV file has been downloaded")
    } catch (error) {
      showError("Export failed", "Could not export data to CSV")
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3 text-muted-foreground">Analyzing items...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (items.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">{emptyMessage}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        <Button onClick={handleExport} variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-2 font-semibold">#</th>
                <th className="text-left py-3 px-2 font-semibold">Item</th>
                <th className="text-left py-3 px-2 font-semibold">Location</th>
                <th className="text-center py-3 px-2 font-semibold">Trend</th>
                <th className="text-right py-3 px-2 font-semibold">Profit</th>
                <th className="text-right py-3 px-2 font-semibold">Margin</th>
                <th className="text-right py-3 px-2 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => {
                const itemIsFavorite = isFavorite(item, calculatorType)

                return (
                  <tr key={index} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-2">
                      <div className="flex items-center">
                        {index === 0 && <Badge className="bg-amber-500">1st</Badge>}
                        {index === 1 && <Badge className="bg-slate-400">2nd</Badge>}
                        {index === 2 && <Badge className="bg-orange-600">3rd</Badge>}
                        {index > 2 && <span className="text-muted-foreground">{index + 1}</span>}
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-3">
                        {item.itemId && (
                          <ItemIcon itemId={item.itemId} tier={item.tier} enchantment={item.enchantment} size={40} />
                        )}
                        <div>
                          <div className="font-medium">{item.itemName}</div>
                          <div className="text-sm text-muted-foreground">
                            T{item.tier}
                            {item.enchantment > 0 && `.${item.enchantment}`}
                            {item.details && ` - ${item.details}`}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <div className="text-sm">
                        {item.city && <div>{item.city}</div>}
                        {item.buyCity && item.sellCity && (
                          <div className="text-muted-foreground">
                            {item.buyCity} → {item.sellCity}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex justify-center">
                        <PriceTrendIndicator priceChange={item.priceChange ?? null} showBadge />
                      </div>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <div className="flex items-center justify-end">
                        {item.profit >= 0 ? (
                          <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                        )}
                        <span
                          className={item.profit >= 0 ? "text-green-500 font-semibold" : "text-red-500 font-semibold"}
                        >
                          {item.profit >= 0 ? "+" : ""}
                          {item.profit.toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <Badge
                        variant={
                          item.profitMargin >= 15 ? "default" : item.profitMargin >= 5 ? "secondary" : "destructive"
                        }
                      >
                        {item.profitMargin.toFixed(1)}%
                      </Badge>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyItemName(item.itemName)}
                          title="Copy item name"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAddFavorite(item)}
                          disabled={itemIsFavorite}
                          className={itemIsFavorite ? "text-amber-500" : ""}
                          title="Add to favorites"
                        >
                          <Star className={`h-4 w-4 ${itemIsFavorite ? "fill-amber-500" : ""}`} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
