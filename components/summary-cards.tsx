"use client"

import { MessageSquare, TrendingUp, Layers, Zap } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import type { AnalysisResult } from "@/lib/types"

interface SummaryCardsProps {
  result: AnalysisResult
}

export function SummaryCards({ result }: SummaryCardsProps) {
  const totalFeedback = result.feedbackItems.length
  const { positive, negative } = result.sentimentBreakdown
  const netSentiment =
    totalFeedback > 0
      ? Math.round(((positive - negative) / totalFeedback) * 100)
      : 0

  const cards = [
    {
      label: "Total Feedback",
      value: totalFeedback.toString(),
      icon: MessageSquare,
      accent: "hsl(174, 62%, 40%)",
      bg: "hsl(174, 40%, 92%)",
    },
    {
      label: "Net Sentiment",
      value: `${netSentiment > 0 ? "+" : ""}${netSentiment}%`,
      icon: TrendingUp,
      accent: netSentiment >= 0 ? "hsl(160, 60%, 40%)" : "hsl(0, 72%, 51%)",
      bg: netSentiment >= 0 ? "hsl(160, 60%, 92%)" : "hsl(0, 72%, 94%)",
    },
    {
      label: "Themes Found",
      value: result.themes.length.toString(),
      icon: Layers,
      accent: "hsl(43, 96%, 46%)",
      bg: "hsl(43, 96%, 92%)",
    },
    {
      label: "Action Items",
      value: result.actions.length.toString(),
      icon: Zap,
      accent: "hsl(174, 62%, 30%)",
      bg: "hsl(174, 40%, 92%)",
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.label} className="bg-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg"
                style={{ backgroundColor: card.bg }}
              >
                <card.icon
                  className="h-5 w-5"
                  style={{ color: card.accent }}
                />
              </div>
              <div>
                <p className="text-2xl font-bold font-mono text-foreground">
                  {card.value}
                </p>
                <p className="text-xs text-muted-foreground">{card.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
