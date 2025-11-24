"use client"
import { Navigation } from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { Calculator, Droplets, TrendingUp, Repeat, ArrowRight } from "lucide-react"
import Link from "next/link"
import { FavoritesDashboard } from "@/components/favorites-dashboard"

const tools = [
  {
    title: "Crafting Calculator",
    description: "Calculate crafting profits with material costs, city bonuses, and return rates.",
    icon: Calculator,
    href: "/crafting",
    status: "Ready",
  },
  {
    title: "Refining Calculator",
    description: "Optimize refining profits with resource costs and city bonuses.",
    icon: Droplets,
    href: "/refining",
    status: "Ready",
  },
  {
    title: "Black Market Flips",
    description: "Find profitable items to flip on the Black Market.",
    icon: TrendingUp,
    href: "/bm-flips",
    status: "Ready",
  },
  {
    title: "Item Flipper",
    description: "Analyze market data to find the best items to buy and resell.",
    icon: Repeat,
    href: "/item-flipper",
    status: "Ready",
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight text-balance">Albion Online Profit Tools</h1>
            <p className="text-lg text-muted-foreground text-balance max-w-2xl mx-auto">
              Maximize your silver gains with comprehensive calculators and market analysis tools. Track profits,
              optimize strategies, and dominate the markets.
            </p>
          </div>

          <FavoritesDashboard />

          <div className="grid gap-6 md:grid-cols-2">
            {tools.map((tool) => {
              const Icon = tool.icon

              return (
                <Card key={tool.href} className="p-6 hover:bg-accent/50 transition-colors group">
                  <Link href={tool.href} className="block space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg">{tool.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{tool.description}</p>
                    </div>

                    <div className="pt-2">
                      <span className="text-xs font-medium text-primary">{tool.status}</span>
                    </div>
                  </Link>
                </Card>
              )
            })}
          </div>

          <Card className="p-6 bg-accent/30">
            <div className="space-y-4">
              <h2 className="font-semibold text-lg">About This Project</h2>
              <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
                <p>
                  This tool uses real-time market data from the Albion Online Data Project to provide accurate profit
                  calculations for crafting, refining, and market trading.
                </p>
                <p>Built for efficiency and ease of use, with a dark theme optimized for long trading sessions.</p>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
