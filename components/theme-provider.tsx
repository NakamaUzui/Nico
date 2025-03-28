'use client'

import * as React from 'react'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false)

  // Nur client-side rendern
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null // oder return <>{children}</> für eine erste Server-Renderung
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
