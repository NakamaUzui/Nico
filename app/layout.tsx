import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import { ThemeProvider } from "@/components/theme-provider"
import { StoreProvider } from "@/context/store-context"
import { TranslationProvider } from "@/context/translation-context"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" })

export const metadata: Metadata = {
  title: "NICO - Bestsellers",
  description: "Discover our bestselling luxury fashion items",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans`} suppressHydrationWarning>
        <ThemeProvider 
          attribute="class" 
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <StoreProvider>
            <TranslationProvider>
              <Header />
              {children}
            </TranslationProvider>
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'