import type React from "react"
import Link from "next/link"
import { Dumbbell, Home, LineChart, ListChecks } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  return (
    <div className={cn("flex flex-col border-r h-screen w-64 p-4", className)}>
      <div className="flex items-center gap-2 px-2 mb-8">
        <Dumbbell className="h-6 w-6" />
        <h1 className="text-xl font-bold">Weight Tracker</h1>
      </div>
      <nav className="flex flex-col gap-2">
        <Link href="/dashboard">
          <Button variant="ghost" className="w-full justify-start">
            <Home className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
        </Link>
        <Link href="/dashboard/exercises">
          <Button variant="ghost" className="w-full justify-start">
            <ListChecks className="mr-2 h-4 w-4" />
            Ejercicios
          </Button>
        </Link>
        <Link href="/dashboard/progress">
          <Button variant="ghost" className="w-full justify-start">
            <LineChart className="mr-2 h-4 w-4" />
            Progreso
          </Button>
        </Link>
      </nav>
    </div>
  )
}
