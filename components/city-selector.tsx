"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { CITIES } from "@/lib/constants/cities"
import type { City } from "@/types/albion"

interface CitySelectorProps {
  selectedCities: City[]
  onCitiesChange: (cities: City[]) => void
}

export function CitySelector({ selectedCities, onCitiesChange }: CitySelectorProps) {
  const cities = selectedCities || []

  const toggleCity = (city: City) => {
    if (cities.includes(city)) {
      onCitiesChange(cities.filter((c) => c !== city))
    } else {
      onCitiesChange([...cities, city])
    }
  }

  const selectAll = () => {
    onCitiesChange(CITIES)
  }

  const clearAll = () => {
    onCitiesChange([])
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Cities</label>
        <div className="flex gap-2">
          <button onClick={selectAll} className="text-xs text-primary hover:underline">
            Select All
          </button>
          <span className="text-xs text-muted-foreground">|</span>
          <button onClick={clearAll} className="text-xs text-primary hover:underline">
            Clear
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {CITIES.map((city) => (
          <div key={city} className="flex items-center space-x-2">
            <Checkbox id={city} checked={cities.includes(city)} onCheckedChange={() => toggleCity(city)} />
            <label htmlFor={city} className="text-sm cursor-pointer">
              {city}
            </label>
          </div>
        ))}
      </div>
    </div>
  )
}
