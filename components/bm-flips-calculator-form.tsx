"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CITIES } from "@/lib/constants/cities"
import { ItemSelector } from "@/components/item-selector"

interface BMFlipsFormData {
  itemId: string
  tier: number
  enchantment: number
  city: string
  transportFee: number
}

interface BMFlipsCalculatorFormProps {
  onCalculate: (data: BMFlipsFormData) => void
  isLoading: boolean
}

export function BMFlipsCalculatorForm({ onCalculate, isLoading }: BMFlipsCalculatorFormProps) {
  const [itemId, setItemId] = useState<string>("")
  const [tier, setTier] = useState<number>(4)
  const [enchantment, setEnchantment] = useState<number>(0)
  const [city, setCity] = useState<string>("Caerleon")
  const [transportFee, setTransportFee] = useState<number>(0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onCalculate({
      itemId,
      tier,
      enchantment,
      city,
      transportFee,
    })
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="item-selector">Select Item</Label>
            <ItemSelector
              value={itemId}
              selectedTier={tier}
              selectedEnchantment={enchantment}
              onItemChange={setItemId}
              onTierChange={setTier}
              onEnchantmentChange={setEnchantment}
            />
          </div>

          <div>
            <Label htmlFor="city-selector">Purchase City</Label>
            <Select value={city} onValueChange={setCity}>
              <SelectTrigger id="city-selector">
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent>
                {CITIES.filter((c) => c !== "Black Market").map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">City where you'll buy the item from the market</p>
          </div>

          <div>
            <Label htmlFor="transport-fee">Transport Fee (silver per item)</Label>
            <Input
              id="transport-fee"
              type="number"
              min="0"
              value={transportFee}
              onChange={(e) => setTransportFee(Number(e.target.value))}
              placeholder="Enter transport cost..."
              className="max-w-xs"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Optional: Cost to transport items to Caerleon (if not buying there)
            </p>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={!itemId || isLoading}>
          {isLoading ? "Calculating..." : "Calculate Black Market Profit"}
        </Button>
      </form>
    </Card>
  )
}
