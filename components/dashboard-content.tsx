"use client"

import Link from "next/link"
import { ArrowUpRight, Dumbbell } from "lucide-react"

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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
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
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-4">Recent Exercises</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {exercises.slice(0, 6).map((exercise) => (
            <Card key={exercise.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{exercise.name}</CardTitle>
                <CardDescription>{exercise.category}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Last Weight</p>
                    <p className="font-medium">
                      {exercise.lastWeight} {exercise.unit}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Personal Best</p>
                    <p className="font-medium">
                      {exercise.personalBest} {exercise.unit}
                    </p>
                  </div>
                  <Link
                    href={`/dashboard/exercises/${exercise.id}`}
                    className="flex items-center text-sm text-blue-500 hover:underline"
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
