import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface FlipResult {
  item: string
  buyCity: string
  sellCity: string
  buyPrice: number
  sellPrice: number
  marketTax: number
  transportFee: number
  netProfit: number
  profitMargin: number
  useBuyOrders: boolean
  useSellOrders: boolean
}

interface ItemFlipperResultsProps {
  result: FlipResult | null
}

export function ItemFlipperResults({ result }: ItemFlipperResultsProps) {
  if (!result) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center text-muted-foreground">
            <p>Configure your flip settings and click Calculate to see results</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const isProfitable = result.netProfit > 0

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Flip Analysis</CardTitle>
          <Badge variant={isProfitable ? "default" : "destructive"}>{isProfitable ? "Profitable" : "Loss"}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 bg-muted/50 rounded-lg space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Item</span>
            <span className="font-semibold">{result.item}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Route</span>
            <span className="font-semibold">
              {result.buyCity} → {result.sellCity}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="text-sm">Buy Price ({result.useBuyOrders ? "Buy Order" : "Instant"})</span>
            <span className="font-mono">{result.buyPrice.toLocaleString()} silver</span>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="text-sm">Sell Price ({result.useSellOrders ? "Sell Order" : "Instant"})</span>
            <span className="font-mono text-green-500">+{result.sellPrice.toLocaleString()} silver</span>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="text-sm">Market Tax (4.5%)</span>
            <span className="font-mono text-red-500">-{result.marketTax.toLocaleString()} silver</span>
          </div>

          {result.transportFee > 0 && (
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-sm">Transport Fee (5%)</span>
              <span className="font-mono text-red-500">-{result.transportFee.toLocaleString()} silver</span>
            </div>
          )}
        </div>

        <div className="pt-4 border-t-2 border-border">
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-semibold">Net Profit</span>
            <span className={`text-2xl font-bold font-mono ${isProfitable ? "text-green-500" : "text-red-500"}`}>
              {isProfitable ? "+" : ""}
              {result.netProfit.toLocaleString()} silver
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Profit Margin</span>
            <span className={`font-semibold ${isProfitable ? "text-green-500" : "text-red-500"}`}>
              {result.profitMargin.toFixed(2)}%
            </span>
          </div>
        </div>

        {!isProfitable && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-sm text-red-500">
              This flip is not profitable. Consider using buy/sell orders or choose a different route.
            </p>
          </div>
        )}

        {isProfitable && result.profitMargin < 10 && (
          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <p className="text-sm text-amber-500">
              Low profit margin. Market prices may fluctuate before you complete the flip.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
