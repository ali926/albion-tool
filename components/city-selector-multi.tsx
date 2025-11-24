"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { CITIES } from "@/lib/constants/cities"

interface CitySelectorMultiProps {
  selectedCities: string[]
  onCitiesChange: (cities: string[]) => void
}

export function CitySelectorMulti({ selectedCities, onCitiesChange }: CitySelectorMultiProps) {
  const cities = selectedCities || []

  const handleCityToggle = (city: string) => {
    if (cities.includes(city)) {
      onCitiesChange(cities.filter((c) => c !== city))
    } else {
      onCitiesChange([...cities, city])
    }
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {CITIES.map((city) => (
        <div key={city} className="flex items-center space-x-2">
          <Checkbox
            id={`city-${city}`}
            checked={cities.includes(city)}
            onCheckedChange={() => handleCityToggle(city)}
          />
          <label
            htmlFor={`city-${city}`}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {city}
          </label>
        </div>
      ))}
    </div>
  )
}
