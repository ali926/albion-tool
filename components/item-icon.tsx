import { getItemIconUrl } from "@/lib/constants/item-icons"
import Image from "next/image"

interface ItemIconProps {
  itemId: string
  tier: number
  enchantment?: number
  size?: number
  className?: string
}

export function ItemIcon({ itemId, tier, enchantment = 0, size = 32, className = "" }: ItemIconProps) {
  const iconUrl = getItemIconUrl(itemId, tier, enchantment)

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <Image
        src={iconUrl || "/placeholder.svg"}
        alt={itemId}
        width={size}
        height={size}
        className="object-contain"
        onError={(e) => {
          // Fallback to a placeholder if icon fails to load
          const target = e.target as HTMLImageElement
          target.src = `/placeholder.svg?height=${size}&width=${size}`
        }}
      />
      {enchantment > 0 && (
        <div className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
          {enchantment}
        </div>
      )}
    </div>
  )
}
