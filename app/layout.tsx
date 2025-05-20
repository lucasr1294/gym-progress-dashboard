import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { UserProvider } from "./contexts/UserContext"
import { LogoutButton } from "./components/logout-button"

const inter = Inter({ subsets: ["latin"] })

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
      <body className={inter.className}>
        <UserProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <div className="min-h-screen">
              <header className="border-b">
                <div className=" flex  justify-between px-4 py-2">
                  <h1 className="text-xl font-bold">Gym Dashboard</h1>
                  <LogoutButton />
                </div>
              </header>
              <main className="container px-4 py-6">
                {children}
              </main>
            </div>
          </ThemeProvider>
        </UserProvider>
      </body>
    </html>
  )
}
