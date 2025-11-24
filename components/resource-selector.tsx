"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RESOURCE_CATEGORIES, REFINING_TIERS } from "@/lib/constants/refining"

interface ResourceSelectorProps {
  selectedCategory: string
  selectedTier: number
  onCategoryChange: (category: string) => void
  onTierChange: (tier: number) => void
}

export function ResourceSelector({
  selectedCategory,
  selectedTier,
  onCategoryChange,
  onTierChange,
}: ResourceSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Resource Type</Label>
          <Select value={selectedCategory} onValueChange={onCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select resource type" />
            </SelectTrigger>
            <SelectContent>
              {RESOURCE_CATEGORIES.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Tier</Label>
          <Select value={selectedTier.toString()} onValueChange={(v) => onTierChange(Number(v))}>
            <SelectTrigger>
              <SelectValue placeholder="Select tier" />
            </SelectTrigger>
            <SelectContent>
              {REFINING_TIERS.map((tier) => (
                <SelectItem key={tier.tier} value={tier.tier.toString()}>
                  {tier.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
