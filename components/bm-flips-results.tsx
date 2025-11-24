import { Card } from "@/components/ui/card"
import { ArrowRight, TrendingUp, TrendingDown } from "lucide-react"

interface BMFlipResult {
  itemName: string
  tier: number
  enchantment: number
  city: string
  marketBuyPrice: number
  blackMarketSellPrice: number
  transportFee: number
  marketplaceTax: number
  totalCost: number
  netProfit: number
  profitMargin: number
}

interface BMFlipsResultsProps {
  result: BMFlipResult | null
}

export function BMFlipsResults({ result }: BMFlipsResultsProps) {
  if (!result) {
    return (
      <Card className="p-8">
        <div className="text-center text-muted-foreground">
          <p>Select an item and calculate to see Black Market flip opportunities</p>
        </div>
      </Card>
    )
  }

  const isProfitable = result.netProfit > 0

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold">{result.itemName}</h3>
            <p className="text-sm text-muted-foreground">
              Tier {result.tier}
              {result.enchantment > 0 ? `.${result.enchantment}` : ""} • {result.city}
            </p>
          </div>
          <div className={`text-right ${isProfitable ? "text-green-500" : "text-red-500"}`}>
            <div className="flex items-center gap-2 justify-end">
              {isProfitable ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
              <span className="text-2xl font-bold">
                {result.netProfit > 0 ? "+" : ""}
                {result.netProfit.toLocaleString()}
              </span>
            </div>
            <p className="text-sm">
              {result.profitMargin > 0 ? "+" : ""}
              {result.profitMargin.toFixed(2)}% margin
            </p>
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="font-semibold mb-3 text-sm uppercase text-muted-foreground">Breakdown</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Market Buy Price ({result.city})</span>
              <span className="font-medium">{result.marketBuyPrice.toLocaleString()} silver</span>
            </div>

            {result.transportFee > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Transport Fee</span>
                <span className="font-medium text-amber-500">+{result.transportFee.toLocaleString()} silver</span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Cost</span>
              <span className="font-semibold">{result.totalCost.toLocaleString()} silver</span>
            </div>

            <div className="h-px bg-border my-2" />

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Black Market Sell Price</span>
              <span className="font-medium text-green-500">{result.blackMarketSellPrice.toLocaleString()} silver</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Marketplace Tax (15%)</span>
              <span className="font-medium text-red-500">-{result.marketplaceTax.toLocaleString()} silver</span>
            </div>

            <div className="h-px bg-border my-2" />

            <div className="flex items-center justify-between text-lg">
              <span className="font-semibold">Net Profit</span>
              <span className={`font-bold ${isProfitable ? "text-green-500" : "text-red-500"}`}>
                {result.netProfit > 0 ? "+" : ""}
                {result.netProfit.toLocaleString()} silver
              </span>
            </div>
          </div>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <ArrowRight className="h-5 w-5 text-amber-500" />
          </div>
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Black Market Tip</p>
            <p>
              Black Market prices fluctuate based on demand. Check prices regularly and consider buying in bulk when
              margins are high.
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}
