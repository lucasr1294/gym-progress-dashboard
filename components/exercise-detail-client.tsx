"use client"
import Link from "next/link"
import { ArrowLeft, Dumbbell, Pickaxe } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

import type { ExerciseData, ExerciseProgress } from "@/lib/google-sheets"
import { LogProgressForm } from "@/components/log-progress-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface ExerciseDetailClientProps {
  exercise: ExerciseData | null
  progressData: ExerciseProgress[]
}

export function ExerciseDetailClient({ exercise, progressData }: ExerciseDetailClientProps) {

  if (!exercise) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/exercises">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Exercise Not Found</h1>
        </div>
        <p>The exercise you're looking for doesn't exist.</p>
        <Button asChild>
          <Link href="/dashboard/exercises">Back to Exercises</Link>
        </Button>
      </div>
    )
  }

  // Calculate progress metrics
  const weightIncrease =
    progressData.length >= 2 ? progressData[progressData.length - 1].weight - progressData[0].weight : 0

  const percentIncrease =
    progressData.length >= 2 && progressData[0].weight > 0
      ? ((progressData[progressData.length - 1].weight - progressData[0].weight) / progressData[0].weight) * 100
      : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/exercises">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{exercise.name}</h1>
            <p className="text-muted-foreground">{exercise.category}</p>
          </div>
        </div>
        <LogProgressForm exerciseId={exercise.id} exerciseName={exercise.name} unit={exercise.unit} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Weight</CardTitle>
            <Dumbbell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {exercise.lastWeight} {exercise.unit}
            </div>
            <p className="text-xs text-muted-foreground">Last recorded weight</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Personal Best</CardTitle>
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
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {exercise.personalBest} {exercise.unit}
            </div>
            <p className="text-xs text-muted-foreground">All-time best performance</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weight Increase</CardTitle>
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
            <div className="text-2xl font-bold">
              {weightIncrease > 0 ? "+" : ""}
              {weightIncrease} {exercise.unit}
            </div>
            <p className="text-xs text-muted-foreground">Since first recorded workout</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
            <Pickaxe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {percentIncrease > 0 ? "+" : ""}
              {percentIncrease.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">Percentage improvement</p>
          </CardContent>
        </Card>
      </div>

      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Weight Progress Over Time</CardTitle>
          <CardDescription>Track your strength gains for {exercise.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            {progressData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={progressData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date) => {
                      const d = new Date(date)
                      return `${d.getMonth() + 1}/${d.getDate()}`
                    }}
                  />
                  <YAxis
                    label={{
                      value: `Weight (${exercise.unit})`,
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <Tooltip
                    formatter={(value) => [`${value} ${exercise.unit}`, "Weight"]}
                    labelFormatter={(date) => new Date(date).toLocaleDateString()}
                  />
                  <Line type="monotone" dataKey="weight" stroke="#8884d8" activeDot={{ r: 8 }} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center flex-col gap-4">
                <p className="text-muted-foreground">No progress data available</p>
                <LogProgressForm exerciseId={exercise.id} exerciseName={exercise.name} unit={exercise.unit} />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {progressData.length > 0 ? (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Workout History</CardTitle>
              <CardDescription>Your recorded workouts for {exercise.name}</CardDescription>
            </div>
            <LogProgressForm exerciseId={exercise.id} exerciseName={exercise.name} unit={exercise.unit} />
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Weight</TableHead>
                    <TableHead>Sets</TableHead>
                    <TableHead>Reps</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...progressData].reverse().map((workout, index) => (
                    <TableRow key={index}>
                      <TableCell>{new Date(workout.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {workout.weight} {exercise.unit}
                      </TableCell>
                      <TableCell>{workout.sets}</TableCell>
                      <TableCell>{workout.reps}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
