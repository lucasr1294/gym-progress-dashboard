"use client"

import { useState } from "react"
import Link from "next/link"
import { Dumbbell, Home, LineChart, ListChecks, Menu, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex items-center justify-between p-1 border-b md:hidden">
      <div className="flex items-center gap-2">
        <Dumbbell className="h-6 w-6" />
        <h1 className="text-xl font-bold">Gym Progress</h1>
      </div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <Dumbbell className="h-6 w-6" />
                <h1 className="text-xl font-bold">Gym Progress</h1>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                <X className="h-6 w-6" />
                <span className="sr-only">Close menu</span>
              </Button>
            </div>
            <nav className="flex flex-col gap-2 p-4">
              <Link href="/dashboard" onClick={() => setOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">
                  <Home className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/dashboard/exercises" onClick={() => setOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">
                  <ListChecks className="mr-2 h-4 w-4" />
                  Exercises
                </Button>
              </Link>
              <Link href="/dashboard/progress" onClick={() => setOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">
                  <LineChart className="mr-2 h-4 w-4" />
                  Progress
                </Button>
              </Link>
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
