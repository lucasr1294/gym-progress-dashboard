"use server"

import { revalidatePath } from "next/cache"
import { addExercise, addProgressEntry, getExerciseProgress, getExercises } from "@/lib/google-sheets"
import type { ExerciseData, ExerciseProgress } from "@/lib/google-sheets"

export async function createExercise(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const category = formData.get("category") as string
    const lastWeight = Number.parseFloat(formData.get("lastWeight") as string)
    const personalBest = Number.parseFloat(formData.get("personalBest") as string) || lastWeight
    const unit = formData.get("unit") as string

    if (!name || !category) {
      return { success: false, message: "Name and category are required" }
    }

    await addExercise({
      name,
      category,
      lastWeight,
      personalBest,
      unit: unit || "kgs",
    })

    revalidatePath("/dashboard/exercises")
    return { success: true, message: "Exercise added successfully" }
  } catch (error) {
    console.error("Error creating exercise:", error)
    return { success: false, message: "Failed to add exercise" }
  }
}

export async function logProgress(formData: FormData) {
  try {
    const exerciseId = formData.get("exerciseId") as string
    const date = formData.get("date") as string
    const weight = Number.parseFloat(formData.get("weight") as string)
    const reps = Number.parseInt(formData.get("reps") as string)
    const sets = Number.parseInt(formData.get("sets") as string)

    if (!exerciseId || !date || isNaN(weight) || isNaN(reps) || isNaN(sets)) {
      return { success: false, message: "All fields are required" }
    }

    await addProgressEntry({
      exerciseId,
      date,
      weight,
      reps,
      sets,
    })

    revalidatePath(`/dashboard/exercises/${exerciseId}`)
    revalidatePath("/dashboard/exercises")
    revalidatePath("/dashboard")

    return { success: true, message: "Progress logged successfully" }
  } catch (error) {
    console.error("Error logging progress:", error)
    return { success: false, message: "Failed to log progress" }
  }
}

// New server actions to fetch data
export async function getExerciseById(id: string): Promise<ExerciseData | null> {
  try {
    const exercises = await getExercises()
    return exercises.find((ex) => ex.id === id) || null
  } catch (error) {
    console.error("Error fetching exercise:", error)
    return null
  }
}

export async function getExerciseProgressById(id: string): Promise<ExerciseProgress[]> {
  try {
    return await getExerciseProgress(id)
  } catch (error) {
    console.error("Error fetching exercise progress:", error)
    return []
  }
}

export async function getAllExercises(): Promise<ExerciseData[]> {
  try {
    return await getExercises()
  } catch (error) {
    console.error("Error fetching exercises:", error)
    return []
  }
}
