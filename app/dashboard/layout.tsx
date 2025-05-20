import type React from "react"
import { Sidebar } from "@/components/sidebar"
import { MobileNav } from "@/components/mobile-nav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <MobileNav />
      <div className="flex flex-1">
        <Sidebar className="hidden md:flex" />
        <main className="flex-1 p-2 md:p-6 max-w-[95vw] md:max-w-none">{children}</main>
      </div>
    </div>
  )
}
