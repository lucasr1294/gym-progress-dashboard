import { Suspense } from "react"
import { getExerciseById, getExerciseProgressById } from "@/app/actions/exercise-actions"
import { ExerciseDetailClient } from "@/components/exercise-detail-client"
import { Skeleton } from "@/components/ui/skeleton"

interface ExerciseDetailPageProps {
  params: {
    id: string
  }
}

export default async function ExerciseDetailPage(props: ExerciseDetailPageProps) {
  const { id } = props.params 
  console.log(id)

  const exercise = await getExerciseById(id)
  const progressData = exercise ? await getExerciseProgressById(id) : []

  return (
    <ExerciseDetailClient exercise={exercise} progressData={progressData} />
  )
}

async function ExerciseDetailContent({ id }: { id: string }) {
  const exercise = await getExerciseById(id)
  const progressData = exercise ? await getExerciseProgressById(id) : []

  return <ExerciseDetailClient exercise={exercise} progressData={progressData} />
}

function ExerciseDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-10" />
          <div>
            <Skeleton className="h-8 w-48 mb-1" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <div key={i}>
              <Skeleton className="h-32 w-full" />
            </div>
          ))}
      </div>

      <Skeleton className="h-[300px] w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  )
}
