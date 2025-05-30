"use client"

import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import type { ExerciseData } from "@/lib/google-sheets"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ExercisesContentProps {
  exercises: ExerciseData[]
}

export function ExercisesContent({ exercises }: ExercisesContentProps) {
  // Group exercises by category
  const exercisesByCategory = exercises.reduce(
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
      {/* <Card>
        <CardHeader>
          <CardTitle>All Exercises</CardTitle>
          <CardDescription>View and manage all your tracked exercises</CardDescription>
        </CardHeader>
        <CardContent>
          {exercises.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground mb-4">No exercises found. Add your first exercise to get started!</p>
              <AddExerciseForm />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Last Weight</TableHead>
                  <TableHead>Personal Best</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exercises.map((exercise) => (
                  <TableRow key={exercise.id}>
                    <TableCell className="font-medium">{exercise.name}</TableCell>
                    <TableCell>{exercise.category}</TableCell>
                    <TableCell>
                      {exercise.lastWeight} {exercise.unit}
                    </TableCell>
                    <TableCell>
                      {exercise.personalBest} {exercise.unit}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link
                        href={`/dashboard/exercises/${exercise.id}`}
                        className="flex items-center justify-end text-sm text-blue-500 hover:underline"
                      >
                        Details
                        <ArrowUpRight className="ml-1 h-3 w-3" />
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card> */}

      {Object.keys(exercisesByCategory).length > 0 && (
        <div className="mt-8 space-y-6">
          {Object.entries(exercisesByCategory).map(([category, exercises]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle>{category}</CardTitle>
                <CardDescription>
                  Haz click en 'Ver' para acceder al detalle de cada ejercicio.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {exercises.map((exercise) => (
                    <Card key={exercise.id}>
                      <CardHeader className="pb-2 flex flex-row justify-between items-center">
                        <CardTitle className="text-lg">{exercise.name}</CardTitle>
                        <Link
                            href={`/dashboard/exercises/${exercise.id}`}
                            className="flex items-center text-sm text-blue-500 hover:underline"
                          >
                            Ver
                            <ArrowUpRight className="ml-1 h-3 w-3" />
                          </Link>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Last Weight</p>
                            <p className="font-medium">
                              {exercise.lastWeight ? exercise.lastWeight : '-'} {exercise.unit}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Personal Best</p>
                            <p className="font-medium">
                              {exercise.personalBest ? exercise.personalBest : '-'} {exercise.unit}
                            </p>
                          </div>
    
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  )
}
