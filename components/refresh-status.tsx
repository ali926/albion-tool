"use client"

import { RefreshCw, Pause, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface RefreshStatusProps {
  isRefreshing: boolean
  lastRefreshed: Date | null
  isPaused: boolean
  onTogglePause: () => void
  onManualRefresh: () => void
}

export function RefreshStatus({
  isRefreshing,
  lastRefreshed,
  isPaused,
  onTogglePause,
  onManualRefresh,
}: RefreshStatusProps) {
  const getTimeAgo = (date: Date | null) => {
    if (!date) return "Never"

    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)

    if (seconds < 60) return `${seconds}s ago`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    return `${Math.floor(seconds / 3600)}h ago`
  }

  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
      <div className="flex items-center gap-2">
        <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin text-amber-500" : "text-muted-foreground"}`} />
        <div className="text-sm">
          <span className="text-muted-foreground">Last updated: </span>
          <span className="font-medium text-foreground">{getTimeAgo(lastRefreshed)}</span>
        </div>
      </div>

      {isRefreshing && (
        <Badge variant="outline" className="bg-amber-500/10 text-amber-500">
          Refreshing...
        </Badge>
      )}

      {isPaused && (
        <Badge variant="outline" className="bg-red-500/10 text-red-500">
          Paused
        </Badge>
      )}

      <div className="ml-auto flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onTogglePause} className="h-8 bg-transparent">
          {isPaused ? (
            <>
              <Play className="mr-1 h-3 w-3" />
              Resume
            </>
          ) : (
            <>
              <Pause className="mr-1 h-3 w-3" />
              Pause
            </>
          )}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onManualRefresh}
          disabled={isRefreshing}
          className="h-8 bg-transparent"
        >
          <RefreshCw className="mr-1 h-3 w-3" />
          Refresh Now
        </Button>
      </div>
    </div>
  )
}
