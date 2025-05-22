import { Suspense } from "react"
import { getExerciseById, getExerciseProgressById } from "@/app/actions/exercise-actions"
import { ExerciseDetailClient } from "@/components/exercise-detail-client"
import { Skeleton } from "@/components/ui/skeleton"
import { cookies } from "next/headers"
import { Metadata } from "next"

interface ExerciseDetailPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: ExerciseDetailPageProps): Promise<Metadata> {
  const cookieStore = await cookies()
  const userId = cookieStore.get("userId")?.value
  const { id } = params
  const exercise = userId ? await getExerciseById(userId, id) : null

  return {
    title: exercise ? `${exercise.name} - Exercise Details` : 'Exercise Not Found',
  }
}

export default async function ExerciseDetailPage({ params }: ExerciseDetailPageProps) {
  const cookieStore = await cookies()
  const userId = cookieStore.get("userId")?.value
  const { id } = params

  if (!userId) return null

  const exercise = await getExerciseById(userId, id)
  const progressData = exercise ? await getExerciseProgressById(userId, id) : []

  return (
    <ExerciseDetailClient exercise={exercise} progressData={progressData} />
  )
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
