"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ResourceSelector } from "@/components/resource-selector"
import { CitySelectorMulti } from "@/components/city-selector-multi"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

interface RefiningCalculatorFormProps {
  onCalculate: (params: RefiningParams) => void
}

export interface RefiningParams {
  category: string
  tier: number
  selectedCities: string[]
  useFocus: boolean
}

export function RefiningCalculatorForm({ onCalculate }: RefiningCalculatorFormProps) {
  const [category, setCategory] = useState("ore")
  const [tier, setTier] = useState(4)
  const [selectedCities, setSelectedCities] = useState<string[]>(["Caerleon"])
  const [useFocus, setUseFocus] = useState(false)

  const handleCalculate = () => {
    if (selectedCities.length === 0) return

    onCalculate({
      category,
      tier,
      selectedCities,
      useFocus,
    })
  }

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">Refining Configuration</h2>
        <ResourceSelector
          selectedCategory={category}
          selectedTier={tier}
          onCategoryChange={setCategory}
          onTierChange={setTier}
        />
      </div>

      <div className="space-y-2">
        <Label>Cities to Compare</Label>
        <CitySelectorMulti selectedCities={selectedCities} onCitiesChange={setSelectedCities} />
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox id="focus" checked={useFocus} onCheckedChange={(checked) => setUseFocus(checked === true)} />
          <label
            htmlFor="focus"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Use Focus (53.9% return rate)
          </label>
        </div>
      </div>

      <Button onClick={handleCalculate} className="w-full" disabled={selectedCities.length === 0}>
        Calculate Refining Profit
      </Button>
    </Card>
  )
}
