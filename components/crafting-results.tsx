"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, TrendingUp, TrendingDown } from "lucide-react"

interface Material {
  name: string
  quantity: number
  unitPrice: number
  totalCost: number
  city: string
}

interface CraftingResult {
  itemName: string
  materials: Material[]
  totalMaterialCost: number
  craftingFee: number
  outputValue: number
  profit: number
  profitPercentage: number
  bestSellCity: string
}

interface CraftingResultsProps {
  result: CraftingResult
  onAddToFavorites?: () => void
}

export function CraftingResults({ result, onAddToFavorites }: CraftingResultsProps) {
  const isProfit = result.profit > 0

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{result.itemName}</h2>
            <p className="text-sm text-muted-foreground">Crafting Analysis</p>
          </div>
          <Button variant="outline" size="sm" onClick={onAddToFavorites}>
            <Star className="h-4 w-4 mr-2" />
            Add to Favorites
          </Button>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-sm">Materials Required</h3>
          <div className="space-y-2">
            {result.materials.map((material, index) => (
              <div key={index} className="flex items-center justify-between text-sm bg-muted/50 p-3 rounded-md">
                <div>
                  <span className="font-medium">{material.name}</span>
                  <span className="text-muted-foreground ml-2">x{material.quantity}</span>
                </div>
                <div className="text-right">
                  <div className="font-medium">{material.totalCost.toLocaleString()} silver</div>
                  <div className="text-xs text-muted-foreground">{material.city}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2 pt-4 border-t">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Material Cost</span>
            <span className="font-medium">{result.totalMaterialCost.toLocaleString()} silver</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Crafting Fee</span>
            <span className="font-medium">{result.craftingFee.toLocaleString()} silver</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Output Value ({result.bestSellCity})</span>
            <span className="font-medium">{result.outputValue.toLocaleString()} silver</span>
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="bg-card p-4 rounded-lg border-2 border-primary/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isProfit ? (
                  <TrendingUp className="h-5 w-5 text-green-500" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-500" />
                )}
                <span className="text-sm font-medium">Estimated Profit</span>
              </div>
              <div className="text-right">
                <div className={`text-xl font-bold ${isProfit ? "text-green-500" : "text-red-500"}`}>
                  {result.profit > 0 ? "+" : ""}
                  {result.profit.toLocaleString()} silver
                </div>
                <div className={`text-sm ${isProfit ? "text-green-500/80" : "text-red-500/80"}`}>
                  {result.profitPercentage > 0 ? "+" : ""}
                  {result.profitPercentage.toFixed(2)}%
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Prices are updated in real-time from the Albion Online Data Project
        </p>
      </div>
    </Card>
  )
}
