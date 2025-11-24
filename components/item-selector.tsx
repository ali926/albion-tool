"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TIERS, ENCHANTMENTS } from "@/lib/constants/items"
import type { Tier, Enchantment } from "@/types/albion"

interface ItemSelectorProps {
  selectedTier: Tier
  selectedEnchantment: Enchantment
  onTierChange: (tier: Tier) => void
  onEnchantmentChange: (enchantment: Enchantment) => void
  disabled?: boolean
}

export function ItemSelector({
  selectedTier,
  selectedEnchantment,
  onTierChange,
  onEnchantmentChange,
  disabled = false,
}: ItemSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Tier</label>
        <Select
          value={selectedTier.toString()}
          onValueChange={(value) => onTierChange(Number.parseInt(value) as Tier)}
          disabled={disabled}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select tier" />
          </SelectTrigger>
          <SelectContent>
            {TIERS.filter((t) => t >= 4).map((tier) => (
              <SelectItem key={tier} value={tier.toString()}>
                Tier {tier}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Enchantment</label>
        <Select
          value={selectedEnchantment.toString()}
          onValueChange={(value) => onEnchantmentChange(Number.parseInt(value) as Enchantment)}
          disabled={disabled}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select enchantment" />
          </SelectTrigger>
          <SelectContent>
            {ENCHANTMENTS.map((ench) => (
              <SelectItem key={ench} value={ench.toString()}>
                {ench === 0 ? "Base" : `.${ench}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
