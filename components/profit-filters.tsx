"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { TIERS, ENCHANTMENTS } from "@/lib/constants/items"
import { CITIES } from "@/lib/constants/cities"
import type { City, Tier, Enchantment } from "@/types/albion"

export interface FilterOptions {
  tiers: Tier[]
  enchantments: Enchantment[]
  cities: City[]
  minProfit: number
  minMargin: number
  maxInvestment: number
  useFocus?: boolean
  useJournal?: boolean
}

interface ProfitFiltersProps {
  filters: FilterOptions
  onChange: (filters: FilterOptions) => void
  showFocusJournal?: boolean
}

export function ProfitFilters({ filters, onChange, showFocusJournal }: ProfitFiltersProps) {
  const tiers = filters?.tiers || []
  const enchantments = filters?.enchantments || []
  const cities = filters?.cities || []

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Tiers */}
        <div className="space-y-2">
          <Label>Tiers</Label>
          <div className="flex flex-wrap gap-4">
            {TIERS.map((tier) => (
              <div key={tier} className="flex items-center space-x-2">
                <Checkbox
                  id={`tier-${tier}`}
                  checked={tiers.includes(tier)}
                  onCheckedChange={(checked) => {
                    const newTiers = checked ? [...tiers, tier] : tiers.filter((t) => t !== tier)
                    onChange({ ...filters, tiers: newTiers })
                  }}
                />
                <Label htmlFor={`tier-${tier}`} className="cursor-pointer">
                  T{tier}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Enchantments */}
        <div className="space-y-2">
          <Label>Enchantments</Label>
          <div className="flex flex-wrap gap-4">
            {ENCHANTMENTS.map((ench) => (
              <div key={ench} className="flex items-center space-x-2">
                <Checkbox
                  id={`ench-${ench}`}
                  checked={enchantments.includes(ench)}
                  onCheckedChange={(checked) => {
                    const newEnch = checked ? [...enchantments, ench] : enchantments.filter((e) => e !== ench)
                    onChange({ ...filters, enchantments: newEnch })
                  }}
                />
                <Label htmlFor={`ench-${ench}`} className="cursor-pointer">
                  {ench === 0 ? "None" : `.${ench}`}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Cities */}
        <div className="space-y-2">
          <Label>Cities</Label>
          <div className="grid grid-cols-2 gap-4">
            {CITIES.map((city) => (
              <div key={city} className="flex items-center space-x-2">
                <Checkbox
                  id={`city-${city}`}
                  checked={cities.includes(city)}
                  onCheckedChange={(checked) => {
                    const newCities = checked ? [...cities, city] : cities.filter((c) => c !== city)
                    onChange({ ...filters, cities: newCities })
                  }}
                />
                <Label htmlFor={`city-${city}`} className="cursor-pointer text-sm">
                  {city}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Profit Thresholds */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="minProfit">Min Profit (silver)</Label>
            <Input
              id="minProfit"
              type="number"
              value={filters?.minProfit || 0}
              onChange={(e) => onChange({ ...filters, minProfit: Number(e.target.value) })}
              placeholder="0"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="minMargin">Min Margin (%)</Label>
            <Input
              id="minMargin"
              type="number"
              value={filters?.minMargin || 0}
              onChange={(e) => onChange({ ...filters, minMargin: Number(e.target.value) })}
              placeholder="0"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="maxInvestment">Max Investment (silver)</Label>
          <Input
            id="maxInvestment"
            type="number"
            value={filters?.maxInvestment === Number.POSITIVE_INFINITY ? "" : filters?.maxInvestment || ""}
            onChange={(e) =>
              onChange({
                ...filters,
                maxInvestment: e.target.value ? Number(e.target.value) : Number.POSITIVE_INFINITY,
              })
            }
            placeholder="No limit"
          />
        </div>

        {/* Focus & Journal Options */}
        {showFocusJournal && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="useFocus"
                checked={filters?.useFocus}
                onCheckedChange={(checked) => onChange({ ...filters, useFocus: checked as boolean })}
              />
              <Label htmlFor="useFocus" className="cursor-pointer">
                Use Focus
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="useJournal"
                checked={filters?.useJournal}
                onCheckedChange={(checked) => onChange({ ...filters, useJournal: checked as boolean })}
              />
              <Label htmlFor="useJournal" className="cursor-pointer">
                Use Journal
              </Label>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
