"use client"

import { useEffect, useRef, useState } from "react"

interface UseAutoRefreshOptions {
  interval?: number // in milliseconds
  onRefresh: () => Promise<void>
  enabled?: boolean
}

export function useAutoRefresh({
  interval = 5 * 60 * 1000, // 5 minutes default
  onRefresh,
  enabled = true,
}: UseAutoRefreshOptions) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null)
  const [isPaused, setIsPaused] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout>()

  const refresh = async () => {
    if (typeof window === "undefined") return
    if (isRefreshing) return

    setIsRefreshing(true)
    try {
      await onRefresh()
      setLastRefreshed(new Date())
    } catch (error) {
      console.error("[v0] Auto-refresh error:", error)
    } finally {
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    if (typeof window === "undefined") return

    if (!enabled || isPaused) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      return
    }

    // Set up interval (removed initial refresh to avoid build issues)
    intervalRef.current = setInterval(() => {
      refresh()
    }, interval)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [enabled, isPaused, interval])

  const togglePause = () => {
    setIsPaused((prev) => !prev)
  }

  const manualRefresh = () => {
    refresh()
  }

  return {
    isRefreshing,
    lastRefreshed,
    isPaused,
    togglePause,
    manualRefresh,
  }
}
