"use client"

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface SentimentChartProps {
  positive: number
  negative: number
  neutral: number
  total: number
}

const COLORS = {
  positive: "hsl(160, 60%, 40%)",
  negative: "hsl(0, 72%, 51%)",
  neutral: "hsl(43, 96%, 56%)",
}

export function SentimentChart({
  positive,
  negative,
  neutral,
  total,
}: SentimentChartProps) {
  const data = [
    { name: "Positive", value: positive, color: COLORS.positive },
    { name: "Negative", value: negative, color: COLORS.negative },
    { name: "Neutral", value: neutral, color: COLORS.neutral },
  ]

  const positivePercent = total > 0 ? Math.round((positive / total) * 100) : 0
  const negativePercent = total > 0 ? Math.round((negative / total) * 100) : 0
  const neutralPercent = total > 0 ? Math.round((neutral / total) * 100) : 0

  return (
    <Card className="bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-foreground">
          Sentiment Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-4 md:flex-row">
          <div className="h-48 w-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={80}
                  dataKey="value"
                  stroke="none"
                >
                  {data.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [value, "responses"]}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid hsl(214, 16%, 89%)",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-1 flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: COLORS.positive }}
                />
                <span className="text-sm text-foreground">Positive</span>
              </div>
              <span className="font-mono text-sm font-semibold text-foreground">
                {positivePercent}%
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${positivePercent}%`,
                  backgroundColor: COLORS.positive,
                }}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: COLORS.negative }}
                />
                <span className="text-sm text-foreground">Negative</span>
              </div>
              <span className="font-mono text-sm font-semibold text-foreground">
                {negativePercent}%
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${negativePercent}%`,
                  backgroundColor: COLORS.negative,
                }}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: COLORS.neutral }}
                />
                <span className="text-sm text-foreground">Neutral</span>
              </div>
              <span className="font-mono text-sm font-semibold text-foreground">
                {neutralPercent}%
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${neutralPercent}%`,
                  backgroundColor: COLORS.neutral,
                }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
