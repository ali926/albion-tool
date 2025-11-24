// Albion Online item icon utility
// Uses the official Albion Online render service for item icons

export function getItemIconUrl(itemId: string, tier = 4, enchantment = 0): string {
  // Format: T{tier}_{ITEM_ID}@{enchantment}
  const formattedItemId = itemId.includes("T") ? itemId : `T${tier}_${itemId}`
  const enchantmentSuffix = enchantment > 0 ? `@${enchantment}` : ""

  // Albion Online's official render service
  return `https://render.albiononline.com/v1/item/${formattedItemId}${enchantmentSuffix}.png`
}

export function getResourceIconUrl(resourceId: string, tier = 4): string {
  // Resources use a simpler format
  const formattedId = `T${tier}_${resourceId}`
  return `https://render.albiononline.com/v1/item/${formattedId}.png`
}
