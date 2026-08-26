import type React from "react"
import type { Metadata } from "next"
import { Inter, IBM_Plex_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { UserProvider } from "./contexts/UserContext"
import { ClientLayout } from "./components/ClientLayout"

const inter = Inter({ subsets: ["latin"] })
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-mono-display",
})

export const metadata: Metadata = {
  title: "Gym Progress Dashboard",
  description: "Track your gym progress with Google Sheets integration",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${plexMono.variable}`}>
        <UserProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <ClientLayout>{children}</ClientLayout>
          </ThemeProvider>
        </UserProvider>
      </body>
    </html>
  )
}
