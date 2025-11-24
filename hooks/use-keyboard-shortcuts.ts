"use client"

import { useEffect } from "react"

interface KeyboardShortcutOptions {
  onSearch?: () => void
  onCalculate?: () => void
  onExport?: () => void
  onRefresh?: () => void
}

export function useKeyboardShortcuts(options: KeyboardShortcutOptions) {
  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // Search shortcut: "/"
      if (e.key === "/" && !isInputFocused()) {
        e.preventDefault()
        options.onSearch?.()
      }

      // Calculate shortcut: "Enter" when not in input
      if (e.key === "Enter" && e.ctrlKey && !isInputFocused()) {
        e.preventDefault()
        options.onCalculate?.()
      }

      // Export shortcut: "Ctrl+E"
      if (e.key === "e" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        options.onExport?.()
      }

      // Refresh shortcut: "Ctrl+R" or "F5"
      if ((e.key === "r" && (e.ctrlKey || e.metaKey)) || e.key === "F5") {
        if (options.onRefresh) {
          e.preventDefault()
          options.onRefresh()
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [options])
}

function isInputFocused(): boolean {
  if (typeof window === "undefined" || !document.activeElement) {
    return false
  }

  const activeElement = document.activeElement
  return (
    activeElement instanceof HTMLInputElement ||
    activeElement instanceof HTMLTextAreaElement ||
    activeElement instanceof HTMLSelectElement
  )
}
