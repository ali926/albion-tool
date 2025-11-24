"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ItemSelector } from "@/components/item-selector"
import { CitySelector } from "@/components/city-selector"
import { Loader2 } from "lucide-react"
import type { City, Tier, Enchantment } from "@/types/albion"

interface CraftingCalculatorFormProps {
  onCalculate: (params: {
    itemCategory: string
    tier: Tier
    enchantment: Enchantment
    cities: City[]
    useFocus: boolean
    useJournal: boolean
  }) => void
  isCalculating: boolean
}

export function CraftingCalculatorForm({ onCalculate, isCalculating }: CraftingCalculatorFormProps) {
  const [itemCategory, setItemCategory] = useState<string>("")
  const [tier, setTier] = useState<Tier>(4)
  const [enchantment, setEnchantment] = useState<Enchantment>(0)
  const [cities, setCities] = useState<City[]>(["Caerleon"])
  const [useFocus, setUseFocus] = useState(false)
  const [useJournal, setUseJournal] = useState(false)

  const handleCalculate = () => {
    if (!itemCategory) return

    onCalculate({
      itemCategory,
      tier,
      enchantment,
      cities,
      useFocus,
      useJournal,
    })
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Item Category</label>
          <Select value={itemCategory} onValueChange={setItemCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select item to craft" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sword">Broadsword</SelectItem>
              <SelectItem value="axe">Battleaxe</SelectItem>
              <SelectItem value="hammer">Hammer</SelectItem>
              <SelectItem value="bow">Bow</SelectItem>
              <SelectItem value="staff">Fire Staff</SelectItem>
              <SelectItem value="plate_helmet">Plate Helmet</SelectItem>
              <SelectItem value="plate_armor">Plate Armor</SelectItem>
              <SelectItem value="plate_boots">Plate Boots</SelectItem>
              <SelectItem value="leather_helmet">Leather Helmet</SelectItem>
              <SelectItem value="leather_armor">Leather Armor</SelectItem>
              <SelectItem value="leather_boots">Leather Boots</SelectItem>
              <SelectItem value="cloth_helmet">Cloth Helmet</SelectItem>
              <SelectItem value="cloth_armor">Cloth Armor</SelectItem>
              <SelectItem value="cloth_boots">Cloth Boots</SelectItem>
              <SelectItem value="bag">Bag</SelectItem>
              <SelectItem value="cape">Cape</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <ItemSelector
          selectedTier={tier}
          selectedEnchantment={enchantment}
          onTierChange={setTier}
          onEnchantmentChange={setEnchantment}
          disabled={!itemCategory}
        />

        <CitySelector selectedCities={cities} onCitiesChange={setCities} />

        <div className="space-y-3 pt-2 border-t">
          <label className="text-sm font-medium">Options</label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="focus" checked={useFocus} onCheckedChange={(checked) => setUseFocus(!!checked)} />
              <label htmlFor="focus" className="text-sm cursor-pointer">
                Use Focus (50% resource return)
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="journal" checked={useJournal} onCheckedChange={(checked) => setUseJournal(!!checked)} />
              <label htmlFor="journal" className="text-sm cursor-pointer">
                Use Crafting Journal (15% fame bonus)
              </label>
            </div>
          </div>
        </div>

        <Button
          onClick={handleCalculate}
          disabled={!itemCategory || cities.length === 0 || isCalculating}
          className="w-full"
        >
          {isCalculating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Calculate Profit
        </Button>
      </div>
    </Card>
  )
}
