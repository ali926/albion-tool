"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { BMFlipsCalculatorForm } from "@/components/bm-flips-calculator-form"
import { BMFlipsResults } from "@/components/bm-flips-results"
import { TopProfitsTable, type TopProfitItem } from "@/components/top-profits-table"
import { ProfitFilters, type FilterOptions } from "@/components/profit-filters"
import { RefreshStatus } from "@/components/refresh-status"
import { useAutoRefresh } from "@/hooks/use-auto-refresh"
import { batchCalculateBMFlips } from "@/lib/api/batch-calculator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { CITIES } from "@/lib/constants/cities"
import { InvestmentCalculator } from "@/components/investment-calculator"

interface BMFlipsFormData {
  itemId: string
  tier: number
  enchantment: number
  city: string
  transportFee: number
}

interface BMFlipResult {
  itemName: string
  tier: number
  enchantment: number
  city: string
  marketBuyPrice: number
  blackMarketSellPrice: number
  transportFee: number
  marketplaceTax: number
  totalCost: number
  netProfit: number
  profitMargin: number
}

export const dynamic = "force-dynamic"

export default function BMFlipsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<BMFlipResult | null>(null)
  const [topItems, setTopItems] = useState<TopProfitItem[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const [filters, setFilters] = useState<FilterOptions>({
    tiers: [6, 7, 8],
    enchantments: [0, 1, 2],
    cities: CITIES,
    minProfit: 20000,
    minMargin: 15,
    maxInvestment: Number.POSITIVE_INFINITY,
  })

  const { isRefreshing, lastRefreshed, isPaused, togglePause, manualRefresh } = useAutoRefresh({
    interval: 5 * 60 * 1000,
    onRefresh: async () => {
      if (topItems.length > 0) {
        const results = await batchCalculateBMFlips(filters)
        setTopItems(results)
      }
    },
    enabled: topItems.length > 0,
  })

  const handleCalculate = async (data: BMFlipsFormData) => {
    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 800))

    const mockMarketPrice = 15000 + Math.random() * 10000
    const mockBMPrice = mockMarketPrice * (1.2 + Math.random() * 0.3)
    const totalCost = mockMarketPrice + data.transportFee
    const marketplaceTax = Math.floor(mockBMPrice * 0.15)
    const netProfit = Math.floor(mockBMPrice - marketplaceTax - totalCost)
    const profitMargin = (netProfit / totalCost) * 100

    const calculatedResult: BMFlipResult = {
      itemName: `T${data.tier}${data.enchantment > 0 ? `.${data.enchantment}` : ""} ${data.itemId || "Item"}`,
      tier: data.tier,
      enchantment: data.enchantment,
      city: data.city,
      marketBuyPrice: Math.floor(mockMarketPrice),
      blackMarketSellPrice: Math.floor(mockBMPrice),
      transportFee: data.transportFee,
      marketplaceTax,
      totalCost: Math.floor(totalCost),
      netProfit,
      profitMargin,
    }

    setResult(calculatedResult)
    setIsLoading(false)
  }

  const handleFindBestItems = async () => {
    setIsAnalyzing(true)

    try {
      const results = await batchCalculateBMFlips(filters)
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
            <h1 className="text-3xl font-bold tracking-tight">Black Market Flips</h1>
            <p className="text-muted-foreground mt-2">Find profitable items to flip on the Black Market in Caerleon</p>
          </div>

          <Tabs defaultValue="calculator" className="w-full">
            <TabsList className="grid w-full max-w-2xl grid-cols-3">
              <TabsTrigger value="calculator">Calculator</TabsTrigger>
              <TabsTrigger value="best-items">Best Items</TabsTrigger>
              <TabsTrigger value="investment">Investment</TabsTrigger>
            </TabsList>

            <TabsContent value="calculator" className="mt-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <BMFlipsCalculatorForm onCalculate={handleCalculate} isLoading={isLoading} />
                <BMFlipsResults result={result} />
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
                    title="Best Black Market Flips"
                    emptyMessage="Set your filters and click 'Find Best Items' to analyze all Black Market opportunities"
                    calculatorType="bm-flips"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="investment" className="mt-6">
              <InvestmentCalculator type="bm-flip" />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
