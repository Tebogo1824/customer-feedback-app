"use client"

import { useState } from "react"
import { BarChart3, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CsvUpload } from "@/components/csv-upload"
import { SummaryCards } from "@/components/summary-cards"
import { SentimentChart } from "@/components/sentiment-chart"
import { ThemesPanel } from "@/components/themes-panel"
import { ActionsPanel } from "@/components/actions-panel"
import type { AnalysisResult } from "@/lib/types"

export default function Page() {
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleUpload(rows: string[]) {
    setIsAnalyzing(true)
    setError(null)

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedbackRows: rows }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Analysis failed.")
      }

      setResult(data.result)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setIsAnalyzing(false)
    }
  }

  function handleReset() {
    setResult(null)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <BarChart3 className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">
              FeedbackLens
            </span>
          </div>
          {result && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="bg-transparent"
            >
              <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
              New Analysis
            </Button>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {!result ? (
          <div className="mx-auto max-w-xl">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold tracking-tight text-foreground text-balance">
                Understand your customer feedback in seconds
              </h1>
              <p className="mt-3 text-muted-foreground text-pretty">
                Upload a CSV of customer feedback and get AI-powered sentiment
                analysis, theme extraction, and actionable next steps.
              </p>
            </div>

            <CsvUpload onUpload={handleUpload} isAnalyzing={isAnalyzing} />

            {error && (
              <div className="mt-4 rounded-lg bg-destructive/10 p-4 text-center text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="mt-8 rounded-lg bg-muted p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
                Sample CSV format
              </p>
              <pre className="text-xs text-foreground font-mono leading-relaxed overflow-x-auto">
{`feedback,date,source
"Great product, love the new features!",2024-01-15,email
"Checkout process is confusing",2024-01-16,survey
"Fast shipping, very happy",2024-01-17,review`}
              </pre>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-xl font-bold text-foreground">
                Analysis Results
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {result.summary}
              </p>
            </div>

            <SummaryCards result={result} />

            <div className="grid gap-6 lg:grid-cols-2">
              <SentimentChart
                positive={result.sentimentBreakdown.positive}
                negative={result.sentimentBreakdown.negative}
                neutral={result.sentimentBreakdown.neutral}
                total={result.feedbackItems.length}
              />
              <ThemesPanel themes={result.themes} />
            </div>

            <ActionsPanel actions={result.actions} />

            <div className="rounded-lg border border-border bg-card p-4">
              <h3 className="mb-3 text-sm font-semibold text-foreground">
                Individual Feedback
              </h3>
              <div className="flex flex-col gap-2 max-h-96 overflow-y-auto">
                {result.feedbackItems.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-md bg-background p-3"
                  >
                    <span
                      className="mt-0.5 inline-block h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{
                        backgroundColor:
                          item.sentiment === "positive"
                            ? "hsl(160, 60%, 40%)"
                            : item.sentiment === "negative"
                              ? "hsl(0, 72%, 51%)"
                              : "hsl(43, 96%, 56%)",
                      }}
                    />
                    <p className="flex-1 text-sm text-foreground">
                      {item.text}
                    </p>
                    <span className="shrink-0 text-xs font-mono text-muted-foreground">
                      {Math.round(item.confidence * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-border bg-card mt-12">
        <div className="mx-auto max-w-6xl px-4 py-4 text-center text-xs text-muted-foreground">
          {"Built for solo founders & small teams. 100% free. Your data is never stored."}
        </div>
      </footer>
    </div>
  )
}
