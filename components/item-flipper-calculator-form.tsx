"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ItemSelector } from "./item-selector"
import { Checkbox } from "@/components/ui/checkbox"
import { CITIES } from "@/lib/constants/cities"

interface ItemFlipperFormProps {
  onCalculate: (data: any) => void
}

export function ItemFlipperCalculatorForm({ onCalculate }: ItemFlipperFormProps) {
  const [selectedItem, setSelectedItem] = useState("")
  const [buyCity, setBuyCity] = useState("Caerleon")
  const [sellCity, setSellCity] = useState("Thetford")
  const [useBuyOrders, setUseBuyOrders] = useState(false)
  const [useSellOrders, setUseSellOrders] = useState(false)
  const [includeTransport, setIncludeTransport] = useState(true)

  const handleCalculate = () => {
    if (!selectedItem || !buyCity || !sellCity) {
      alert("Please select an item, buy city, and sell city")
      return
    }

    if (buyCity === sellCity) {
      alert("Buy city and sell city must be different")
      return
    }

    onCalculate({
      item: selectedItem,
      buyCity,
      sellCity,
      useBuyOrders,
      useSellOrders,
      includeTransport,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Item Flipper Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <ItemSelector value={selectedItem} onChange={setSelectedItem} label="Select Item to Flip" />

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="buy-city">Buy From City</Label>
            <select
              id="buy-city"
              value={buyCity}
              onChange={(e) => setBuyCity(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-input bg-background"
            >
              {CITIES.map((city) => (
                <option key={city.id} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sell-city">Sell To City</Label>
            <select
              id="sell-city"
              value={sellCity}
              onChange={(e) => setSellCity(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-input bg-background"
            >
              {CITIES.map((city) => (
                <option key={city.id} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="buy-orders"
              checked={useBuyOrders}
              onCheckedChange={(checked) => setUseBuyOrders(checked as boolean)}
            />
            <Label htmlFor="buy-orders" className="text-sm font-normal cursor-pointer">
              Use buy orders (lower price, may take time)
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="sell-orders"
              checked={useSellOrders}
              onCheckedChange={(checked) => setUseSellOrders(checked as boolean)}
            />
            <Label htmlFor="sell-orders" className="text-sm font-normal cursor-pointer">
              Use sell orders (higher price, may take time)
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="transport"
              checked={includeTransport}
              onCheckedChange={(checked) => setIncludeTransport(checked as boolean)}
            />
            <Label htmlFor="transport" className="text-sm font-normal cursor-pointer">
              Include transport fees (5% of item value)
            </Label>
          </div>
        </div>

        <Button onClick={handleCalculate} className="w-full" size="lg">
          Calculate Flip Profit
        </Button>
      </CardContent>
    </Card>
  )
}
