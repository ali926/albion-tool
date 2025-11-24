"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { RefiningCalculatorForm, type RefiningParams } from "@/components/refining-calculator-form"
import { RefiningResults } from "@/components/refining-results"
import { TopProfitsTable, type TopProfitItem } from "@/components/top-profits-table"
import { ProfitFilters, type FilterOptions } from "@/components/profit-filters"
import { RefreshStatus } from "@/components/refresh-status"
import { useAutoRefresh } from "@/hooks/use-auto-refresh"
import { batchCalculateRefining } from "@/lib/api/batch-calculator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { BASE_RETURN_RATE, CITY_BONUSES } from "@/lib/constants/refining"
import { CITIES } from "@/lib/constants/cities"
import { InvestmentCalculator } from "@/components/investment-calculator"

interface RefiningResult {
  city: string
  inputCost: number
  outputValue: number
  refiningFee: number
  returnRate: number
  profit: number
  profitPercentage: number
}

export const dynamic = "force-dynamic"

export default function RefiningPage() {
  const [results, setResults] = useState<RefiningResult[]>([])
  const [resourceName, setResourceName] = useState("")
  const [topItems, setTopItems] = useState<TopProfitItem[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const [filters, setFilters] = useState<FilterOptions>({
    tiers: [4, 5, 6, 7, 8],
    enchantments: [0],
    cities: CITIES,
    minProfit: 5000,
    minMargin: 15,
    maxInvestment: Number.POSITIVE_INFINITY,
    useFocus: true,
  })

  const { isRefreshing, lastRefreshed, isPaused, togglePause, manualRefresh } = useAutoRefresh({
    interval: 5 * 60 * 1000,
    onRefresh: async () => {
      if (topItems.length > 0) {
        const results = await batchCalculateRefining(filters)
        setTopItems(results)
      }
    },
    enabled: topItems.length > 0,
  })

  const handleCalculate = (params: RefiningParams) => {
    const mockResults: RefiningResult[] = params.selectedCities.map((city) => {
      const cityBonus = CITY_BONUSES[city]?.[params.category] || 0
      const focusBonus = params.useFocus ? 38.7 : 0
      const returnRate = BASE_RETURN_RATE + cityBonus + focusBonus
      const inputPrice = 1000 + params.tier * 200
      const outputPrice = 2500 + params.tier * 500
      const inputQuantity = 2
      const outputQuantity = 1
      const effectiveInputCost = inputPrice * inputQuantity * (1 - returnRate / 100)
      const refiningFee = 100 + params.tier * 50
      const outputValue = outputPrice * outputQuantity
      const profit = outputValue - effectiveInputCost - refiningFee
      const profitPercentage = effectiveInputCost > 0 ? (profit / effectiveInputCost) * 100 : 0

      return {
        city,
        inputCost: Math.round(effectiveInputCost),
        outputValue,
        refiningFee,
        returnRate,
        profit: Math.round(profit),
        profitPercentage,
      }
    })

    setResults(mockResults)
    setResourceName(`T${params.tier} ${params.category.charAt(0).toUpperCase() + params.category.slice(1)}`)
  }

  const handleFindBestItems = async () => {
    setIsAnalyzing(true)

    try {
      const results = await batchCalculateRefining(filters)
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
            <h1 className="text-3xl font-bold tracking-tight">Refining Calculator</h1>
            <p className="text-muted-foreground mt-2">Optimize refining profits with resource costs and city bonuses</p>
          </div>

          <Tabs defaultValue="calculator" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="calculator">Calculator</TabsTrigger>
              <TabsTrigger value="best-items">Best Items</TabsTrigger>
              <TabsTrigger value="investment">Investment</TabsTrigger>
            </TabsList>

            <TabsContent value="calculator" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RefiningCalculatorForm onCalculate={handleCalculate} />
                <RefiningResults results={results} resourceName={resourceName} />
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
                    title="Most Profitable Refining"
                    emptyMessage="Set your filters and click 'Find Best Items' to analyze all refinable resources"
                    calculatorType="refining"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="investment" className="mt-6">
              <InvestmentCalculator type="refining" />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
