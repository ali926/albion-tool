"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { ItemFlipperCalculatorForm } from "@/components/item-flipper-calculator-form"
import { ItemFlipperResults } from "@/components/item-flipper-results"
import { TopProfitsTable, type TopProfitItem } from "@/components/top-profits-table"
import { ProfitFilters, type FilterOptions } from "@/components/profit-filters"
import { RefreshStatus } from "@/components/refresh-status"
import { useAutoRefresh } from "@/hooks/use-auto-refresh"
import { batchCalculateFlips } from "@/lib/api/batch-calculator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { CITIES } from "@/lib/constants/cities"
import { InvestmentCalculator } from "@/components/investment-calculator"

export const dynamic = "force-dynamic"

export default function ItemFlipperPage() {
  const [result, setResult] = useState<any>(null)
  const [topItems, setTopItems] = useState<TopProfitItem[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const [filters, setFilters] = useState<FilterOptions>({
    tiers: [5, 6, 7, 8],
    enchantments: [0, 1],
    cities: CITIES,
    minProfit: 15000,
    minMargin: 10,
    maxInvestment: Number.POSITIVE_INFINITY,
  })

  const { isRefreshing, lastRefreshed, isPaused, togglePause, manualRefresh } = useAutoRefresh({
    interval: 5 * 60 * 1000,
    onRefresh: async () => {
      if (topItems.length > 0) {
        const results = await batchCalculateFlips(filters)
        setTopItems(results)
      }
    },
    enabled: topItems.length > 0,
  })

  const handleCalculate = (data: any) => {
    const buyPrice = data.useBuyOrders ? 8500 : 10000
    const sellPrice = data.useSellOrders ? 13500 : 12000
    const marketTax = Math.floor(sellPrice * 0.045) // 4.5% marketplace tax
    const transportFee = data.includeTransport ? Math.floor(buyPrice * 0.05) : 0

    const netProfit = sellPrice - buyPrice - marketTax - transportFee
    const profitMargin = (netProfit / buyPrice) * 100

    setResult({
      item: data.item,
      buyCity: data.buyCity,
      sellCity: data.sellCity,
      buyPrice,
      sellPrice,
      marketTax,
      transportFee,
      netProfit,
      profitMargin,
      useBuyOrders: data.useBuyOrders,
      useSellOrders: data.useSellOrders,
    })
  }

  const handleFindBestItems = async () => {
    setIsAnalyzing(true)

    try {
      const results = await batchCalculateFlips(filters)
      setTopItems(results)
    } catch (error) {
      console.error("[v0] Error analyzing items:", error)
      setTopItems([])
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Item Flipper</h1>
            <p className="text-muted-foreground mt-2">Buy items in one city and sell them in another for profit</p>
          </div>

          <Tabs defaultValue="calculator" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="calculator">Calculator</TabsTrigger>
              <TabsTrigger value="best-items">Best Items</TabsTrigger>
              <TabsTrigger value="investment">Investment</TabsTrigger>
            </TabsList>

            <TabsContent value="calculator" className="mt-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <ItemFlipperCalculatorForm onCalculate={handleCalculate} />
                <ItemFlipperResults result={result} />
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
                  <ProfitFilters filters={filters} onChange={setFilters} showFocusJournal={false} />
                  <Button onClick={handleFindBestItems} disabled={isAnalyzing} className="w-full mt-4" size="lg">
                    {isAnalyzing ? "Analyzing..." : "Find Best Items"}
                  </Button>
                </div>

                <div className="lg:col-span-2">
                  <TopProfitsTable
                    items={topItems}
                    isLoading={isAnalyzing}
                    title="Best City Flips"
                    emptyMessage="Set your filters and click 'Find Best Items' to analyze all city flipping opportunities"
                    calculatorType="item-flipper"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="investment" className="mt-6">
              <InvestmentCalculator type="flipping" />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
