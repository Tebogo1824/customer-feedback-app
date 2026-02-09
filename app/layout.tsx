import React from "react"
import type { Metadata, Viewport } from 'next'
import { Inter, Space_Mono } from 'next/font/google'

import './globals.css'

const _inter = Inter({ subsets: ['latin'] })
const _spaceMono = Space_Mono({ subsets: ['latin'], weight: ['400', '700'] })

export const metadata: Metadata = {
  title: 'FeedbackLens - Customer Feedback Analyzer',
  description:
    'Upload your customer feedback CSV and get AI-powered sentiment analysis, theme extraction, and actionable insights for your business.',
}

export const viewport: Viewport = {
  themeColor: '#2a9d8f',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
