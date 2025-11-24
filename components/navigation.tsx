"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Calculator, Droplets, TrendingUp, Repeat } from "lucide-react"

const navItems = [
  { name: "Home", href: "/", icon: null },
  { name: "Crafting", href: "/crafting", icon: Calculator },
  { name: "Refining", href: "/refining", icon: Droplets },
  { name: "BM Flips", href: "/bm-flips", icon: TrendingUp },
  { name: "Item Flipper", href: "/item-flipper", icon: Repeat },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="border-b border-border bg-card">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center font-bold text-primary-foreground">
              AT
            </div>
            <span className="font-semibold text-lg">Albion Tools</span>
          </Link>

          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
                  )}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  {item.name}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
