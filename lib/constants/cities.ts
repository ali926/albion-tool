import type { City } from "@/types/albion"

export const CITIES: City[] = [
  "Bridgewatch",
  "Caerleon",
  "Fort Sterling",
  "Lymhurst",
  "Martlock",
  "Thetford",
  "Black Market",
]

export const CITY_BONUSES: Record<City, { crafting: number; refining: number }> = {
  Bridgewatch: { crafting: 0, refining: 0 },
  Caerleon: { crafting: 0, refining: 0 },
  "Fort Sterling": { crafting: 0, refining: 0 },
  Lymhurst: { crafting: 0, refining: 0 },
  Martlock: { crafting: 0, refining: 0 },
  Thetford: { crafting: 0, refining: 0 },
  "Black Market": { crafting: 0, refining: 0 },
}
