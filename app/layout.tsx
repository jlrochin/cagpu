import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CAGPU - Catálogo de Atención",
  description: "Sistema de gestión CAGPU - Catálogo de Atención",
  generator: 'v0.dev',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/logo_cagpu_sintexto.png', sizes: '32x32', type: 'image/png' },
      { url: '/logo_cagpu_sintexto.png', sizes: '16x16', type: 'image/png' }
    ],
    shortcut: '/favicon.ico',
    apple: '/logo_cagpu_sintexto.png',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/logo_cagpu_sintexto.png',
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
