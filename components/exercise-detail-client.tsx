"use client"
import Link from "next/link"
import { ArrowLeft, Dumbbell, Pencil, Pickaxe, Trash } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { EditProgressForm } from "@/components/edit-progress-form"
import type { ExerciseData, ExerciseProgress } from "@/lib/google-sheets"
import { LogProgressForm } from "@/components/log-progress-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useState } from "react"
import { deleteWorkoutAction } from "@/app/actions/exercise-actions"
import { DeleteExerciseModal } from "@/components/ui/deleteExerciseModal"

interface ExerciseDetailClientProps {
  exercise: ExerciseData | null
  progressData: ExerciseProgress[]
  userId: string
}

export function ExerciseDetailClient({ exercise, progressData, userId }: ExerciseDetailClientProps) {

  const [editingWorkout, setEditingWorkout] = useState<ExerciseProgress | null>(null)
  const [workoutToDelete, setWorkoutToDelete] = useState<ExerciseProgress | null>(null)

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

  const firstWeight = (progressData[0]?.weight || 0) === 0
    ? Math.max(
      progressData[0]?.set1Weight ?? 0,
      progressData[0]?.set2Weight ?? 0,
      progressData[0]?.set3Weight ?? 0,
      progressData[0]?.set4Weight ?? 0
    )
    : progressData[0]?.weight

  const lastWeight = (progressData[progressData.length - 1]?.weight || 0) === 0
    ? Math.max(
      progressData[progressData.length - 1]?.set1Weight ?? 0,
      progressData[progressData.length - 1]?.set2Weight ?? 0,
      progressData[progressData.length - 1]?.set3Weight ?? 0,
      progressData[progressData.length - 1]?.set4Weight ?? 0
    )
    : progressData[progressData.length - 1]?.weight

  const lastLoggedEntry = progressData[progressData.length - 1]
  const lastSets = lastLoggedEntry
    ? [
        { weight: lastLoggedEntry.set1Weight ?? 0, reps: lastLoggedEntry.set1Reps ?? 0 },
        { weight: lastLoggedEntry.set2Weight ?? 0, reps: lastLoggedEntry.set2Reps ?? 0 },
        { weight: lastLoggedEntry.set3Weight ?? 0, reps: lastLoggedEntry.set3Reps ?? 0 },
        { weight: lastLoggedEntry.set4Weight ?? 0, reps: lastLoggedEntry.set4Reps ?? 0 },
      ].filter((set) => set.weight > 0 || set.reps > 0)
    : undefined

  const weightIncrease =
    progressData.length >= 2 ? (lastWeight ?? 0) - (firstWeight ?? 0) : 0

  const percentIncrease =
    progressData.length >= 2 && (firstWeight ?? 0) > 0
      ? (((lastWeight ?? 0) - (firstWeight ?? 0)) / (firstWeight ?? 0)) * 100
      : 0

  const handleDeleteWorkout = async (workout: ExerciseProgress) => {
    try {
      const result = await deleteWorkoutAction(workout)
      if (result.success) {
        window.location.reload() // Refresh the page to show updated data
      } else {
        alert(result.message)
      }
    } catch (error) {
      console.error('Error deleting workout:', error)
      alert('Failed to delete workout. Please try again.')
    } finally {
      setWorkoutToDelete(null)
    }
  }

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
        <LogProgressForm exerciseId={exercise.id} exerciseName={exercise.name} unit={exercise.unit} lastSets={lastSets} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Peso actual</CardTitle>
            <Dumbbell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-mono text-3xl font-bold tabular-nums text-accent-data">
              {exercise.lastWeight} {exercise.unit}
            </div>
            <p className="text-xs text-muted-foreground">Último peso registrado</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mejor peso</CardTitle>
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
            <div className="font-mono text-lg font-semibold tabular-nums text-accent-data">
              {exercise.personalBest} {exercise.unit}
            </div>
            <p className="text-xs text-muted-foreground">Mejor peso registrado</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aumento de peso</CardTitle>
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
            <div className="font-mono text-lg font-semibold tabular-nums">
              {weightIncrease > 0 ? "+" : ""}
              {weightIncrease} {exercise.unit}
            </div>
            <p className="text-xs text-muted-foreground">Desde el primer entrenamiento registrado</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
            <Pickaxe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-mono text-lg font-semibold tabular-nums">
              {percentIncrease > 0 ? "+" : ""}
              {percentIncrease.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">Percentage improvement</p>
          </CardContent>
        </Card>
      </div>

      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Progreso de peso máximo</CardTitle>
          <CardDescription>Rastrea tu progreso de fuerza para {exercise.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            {progressData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={progressData.map((progress) => ({
                    ...progress,
                    maxWeight: progress.weight && progress.weight > 0 ? progress.weight : Math.max(
                      progress.set1Weight || 0,
                      progress.set2Weight || 0,
                      progress.set3Weight || 0,
                      progress.set4Weight || 0
                    )
                  }))}
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
                      const [year, month, day] = date.split('-').map(Number)
                      return `${month}/${day}`
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
                    labelFormatter={(date) => {
                      const [year, month, day] = date.split('-').map(Number)
                      return `${month}/${day}`
                    }}
                  />
                  <Line type="monotone" dataKey="maxWeight" stroke="hsl(var(--accent-data))" activeDot={{ r: 8 }} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center flex-col gap-4">
                <p className="text-muted-foreground">No progress data available</p>
                <LogProgressForm exerciseId={exercise.id} exerciseName={exercise.name} unit={exercise.unit} lastSets={lastSets} />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {progressData.length > 0 ? (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Historial de entrenamiento</CardTitle>
              <CardDescription>Tu historial de entrenamiento para {exercise.name}</CardDescription>
            </div>
            <LogProgressForm exerciseId={exercise.id} exerciseName={exercise.name} unit={exercise.unit} lastSets={lastSets} />
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead className="text-center">Serie 1</TableHead>
                    <TableHead className="text-center">Serie 2</TableHead>
                    <TableHead className="text-center">Serie 3</TableHead>
                    <TableHead className="text-center">Serie 4</TableHead>
                    <TableHead className="text-center">Editar</TableHead>
                    <TableHead className="text-center">Eliminar</TableHead>
                  </TableRow>
                  <TableRow>
                    <TableHead></TableHead>
                    <TableHead className="text-center text-xs text-muted-foreground">Peso × Repes</TableHead>
                    <TableHead className="text-center text-xs text-muted-foreground">Peso × Repes</TableHead>
                    <TableHead className="text-center text-xs text-muted-foreground">Peso × Repes</TableHead>
                    <TableHead className="text-center text-xs text-muted-foreground">Peso × Repes</TableHead>
                    <TableHead></TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...progressData].reverse().map((workout, index) => (
                    <TableRow key={index}>
                      <TableCell>{workout.date}</TableCell>
                      <TableCell className="text-center font-mono tabular-nums">
                        {workout.weight ? `${workout.weight} ${exercise.unit} × ${workout.reps}` : workout.set1Weight ? `${workout.set1Weight} ${exercise.unit} × ${workout.set1Reps}` : '-'}
                      </TableCell>
                      <TableCell className="text-center font-mono tabular-nums">
                        {workout.weight ? `${workout.weight} ${exercise.unit} × ${workout.reps}` : workout.set2Weight ? `${workout.set2Weight} ${exercise.unit} × ${workout.set2Reps}` : '-'}
                      </TableCell>
                      <TableCell className="text-center font-mono tabular-nums">
                        {workout.weight ? `${workout.weight} ${exercise.unit} × ${workout.reps}` : workout.set3Weight ? `${workout.set3Weight} ${exercise.unit} × ${workout.set3Reps}` : '-'}
                      </TableCell>
                      <TableCell className="text-center font-mono tabular-nums">
                        {workout.weight ? `${workout.weight} ${exercise.unit} × ${workout.reps}` : workout.set4Weight ? `${workout.set4Weight} ${exercise.unit} × ${workout.set4Reps}` : '-'}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingWorkout(workout)}
                          aria-label={`Editar entrenamiento del ${workout.date}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setWorkoutToDelete(workout)}
                          aria-label={`Eliminar entrenamiento del ${workout.date}`}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ) : null}
      <DeleteExerciseModal
        workoutToDelete={workoutToDelete}
        setWorkoutToDelete={setWorkoutToDelete}
        handleDeleteWorkout={handleDeleteWorkout}
        unit={exercise.unit}
      />
      {editingWorkout && (
        <EditProgressForm
          exerciseId={exercise.id}
          exerciseName={exercise.name}
          unit={exercise.unit}
          workout={editingWorkout}
          open={!!editingWorkout}
          onOpenChange={(open) => !open && setEditingWorkout(null)}
        />
      )}
    </div>
  )
}
