import { Suspense } from "react"
import { getAllExercises } from "@/app/actions/exercise-actions"
import { AddExerciseForm } from "@/components/add-exercise-form"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ExercisesContent } from "@/components/exercises-content"

export default function ExercisesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6 mt-4">
        <h1 className="text-3xl font-bold tracking-tight">Ejercicios por categoría</h1>
        <AddExerciseForm />
      </div>
      <Suspense fallback={<ExercisesSkeleton />}>
        <ExercisesContentWrapper />
      </Suspense>
    </div>
  )
}

async function ExercisesContentWrapper() {
  const exercises = await getAllExercises()
  return <ExercisesContent exercises={exercises} />
}

function ExercisesSkeleton() {
  return (
    <>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 space-y-6">
        <Skeleton className="h-8 w-48 mb-4" />
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {Array(3)
                    .fill(0)
                    .map((_, j) => (
                      <Card key={j}>
                        <CardHeader className="pb-2">
                          <Skeleton className="h-5 w-32" />
                        </CardHeader>
                        <CardContent>
                          <div className="flex justify-between items-center">
                            <div>
                              <Skeleton className="h-3 w-20 mb-2" />
                              <Skeleton className="h-4 w-16" />
                            </div>
                            <div>
                              <Skeleton className="h-3 w-20 mb-2" />
                              <Skeleton className="h-4 w-16" />
                            </div>
                            <Skeleton className="h-4 w-16" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </>
  )
}
