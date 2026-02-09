import { generateText, Output } from "ai"
import { z } from "zod"

const analysisSchema = z.object({
  summary: z
    .string()
    .describe(
      "A 2-3 sentence executive summary of the overall customer feedback."
    ),
  sentimentBreakdown: z.object({
    positive: z.number().describe("Count of positive feedback items"),
    negative: z.number().describe("Count of negative feedback items"),
    neutral: z.number().describe("Count of neutral feedback items"),
  }),
  averageConfidence: z
    .number()
    .describe("Average confidence score from 0 to 1"),
  themes: z
    .array(
      z.object({
        name: z.string().describe("Theme name, e.g. 'Pricing', 'UX Issues'"),
        count: z.number().describe("How many feedback items mention this theme"),
        sentiment: z
          .enum(["positive", "negative", "mixed"])
          .describe("Overall sentiment of this theme"),
        examples: z
          .array(z.string())
          .describe("1-2 short example quotes from the feedback"),
      })
    )
    .describe("Top 3-6 recurring themes found in the feedback"),
  actions: z
    .array(
      z.object({
        priority: z
          .enum(["high", "medium", "low"])
          .describe("Priority level"),
        action: z
          .string()
          .describe("A specific, actionable recommendation"),
        reasoning: z
          .string()
          .describe("Brief reasoning based on the feedback data"),
        theme: z
          .string()
          .describe("Which theme this action relates to"),
      })
    )
    .describe("3-5 actionable recommendations sorted by priority"),
  feedbackItems: z
    .array(
      z.object({
        text: z.string().describe("The original feedback text (shortened)"),
        sentiment: z
          .enum(["positive", "negative", "neutral"])
          .describe("Sentiment of this item"),
        confidence: z
          .number()
          .describe("Confidence score from 0 to 1"),
      })
    )
    .describe("Each feedback item with its sentiment classification"),
})

export async function POST(req: Request) {
  try {
    const { feedbackRows } = await req.json()

    if (
      !feedbackRows ||
      !Array.isArray(feedbackRows) ||
      feedbackRows.length === 0
    ) {
      return Response.json(
        { error: "No feedback data provided." },
        { status: 400 }
      )
    }

    // Limit to 100 rows to keep cost/time reasonable
    const rows = feedbackRows.slice(0, 100) as string[]

    const feedbackText = rows
      .map((row: string, i: number) => `${i + 1}. "${row}"`)
      .join("\n")

    const { output } = await generateText({
      model: "openai/gpt-4o-mini",
      output: Output.object({ schema: analysisSchema }),
      messages: [
        {
          role: "system",
          content: `You are an expert customer feedback analyst for small businesses. 
Analyze the following customer feedback entries and provide:
1. An executive summary
2. Sentiment classification for each item (positive, negative, neutral) with confidence
3. Recurring themes with example quotes
4. Actionable recommendations sorted by priority

Be specific, practical, and focused on insights a solo founder or small team can act on immediately.
The sentimentBreakdown counts MUST add up to exactly ${rows.length} (the total number of feedback items).`,
        },
        {
          role: "user",
          content: `Here are ${rows.length} customer feedback entries to analyze:\n\n${feedbackText}`,
        },
      ],
    })

    return Response.json({ result: output })
  } catch (error) {
    console.error("Analysis error:", error)
    return Response.json(
      { error: "Failed to analyze feedback. Please try again." },
      { status: 500 }
    )
  }
}
