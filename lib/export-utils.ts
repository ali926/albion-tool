import type { TopProfitItem } from "@/components/top-profits-table"

export function exportToCSV(items: TopProfitItem[], filename = "albion-profits") {
  if (typeof window === "undefined") {
    return
  }

  if (items.length === 0) {
    return
  }

  // CSV headers
  const headers = ["Rank", "Item", "Tier", "Enchantment", "City", "Profit", "Margin (%)", "Trend", "Details"]

  // CSV rows
  const rows = items.map((item, index) => [
    (index + 1).toString(),
    item.itemName,
    item.tier.toString(),
    item.enchantment.toString(),
    item.city || `${item.buyCity} → ${item.sellCity}` || "",
    item.profit.toString(),
    item.profitMargin.toFixed(2),
    item.priceChange?.trend || "stable",
    item.details || "",
  ])

  // Combine headers and rows
  const csvContent = [headers.join(","), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(","))].join("\n")

  // Create blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)

  link.setAttribute("href", url)
  link.setAttribute("download", `${filename}-${new Date().toISOString().split("T")[0]}.csv`)
  link.style.visibility = "hidden"

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function copyToClipboard(text: string): Promise<void> {
  if (typeof window === "undefined" || !navigator.clipboard) {
    return Promise.reject(new Error("Clipboard not available"))
  }

  return navigator.clipboard.writeText(text)
}
