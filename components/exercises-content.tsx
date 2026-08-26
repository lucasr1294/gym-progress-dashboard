"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowUpRight, Search } from "lucide-react"
import type { ExerciseData } from "@/lib/google-sheets"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { EditExerciseForm } from "@/components/edit-exercise-form"
import { DeleteExerciseButton } from "@/components/delete-exercise-button"

interface ExercisesContentProps {
  exercises: ExerciseData[]
}

export function ExercisesContent({ exercises }: ExercisesContentProps) {
  const [search, setSearch] = useState("")

  const filteredExercises = exercises.filter((exercise) => {
    const query = search.trim().toLowerCase()
    if (!query) return true
    return (
      exercise.name.toLowerCase().includes(query) ||
      exercise.category.toLowerCase().includes(query)
    )
  })

  // Group exercises by category
  const exercisesByCategory = filteredExercises.reduce(
    (acc, exercise) => {
      if (!acc[exercise.category]) {
        acc[exercise.category] = []
      }
      acc[exercise.category].push(exercise)
      return acc
    },
    {} as Record<string, typeof exercises>,
  )

  return (
    <>
      <div className="relative mt-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar ejercicio por nombre o categoría..."
          className="pl-9"
        />
      </div>

      {exercises.length > 0 && filteredExercises.length === 0 && (
        <p className="mt-6 text-sm text-muted-foreground">
          No se encontraron ejercicios para "{search}".
        </p>
      )}

      {Object.keys(exercisesByCategory).length > 0 && (
        <div className="mt-8 space-y-6">
          {Object.entries(exercisesByCategory).map(([category, exercises]) => (
            <div key={category}>
              <h2 className="text-lg font-semibold">{category}</h2>
              <Separator className="mt-2 mb-4" />
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {exercises.map((exercise) => (
                  <Card key={exercise.id}>
                    <CardHeader className="pb-2 flex flex-row justify-between items-center gap-2">
                      <CardTitle className="text-lg">{exercise.name}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Link
                            href={`/dashboard/exercises/${exercise.id}`}
                            className="flex items-center text-sm text-primary underline-offset-4 hover:underline mr-1"
                          >
                            Ver
                            <ArrowUpRight className="ml-1 h-3 w-3" />
                          </Link>
                        <EditExerciseForm exercise={exercise} />
                        <DeleteExerciseButton exerciseId={exercise.id} exerciseName={exercise.name} />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Last Weight</p>
                          <p className="font-mono font-medium tabular-nums">
                            {exercise.lastWeight ? exercise.lastWeight : '-'} {exercise.unit}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Personal Best</p>
                          <p className="font-mono font-medium tabular-nums">
                            {exercise.personalBest ? exercise.personalBest : '-'} {exercise.unit}
                          </p>
                        </div>

                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
