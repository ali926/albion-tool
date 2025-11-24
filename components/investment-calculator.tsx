"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  calculateInvestmentOptions,
  compareInvestmentAmounts,
  type InvestmentOption,
} from "@/lib/calculations/investment"
import { Loader2, TrendingUp, Coins, Package } from "lucide-react"

interface InvestmentCalculatorProps {
  type: "crafting" | "refining" | "flipping" | "bm-flip"
}

export function InvestmentCalculator({ type }: InvestmentCalculatorProps) {
  const [availableSilver, setAvailableSilver] = useState<number>(1000000)
  const [results, setResults] = useState<InvestmentOption[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedOption, setSelectedOption] = useState<InvestmentOption | null>(null)

  const handleCalculate = async () => {
    setLoading(true)
    try {
      const options = await calculateInvestmentOptions(availableSilver, type)
      setResults(options)
    } catch (error) {
      console.error("[v0] Investment calculation error:", error)
    } finally {
      setLoading(false)
    }
  }

  const roiComparisons = selectedOption
    ? compareInvestmentAmounts(selectedOption, [
        availableSilver * 0.5,
        availableSilver,
        availableSilver * 1.5,
        availableSilver * 2,
      ])
    : []

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle>Investment Calculator</CardTitle>
          <CardDescription>Calculate the best items to invest your silver in</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="silver">Available Silver</Label>
            <Input
              id="silver"
              type="number"
              value={availableSilver}
              onChange={(e) => setAvailableSilver(Number(e.target.value))}
              placeholder="1000000"
            />
          </div>
          <Button onClick={handleCalculate} disabled={loading || availableSilver <= 0} className="w-full">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Calculate Best Investments
          </Button>
        </CardContent>
      </Card>

      {/* Results Section */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top Investment Opportunities</CardTitle>
            <CardDescription>Based on {availableSilver.toLocaleString()} silver available</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {results.map((option, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border rounded-lg p-4 hover:bg-accent cursor-pointer transition-colors"
                  onClick={() => setSelectedOption(option)}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">
                        {option.itemName} T{option.tier}
                      </h4>
                      <Badge variant="outline">{option.city}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Package className="h-4 w-4" />
                        <span>{option.quantity} units</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Coins className="h-4 w-4" />
                        <span>{option.costPerUnit.toLocaleString()} each</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="text-lg font-bold text-green-500">+{option.totalProfit.toLocaleString()}</div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <TrendingUp className="h-4 w-4" />
                      <span>{option.roi.toFixed(1)}% ROI</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ROI Comparison Section */}
      {selectedOption && roiComparisons.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>ROI Comparison for {selectedOption.itemName}</CardTitle>
            <CardDescription>See how your profit scales with different investment amounts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {roiComparisons.map((comp, index) => (
                <div key={index} className="flex items-center justify-between border rounded-lg p-4">
                  <div className="space-y-1">
                    <div className="font-semibold">{comp.amount.toLocaleString()} silver</div>
                    <div className="text-sm text-muted-foreground">{comp.quantity} units</div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="font-bold text-green-500">+{comp.totalProfit.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">{comp.roi.toFixed(1)}% ROI</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
