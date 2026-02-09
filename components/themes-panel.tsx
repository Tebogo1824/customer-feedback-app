"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ThemeItem } from "@/lib/types"

interface ThemesPanelProps {
  themes: ThemeItem[]
}

function getSentimentColor(sentiment: string) {
  switch (sentiment) {
    case "positive":
      return "hsl(160, 60%, 40%)"
    case "negative":
      return "hsl(0, 72%, 51%)"
    default:
      return "hsl(174, 62%, 40%)"
  }
}

export function ThemesPanel({ themes }: ThemesPanelProps) {
  const chartData = themes.slice(0, 8).map((t) => ({
    name: t.name.length > 14 ? `${t.name.slice(0, 14)}...` : t.name,
    count: t.count,
    sentiment: t.sentiment,
  }))

  return (
    <Card className="bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-foreground">
          Top Themes
        </CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 && (
          <div className="mb-6 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={110}
                  tick={{ fontSize: 12, fill: "hsl(220, 10%, 46%)" }}
                />
                <Tooltip
                  formatter={(value: number) => [value, "mentions"]}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid hsl(214, 16%, 89%)",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={getSentimentColor(entry.sentiment)}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {themes.map((theme) => (
            <div
              key={theme.name}
              className="rounded-lg border border-border bg-background p-3"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-foreground">
                  {theme.name}
                </span>
                <span
                  className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
                  style={{
                    backgroundColor:
                      theme.sentiment === "positive"
                        ? "hsl(160, 60%, 92%)"
                        : theme.sentiment === "negative"
                          ? "hsl(0, 72%, 94%)"
                          : "hsl(174, 40%, 92%)",
                    color:
                      theme.sentiment === "positive"
                        ? "hsl(160, 60%, 30%)"
                        : theme.sentiment === "negative"
                          ? "hsl(0, 72%, 40%)"
                          : "hsl(174, 62%, 25%)",
                  }}
                >
                  {theme.sentiment}
                </span>
              </div>
              {theme.examples.length > 0 && (
                <p className="text-xs text-muted-foreground italic truncate">
                  {`"${theme.examples[0]}"`}
                </p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
