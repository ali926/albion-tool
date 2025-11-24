"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Trash2, Star, Calculator, Droplets, TrendingUpIcon, Repeat } from "lucide-react"
import { PriceTrendIndicator } from "@/components/price-trend-indicator"
import { getFavorites, removeFavorite, type FavoriteItem } from "@/lib/favorites"
import Link from "next/link"
import { ItemIcon } from "@/components/item-icon"

const typeIcons = {
  crafting: Calculator,
  refining: Droplets,
  "bm-flips": TrendingUpIcon,
  "item-flipper": Repeat,
}

const typeLabels = {
  crafting: "Crafting",
  refining: "Refining",
  "bm-flips": "BM Flips",
  "item-flipper": "Item Flipper",
}

const typeLinks = {
  crafting: "/crafting",
  refining: "/refining",
  "bm-flips": "/bm-flips",
  "item-flipper": "/item-flipper",
}

export function FavoritesDashboard() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])

  useEffect(() => {
    setFavorites(getFavorites())
  }, [])

  const handleRemove = (id: string) => {
    removeFavorite(id)
    setFavorites(getFavorites())
  }

  if (favorites.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500" />
            Your Favorites
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 space-y-2">
            <p className="text-muted-foreground">No favorite items yet</p>
            <p className="text-sm text-muted-foreground">
              Add items to your favorites from the Best Items tables to track them here
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-500" />
          Your Favorites ({favorites.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-2 font-semibold">Type</th>
                <th className="text-left py-3 px-2 font-semibold">Item</th>
                <th className="text-left py-3 px-2 font-semibold">Location</th>
                <th className="text-center py-3 px-2 font-semibold">Trend</th>
                <th className="text-right py-3 px-2 font-semibold">Profit</th>
                <th className="text-right py-3 px-2 font-semibold">Margin</th>
                <th className="text-right py-3 px-2 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {favorites.map((item) => {
                const Icon = typeIcons[item.type]

                return (
                  <tr key={item.id} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-2">
                      <Link href={typeLinks[item.type]}>
                        <Badge
                          variant="outline"
                          className="flex items-center gap-1 w-fit cursor-pointer hover:bg-accent"
                        >
                          <Icon className="w-3 h-3" />
                          {typeLabels[item.type]}
                        </Badge>
                      </Link>
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
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemove(item.id)}
                        className="hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
