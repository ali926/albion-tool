"use client"

import { useEffect, useState } from "react"
import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PriceStatusProps {
  lastUpdated?: Date
  onRefresh?: () => void
  isLoading?: boolean
}

export function PriceStatus({ lastUpdated, onRefresh, isLoading }: PriceStatusProps) {
  const [timeAgo, setTimeAgo] = useState<string>("")

  useEffect(() => {
    if (!lastUpdated) return

    const updateTimeAgo = () => {
      const seconds = Math.floor((Date.now() - lastUpdated.getTime()) / 1000)

      if (seconds < 60) {
        setTimeAgo(`${seconds}s ago`)
      } else if (seconds < 3600) {
        setTimeAgo(`${Math.floor(seconds / 60)}m ago`)
      } else {
        setTimeAgo(`${Math.floor(seconds / 3600)}h ago`)
      }
    }

    updateTimeAgo()
    const interval = setInterval(updateTimeAgo, 10000) // Update every 10 seconds

    return () => clearInterval(interval)
  }, [lastUpdated])

  return (
    <div className="flex items-center gap-3 text-sm">
      {lastUpdated && (
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-muted-foreground">
            Last updated: <span className="text-foreground font-medium">{timeAgo}</span>
          </span>
        </div>
      )}

      {onRefresh && (
        <Button variant="outline" size="sm" onClick={onRefresh} disabled={isLoading} className="gap-2 bg-transparent">
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      )}
    </div>
  )
}
