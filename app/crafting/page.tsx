"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { CraftingCalculatorForm } from "@/components/crafting-calculator-form"
import { CraftingResults } from "@/components/crafting-results"
import { TopProfitsTable, type TopProfitItem } from "@/components/top-profits-table"
import { ProfitFilters, type FilterOptions } from "@/components/profit-filters"
import { RefreshStatus } from "@/components/refresh-status"
import { useAutoRefresh } from "@/hooks/use-auto-refresh"
import { batchCalculateCrafting } from "@/lib/api/batch-calculator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { CITIES } from "@/lib/constants/cities"
import type { City, Tier, Enchantment } from "@/types/albion"
import { InvestmentCalculator } from "@/components/investment-calculator"

export const dynamic = "force-dynamic"

export default function CraftingPage() {
  const [isCalculating, setIsCalculating] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [topItems, setTopItems] = useState<TopProfitItem[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const [filters, setFilters] = useState<FilterOptions>({
    tiers: [4, 5, 6, 7, 8],
    enchantments: [0, 1],
    cities: CITIES,
    minProfit: 10000,
    minMargin: 10,
    maxInvestment: Number.POSITIVE_INFINITY,
    useFocus: true,
    useJournal: false,
  })

  const { isRefreshing, lastRefreshed, isPaused, togglePause, manualRefresh } = useAutoRefresh({
    interval: 5 * 60 * 1000, // 5 minutes
    onRefresh: async () => {
      if (topItems.length > 0) {
        const results = await batchCalculateCrafting(filters)
        setTopItems(results)
      }
    },
    enabled: topItems.length > 0,
  })

  const handleCalculate = async (params: {
    itemCategory: string
    tier: Tier
    enchantment: Enchantment
    cities: City[]
    useFocus: boolean
    useJournal: boolean
  }) => {
    setIsCalculating(true)

    await new Promise((resolve) => setTimeout(resolve, 1500))

    const mockResult = {
      itemName: `T${params.tier}${params.enchantment > 0 ? `.${params.enchantment}` : ""} ${params.itemCategory.charAt(0).toUpperCase() + params.itemCategory.slice(1).replace("_", " ")}`,
      materials: [
        {
          name: `T${params.tier} Metal Bar`,
          quantity: params.useFocus ? 8 : 16,
          unitPrice: 1250,
          totalCost: params.useFocus ? 10000 : 20000,
          city: params.cities[0],
        },
        {
          name: `T${params.tier} Leather`,
          quantity: params.useFocus ? 4 : 8,
          unitPrice: 980,
          totalCost: params.useFocus ? 3920 : 7840,
          city: params.cities[0],
        },
        {
          name: `T${params.tier} Cloth`,
          quantity: params.useFocus ? 4 : 8,
          unitPrice: 1100,
          totalCost: params.useFocus ? 4400 : 8800,
          city: params.cities[0],
        },
      ],
      totalMaterialCost: params.useFocus ? 18320 : 36640,
      craftingFee: 2200,
      outputValue: 45000,
      profit: params.useFocus ? 24480 : 6160,
      profitPercentage: params.useFocus ? 133.6 : 16.8,
      bestSellCity: "Caerleon",
    }

    setResult(mockResult)
    setIsCalculating(false)
  }

  const handleFindBestItems = async () => {
    setIsAnalyzing(true)

    try {
      const results = await batchCalculateCrafting(filters)
      setTopItems(results)
    } catch (error) {
      console.error("[v0] Error analyzing items:", error)
      setTopItems([])
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleAddToFavorites = () => {
    console.log("[v0] Added to favorites")
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Crafting Calculator</h1>
            <p className="text-muted-foreground mt-2">Calculate crafting profits with real-time market data</p>
          </div>

          <Tabs defaultValue="calculator" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="calculator">Calculator</TabsTrigger>
              <TabsTrigger value="best-items">Best Items</TabsTrigger>
              <TabsTrigger value="investment">Investment</TabsTrigger>
            </TabsList>

            <TabsContent value="calculator" className="mt-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <CraftingCalculatorForm onCalculate={handleCalculate} isCalculating={isCalculating} />

                {result ? (
                  <CraftingResults result={result} onAddToFavorites={handleAddToFavorites} />
                ) : (
                  <div className="hidden lg:flex items-center justify-center border-2 border-dashed border-border rounded-lg p-12">
                    <div className="text-center space-y-2">
                      <div className="text-4xl mb-4">📊</div>
                      <h3 className="font-semibold">Results will appear here</h3>
                      <p className="text-sm text-muted-foreground max-w-sm">
                        Select an item, tier, and cities, then click Calculate to see detailed profit analysis
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="best-items" className="mt-6 space-y-4">
              {topItems.length > 0 && (
                <RefreshStatus
                  isRefreshing={isRefreshing}
                  lastRefreshed={lastRefreshed}
                  isPaused={isPaused}
                  onTogglePause={togglePause}
                  onManualRefresh={manualRefresh}
                />
              )}

              <div className="grid lg:grid-cols-3 gap-6">
                <div>
                  <ProfitFilters filters={filters} onChange={setFilters} showFocusJournal={true} />
                  <Button onClick={handleFindBestItems} disabled={isAnalyzing} className="w-full mt-4" size="lg">
                    {isAnalyzing ? "Analyzing..." : "Find Best Items"}
                  </Button>
                </div>

                <div className="lg:col-span-2">
                  <TopProfitsTable
                    items={topItems}
                    isLoading={isAnalyzing}
                    title="Most Profitable Crafts"
                    emptyMessage="Set your filters and click 'Find Best Items' to analyze all craftable items"
                    calculatorType="crafting"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="investment" className="mt-6">
              <InvestmentCalculator type="crafting" />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

function handleCalculate(params: {
  itemCategory: string
  tier: Tier
  enchantment: Enchantment
  cities: City[]
  useFocus: boolean
  useJournal: boolean
}) {}
