"use client"

import Link from "next/link"
import { ArrowUpRight, Dumbbell, BarChart3 } from "lucide-react"

import type { ExerciseData } from "@/lib/google-sheets"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface DashboardContentProps {
  exercises: ExerciseData[]
}

export function DashboardContent({ exercises }: DashboardContentProps) {
  // Calculate some stats
  const totalExercises = exercises.length
  const categories = [...new Set(exercises.map((ex) => ex.category))]
  const personalBests = exercises.filter((ex) => ex.lastWeight === ex.personalBest).length

  return (
    <>
      <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Exercises</CardTitle>
            <Dumbbell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalExercises}</div>
            <p className="text-xs text-muted-foreground">Tracked exercises in your routine</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground">Different muscle groups</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Personal Bests</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{personalBests}</div>
            <p className="text-xs text-muted-foreground">Exercises at personal best</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M2 10h20" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Date().toLocaleDateString()}</div>
            <p className="text-xs text-muted-foreground">Last workout session</p>
          </CardContent>
        </Card>
      </div>
      <div className="mt-4 md:mt-6">
        <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4">Recent Exercises</h2>
        {exercises.length === 0 && (
          <p className="text-sm md:text-base text-muted-foreground">No tienes ejercicios registrados</p>
        )}
        <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {exercises.slice(0, 6).map((exercise) => (
            <Card key={exercise.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base md:text-lg">{exercise.name}</CardTitle>
                <CardDescription className="text-xs md:text-sm">{exercise.category}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
                  <div>
                    <p className="text-xs md:text-sm text-muted-foreground">Last Weight</p>
                    <p className="text-sm md:text-base font-medium">
                      {exercise.lastWeight} {exercise.unit}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-muted-foreground">Personal Best</p>
                    <p className="text-sm md:text-base font-medium">
                      {exercise.personalBest} {exercise.unit}
                    </p>
                  </div>
                  <Link
                    href={`/dashboard/exercises/${exercise.id}`}
                    className="flex items-center text-xs md:text-sm text-blue-500 hover:underline mt-2 sm:mt-0"
                  >
                    Details
                    <ArrowUpRight className="ml-1 h-3 w-3" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  )
}
