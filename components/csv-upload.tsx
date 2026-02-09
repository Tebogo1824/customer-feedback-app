"use client"

import { useCallback, useState } from "react"
import { Upload, FileText, X, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface CsvUploadProps {
  onUpload: (rows: string[]) => void
  isAnalyzing: boolean
}

export function CsvUpload({ onUpload, isAnalyzing }: CsvUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [preview, setPreview] = useState<string[]>([])

  const parseCSV = useCallback((text: string): string[] => {
    const lines = text.split("\n").map((l) => l.trim()).filter(Boolean)
    if (lines.length < 2) {
      throw new Error("CSV must have at least a header row and one data row.")
    }

    const header = lines[0].toLowerCase()
    const cols = header.split(",").map((c) => c.replace(/"/g, "").trim())

    const feedbackCol = cols.findIndex(
      (c) =>
        c.includes("feedback") ||
        c.includes("comment") ||
        c.includes("review") ||
        c.includes("text") ||
        c.includes("message") ||
        c.includes("response")
    )

    if (feedbackCol === -1) {
      throw new Error(
        "Could not find a feedback column. Please include a column named 'feedback', 'comment', 'review', or 'text'."
      )
    }

    const rows: string[] = []
    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(",")
      const value = parts[feedbackCol]?.replace(/"/g, "").trim()
      if (value && value.length > 0) {
        rows.push(value)
      }
    }

    if (rows.length === 0) {
      throw new Error("No feedback entries found in the CSV.")
    }

    return rows
  }, [])

  const handleFile = useCallback(
    (f: File) => {
      setError(null)
      if (!f.name.endsWith(".csv")) {
        setError("Please upload a .csv file.")
        return
      }
      if (f.size > 2 * 1024 * 1024) {
        setError("File too large. Max 2MB.")
        return
      }
      setFile(f)
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string
          const rows = parseCSV(text)
          setPreview(rows.slice(0, 3))
          setError(null)
        } catch (err) {
          setError((err as Error).message)
          setFile(null)
          setPreview([])
        }
      }
      reader.readAsText(f)
    },
    [parseCSV]
  )

  const handleSubmit = useCallback(() => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string
        const rows = parseCSV(text)
        onUpload(rows)
      } catch (err) {
        setError((err as Error).message)
      }
    }
    reader.readAsText(file)
  }, [file, onUpload, parseCSV])

  return (
    <Card className="border-2 border-dashed border-border bg-card">
      <CardContent className="p-8">
        {!file ? (
          <div
            className={`flex flex-col items-center gap-4 py-12 rounded-lg transition-colors ${
              isDragging ? "bg-accent" : ""
            }`}
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault()
              setIsDragging(false)
              const f = e.dataTransfer.files[0]
              if (f) handleFile(f)
            }}
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent">
              <Upload className="h-7 w-7 text-accent-foreground" />
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-foreground">
                Drop your CSV here
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                or click to browse. Max 2MB.
              </p>
            </div>
            <label>
              <input
                type="file"
                accept=".csv"
                className="sr-only"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) handleFile(f)
                }}
              />
              <span className="inline-flex cursor-pointer items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity">
                Choose File
              </span>
            </label>
            <p className="text-xs text-muted-foreground">
              {"Include a column named 'feedback', 'comment', 'review', or 'text'."}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                  <FileText className="h-5 w-5 text-accent-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {preview.length}+ feedback entries detected
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setFile(null)
                  setPreview([])
                }}
                className="rounded-md p-1 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Remove file"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {preview.length > 0 && (
              <div className="rounded-lg bg-muted p-3">
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Preview
                </p>
                <div className="flex flex-col gap-1.5">
                  {preview.map((row, i) => (
                    <p
                      key={i}
                      className="truncate text-sm text-foreground"
                    >
                      {`"${row}"`}
                    </p>
                  ))}
                </div>
              </div>
            )}

            <Button
              onClick={handleSubmit}
              disabled={isAnalyzing}
              className="w-full"
              size="lg"
            >
              {isAnalyzing ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  Analyzing...
                </span>
              ) : (
                "Analyze Feedback"
              )}
            </Button>
          </div>
        )}

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
