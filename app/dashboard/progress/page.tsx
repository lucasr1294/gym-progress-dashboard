import { Suspense } from "react"
import { getAllExercises } from "@/app/actions/exercise-actions"
import { ProgressContent } from "@/components/progress-content"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProgressPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Progress Overview</h1>
        <p className="text-muted-foreground">Visualize your strength gains and workout distribution.</p>
      </div>
      <Suspense fallback={<ProgressSkeleton />}>
        <ProgressContentWrapper />
      </Suspense>
    </div>
  )
}

async function ProgressContentWrapper() {
  const exercises = await getAllExercises()
  return <ProgressContent exercises={exercises} />
}

function ProgressSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <Skeleton className="h-6 w-40 mb-1" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[400px] w-full" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40 mb-1" />
          <Skeleton className="h-4 w-56" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40 mb-1" />
          <Skeleton className="h-4 w-56" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <div key={i}>
                  <Skeleton className="h-4 w-32 mb-1" />
                  <Skeleton className="h-8 w-20" />
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
