export interface FeedbackItem {
  text: string
  sentiment: "positive" | "negative" | "neutral"
  confidence: number
}

export interface ThemeItem {
  name: string
  count: number
  sentiment: "positive" | "negative" | "mixed"
  examples: string[]
}

export interface ActionItem {
  priority: "high" | "medium" | "low"
  action: string
  reasoning: string
  theme: string
}

export interface AnalysisResult {
  summary: string
  sentimentBreakdown: {
    positive: number
    negative: number
    neutral: number
  }
  averageConfidence: number
  themes: ThemeItem[]
  actions: ActionItem[]
  feedbackItems: FeedbackItem[]
}
