"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"

interface RefiningResult {
  city: string
  inputCost: number
  outputValue: number
  refiningFee: number
  returnRate: number
  profit: number
  profitPercentage: number
}

interface RefiningResultsProps {
  results: RefiningResult[]
  resourceName: string
}

export function RefiningResults({ results, resourceName }: RefiningResultsProps) {
  if (results.length === 0) {
    return null
  }

  const sortedResults = [...results].sort((a, b) => b.profit - a.profit)

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Refining Results: {resourceName}</h2>
        <Button variant="outline" size="sm">
          <Star className="w-4 h-4 mr-2" />
          Add to Favorites
        </Button>
      </div>

      <div className="space-y-3">
        {sortedResults.map((result, index) => {
          const isTopChoice = index === 0
          const profitColor =
            result.profit > 0 ? "text-green-500" : result.profit < 0 ? "text-red-500" : "text-gray-500"

          return (
            <div
              key={result.city}
              className={`p-4 rounded-lg border ${
                isTopChoice ? "border-primary bg-primary/5" : "border-border bg-card"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold flex items-center gap-2">
                    {result.city}
                    {isTopChoice && (
                      <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">
                        Best Choice
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-muted-foreground">Return Rate: {result.returnRate.toFixed(1)}%</p>
                </div>
                <div className="text-right">
                  <div className={`text-xl font-bold ${profitColor}`}>
                    {result.profit >= 0 ? "+" : ""}
                    {result.profit.toLocaleString()} silver
                  </div>
                  <div className={`text-sm ${profitColor}`}>
                    {result.profitPercentage >= 0 ? "+" : ""}
                    {result.profitPercentage.toFixed(1)}%
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Input Cost</div>
                  <div className="font-medium">{result.inputCost.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Output Value</div>
                  <div className="font-medium">{result.outputValue.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Refining Fee</div>
                  <div className="font-medium">{result.refiningFee.toLocaleString()}</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
