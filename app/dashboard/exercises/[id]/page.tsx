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
