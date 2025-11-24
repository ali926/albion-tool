"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Keyboard } from "lucide-react"

export function KeyboardShortcutsHelp() {
  const shortcuts = [
    { key: "/", description: "Focus search input" },
    { key: "Ctrl + Enter", description: "Calculate profit" },
    { key: "Ctrl + E", description: "Export to CSV" },
    { key: "Ctrl + R", description: "Refresh prices" },
  ]

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center text-base">
          <Keyboard className="h-4 w-4 mr-2" />
          Keyboard Shortcuts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {shortcuts.map((shortcut) => (
            <div key={shortcut.key} className="flex items-center justify-between">
              <span className="text-muted-foreground">{shortcut.description}</span>
              <Badge variant="outline">{shortcut.key}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
