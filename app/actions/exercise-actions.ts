"use server"

import { revalidatePath } from "next/cache"
import { addExercise, addProgressEntry, getExerciseProgress, getExercises } from "@/lib/google-sheets"
import type { ExerciseData, ExerciseProgress } from "@/lib/google-sheets"
import { cookies } from "next/headers"
import { google } from 'googleapis'
import { GoogleSpreadsheet } from "google-spreadsheet"

interface SheetRow {
  id: string
  name: string
  category: string
  lastWeight: number
  personalBest: number
  unit: string
}

export const initializeGoogleSheets = async () => {
  try {
    const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!
    const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY!
    const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID!

    const doc = new GoogleSpreadsheet(GOOGLE_SHEET_ID)
    
    // Use the correct credential format
    await doc.useServiceAccountAuth({
      client_email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    })

    await doc.loadInfo()
    return doc
  } catch (error) {
    console.error("Error initializing Google Sheets:", error)
    throw error
  }
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

    if (!name || !category) {
      console.error("Missing required fields")
      return { success: false, message: "Name and category are required" }
    }

    await addExercise(userId, {
      name,
      category,
      lastWeight: 0,
      personalBest: 0,
      unit: 'kgs'
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
    const set1Weight = Number.parseFloat(formData.get("set_1_weight") as string)
    const set1Reps = Number.parseInt(formData.get("set_1_reps") as string)
    const set2Weight = Number.parseFloat(formData.get("set_2_weight") as string)
    const set2Reps = Number.parseInt(formData.get("set_2_reps") as string)
    const set3Weight = Number.parseFloat(formData.get("set_3_weight") as string)
    const set3Reps = Number.parseInt(formData.get("set_3_reps") as string)
    const set4Weight = Number.parseFloat(formData.get("set_4_weight") as string)
    const set4Reps = Number.parseInt(formData.get("set_4_reps") as string)

    await addProgressEntry(userId, {
      exerciseId,
      date,
      set1Weight,
      set1Reps,
      set2Weight,
      set2Reps,
      set3Weight,
      set3Reps,
      set4Weight,
      set4Reps,
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
      exerciseId: id,
      id: row[0] || '',
      date: row[1] || new Date().toISOString().split('T')[0],
      weight: Number(row[2]) || 0,
      reps: Number(row[3]) || 0,
      sets: Number(row[4]) || 0,
      set1Weight: Number(row[5]) || 0,
      set1Reps: Number(row[6]) || 0,
      set2Weight: Number(row[7]) || 0,
      set2Reps: Number(row[8]) || 0,
      set3Weight: Number(row[9]) || 0,
      set3Reps: Number(row[10]) || 0,
      set4Weight: Number(row[11]) || 0,
      set4Reps: Number(row[12]) || 0,
    }))
  } catch (error) {
    console.error('Error getting exercise progress by id:', error)
    return []
  }
}

export async function getLastWorkout() {
  const cookieStore = await cookies()
  const userId = cookieStore.get("userId")?.value
  if (!userId) {
    console.error("No user ID found in cookies")
    return null
  }

  const doc = await initializeGoogleSheets()

  const sheetName = `${userId}Progress`
  const sheet = doc.sheetsByTitle[sheetName]

  const rows = await sheet.getRows()
  const lastWorkout = rows.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]

  if (!lastWorkout) {
    return null
  }

  // Return a plain object with only the necessary data
  return {
    exerciseId: lastWorkout.exerciseId,
    date: lastWorkout.date,
    set1Weight: Number(lastWorkout.set1Weight) || 0,
    set1Reps: Number(lastWorkout.set1Reps) || 0,
    set2Weight: Number(lastWorkout.set2Weight) || 0,
    set2Reps: Number(lastWorkout.set2Reps) || 0,
    set3Weight: Number(lastWorkout.set3Weight) || 0,
    set3Reps: Number(lastWorkout.set3Reps) || 0,
    set4Weight: Number(lastWorkout.set4Weight) || 0,
    set4Reps: Number(lastWorkout.set4Reps) || 0
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

export async function updateProgressAction(formData: FormData) {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get("userId")?.value

    if (!userId) {
      return { success: false, message: "User not authenticated" }
    }

    return await updateProgress(userId, formData)
  } catch (error) {
    console.error("Error in updateProgressAction:", error)
    return { success: false, message: "Failed to update progress" }
  }
}

export async function updateProgress(userId: string, formData: FormData) {
  try {
    const exerciseId = formData.get("exerciseId") as string
    const date = formData.get("date") as string
    const set1Weight = Number.parseFloat(formData.get("set1Weight") as string)
    const set1Reps = Number.parseInt(formData.get("set1Reps") as string)
    const set2Weight = Number.parseFloat(formData.get("set2Weight") as string)
    const set2Reps = Number.parseInt(formData.get("set2Reps") as string)
    const set3Weight = Number.parseFloat(formData.get("set3Weight") as string)
    const set3Reps = Number.parseInt(formData.get("set3Reps") as string)
    const set4Weight = Number.parseFloat(formData.get("set4Weight") as string)
    const set4Reps = Number.parseInt(formData.get("set4Reps") as string)

    if (!exerciseId || !date || isNaN(set1Weight) || isNaN(set1Reps) || isNaN(set2Weight) || isNaN(set2Reps) || isNaN(set3Weight) || isNaN(set3Reps) || isNaN(set4Weight) || isNaN(set4Reps)) {
      return { success: false, message: "All fields are required" }
    }

    const doc = await initializeGoogleSheets()
    const progressSheetName = `${userId}Progress`
    const exercisesSheetName = `${userId}Exercises`
    
    const sheet = doc.sheetsByTitle[progressSheetName]
    const exercisesSheet = doc.sheetsByTitle[exercisesSheetName]

    // Get all rows and find the one to update
    const rows = await sheet.getRows()
    const rowToUpdate = rows.find(row => 
      row.exerciseId === exerciseId && row.date === date
    )

    if (!rowToUpdate) {
      return { success: false, message: "Workout entry not found" }
    }

    // Update the row
    rowToUpdate.set1Weight = set1Weight.toString()
    rowToUpdate.set1Reps = set1Reps.toString()
    rowToUpdate.set2Weight = set2Weight.toString()
    rowToUpdate.set2Reps = set2Reps.toString()
    rowToUpdate.set3Weight = set3Weight.toString()
    rowToUpdate.set3Reps = set3Reps.toString()
    rowToUpdate.set4Weight = set4Weight.toString()
    rowToUpdate.set4Reps = set4Reps.toString()

    await rowToUpdate.save()

    // Update the last weight in the Exercises sheet
    const exerciseRows = await exercisesSheet.getRows()
    const exerciseRow = exerciseRows.find((row) => row.id === exerciseId)

    if (exerciseRow) {
      const currentPB = Number.parseFloat(exerciseRow.personalBest as string || "0")

      const maxWeight = set1Weight || Math.max(
          set1Weight || 0,
          set2Weight || 0,
          set3Weight || 0,
          set4Weight || 0
        )

      // Update last weight
      exerciseRow.lastWeight = maxWeight.toString()

      // Update personal best if the new weight is higher
      if (maxWeight > currentPB) {
        exerciseRow.personalBest = maxWeight.toString()
      }

      await exerciseRow.save()
    }

    revalidatePath(`/dashboard/exercises/${exerciseId}`)
    revalidatePath("/dashboard/exercises")
    revalidatePath("/dashboard")

    return { success: true, message: "Progress updated successfully" }
  } catch (error) {
    console.error("Error updating progress:", error)
    return { success: false, message: "Failed to update progress" }
  }
}