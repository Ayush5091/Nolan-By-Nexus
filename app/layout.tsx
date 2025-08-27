import type React from "react"
import "@/app/globals.css"
import { Inter, Montserrat } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import MobileDetectionWrapper from "@/components/mobile-detection-wrapper"

// Load Inter font
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
})

// Load Montserrat font with specific weights in sorted order
const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"], // Weights must be sorted and in string format
  variable: "--font-montserrat",
})

export const metadata = {
  title: "NOLAN | Writer & Critic",
  description: "Generate and critique screenplays with the power of AI",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${montserrat.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <MobileDetectionWrapper>{children}</MobileDetectionWrapper>
        </ThemeProvider>
      </body>
    </html>
  )
}

import "./globals.css"

import "./globals.css"

import "./globals.css"

import "./globals.css"

import "./globals.css"

import "./globals.css"



import './globals.css'