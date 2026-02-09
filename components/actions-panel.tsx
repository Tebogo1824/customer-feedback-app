"use client"

import { ArrowUpRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ActionItem } from "@/lib/types"

interface ActionsPanelProps {
  actions: ActionItem[]
}

function getPriorityStyles(priority: string) {
  switch (priority) {
    case "high":
      return {
        bg: "hsl(0, 72%, 94%)",
        text: "hsl(0, 72%, 40%)",
        border: "hsl(0, 72%, 85%)",
      }
    case "medium":
      return {
        bg: "hsl(43, 96%, 92%)",
        text: "hsl(43, 80%, 30%)",
        border: "hsl(43, 96%, 80%)",
      }
    default:
      return {
        bg: "hsl(160, 60%, 92%)",
        text: "hsl(160, 60%, 30%)",
        border: "hsl(160, 60%, 80%)",
      }
  }
}

export function ActionsPanel({ actions }: ActionsPanelProps) {
  return (
    <Card className="bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-foreground">
          Suggested Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {actions.map((action, i) => {
            const styles = getPriorityStyles(action.priority)
            return (
              <div
                key={i}
                className="rounded-lg border p-4"
                style={{ borderColor: styles.border }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold uppercase tracking-wide"
                        style={{
                          backgroundColor: styles.bg,
                          color: styles.text,
                        }}
                      >
                        {action.priority}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {action.theme}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-foreground">
                      {action.action}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {action.reasoning}
                    </p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
