"use server"

import { revalidatePath } from "next/cache"
import { addExercise, addProgressEntry, getExerciseProgress, getExercises } from "@/lib/google-sheets"
import type { ExerciseData, ExerciseProgress } from "@/lib/google-sheets"
import { cookies } from "next/headers"
import { google } from 'googleapis'

interface SheetRow {
  id: string
  name: string
  category: string
  lastWeight: number
  personalBest: number
  unit: string
}

async function getSheet(userId: string) {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })

  const sheets = google.sheets({ version: 'v4', auth })
  const spreadsheetId = process.env.GOOGLE_SHEET_ID

  if (!spreadsheetId) {
    throw new Error('GOOGLE_SHEET_ID is not defined')
  }

  const sheetName = `${userId}Exercises`
  const range = `${sheetName}!A1:Z1000`

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  })

  const rows = response.data.values || []
  return {
    getRows: async () => {
      return rows.map((row: any[], index: number) => ({
        id: row[0] || '',
        name: row[1] || '',
        category: row[2] || '',
        lastWeight: Number(row[3]) || 0,
        personalBest: Number(row[4]) || 0,
        unit: row[5] || 'kgs'
      })) as SheetRow[]
    }
  }
}

export async function createExercise(formData: FormData) {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get("userId")?.value
    
    if (!userId) {
      console.error("No userId found in cookies")
      return { success: false, message: "User not authenticated" }
    }

    const name = formData.get("name") as string
    const category = formData.get("category") as string
    const lastWeight = Number.parseFloat(formData.get("lastWeight") as string)
    const personalBest = Number.parseFloat(formData.get("personalBest") as string) || lastWeight
    const unit = formData.get("unit") as string


    if (!name || !category) {
      console.error("Missing required fields")
      return { success: false, message: "Name and category are required" }
    }

    await addExercise(userId, {
      name,
      category,
      lastWeight,
      personalBest,
      unit: unit || "kgs",
    })

    revalidatePath("/dashboard/exercises")
    return { success: true, message: "Exercise added successfully" }
  } catch (error) {
    console.error("Error in createExercise:", error)
    return { success: false, message: "Failed to add exercise" }
  }
}

export async function logProgress(userId: string, formData: FormData) {
  try {
    const exerciseId = formData.get("exerciseId") as string
    const date = formData.get("date") as string
    const weight = Number.parseFloat(formData.get("weight") as string)
    const reps = Number.parseInt(formData.get("reps") as string)
    const sets = Number.parseInt(formData.get("sets") as string)

    if (!exerciseId || !date || isNaN(weight) || isNaN(reps) || isNaN(sets)) {
      return { success: false, message: "All fields are required" }
    }

    await addProgressEntry(userId, {
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
export async function getExerciseById(userId: string, id: string) {
  try {
    const sheet = await getSheet(userId)
    const rows = await sheet.getRows()
    const exercise = rows.find(row => row.id === id)
    return exercise ? {
      id: exercise.id,
      name: exercise.name,
      category: exercise.category,
      lastWeight: Number(exercise.lastWeight) || 0,
      personalBest: Number(exercise.personalBest) || 0,
      unit: exercise.unit || 'kgs'
    } : null
  } catch (error) {
    console.error('Error getting exercise by id:', error)
    return null
  }
}

export async function getExerciseProgressById(userId: string, id: string) {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    })

    const sheets = google.sheets({ version: 'v4', auth })
    const spreadsheetId = process.env.GOOGLE_SHEET_ID

    if (!spreadsheetId) {
      throw new Error('GOOGLE_SHEET_ID is not defined')
    }

    const sheetName = `${userId}Progress`
    const range = `${sheetName}!A1:Z1000`

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    })

    const rows = response.data.values || []
    const progressRows = rows.filter(row => row[0] === id)
    
    return progressRows.map(row => ({
      date: row[1] || new Date().toISOString().split('T')[0],
      weight: Number(row[2]) || 0,
      reps: Number(row[3]) || 0,
      sets: Number(row[4]) || 0
    }))
  } catch (error) {
    console.error('Error getting exercise progress by id:', error)
    return []
  }
}

export async function getAllExercises(): Promise<ExerciseData[]> {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get("userId")?.value
    if (!userId) {
      console.error("No user ID found in cookies")
      return []
    }
    return await getExercises(userId)
  } catch (error) {
    console.error("Error fetching exercises:", error)
    return []
  }
}

export async function logProgressAction(formData: FormData) {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get("userId")?.value

    if (!userId) {
      return { success: false, message: "User not authenticated" }
    }

    return await logProgress(userId, formData)
  } catch (error) {
    console.error("Error in logProgressAction:", error)
    return { success: false, message: "Failed to log progress" }
  }
}
