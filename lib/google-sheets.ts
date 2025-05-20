import { GoogleSpreadsheet } from "google-spreadsheet"
import { JWT } from "google-auth-library"

// Types for our exercise data
export interface ExerciseData {
  id: string
  name: string
  category: string
  lastWeight: number
  personalBest: number
  unit: string
}

export interface ExerciseProgress {
  date: string
  weight: number
  reps: number
  sets: number
}

// Initialize the Google Sheets client
const initializeGoogleSheets = async () => {
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

// Get all exercises from the user-specific sheet
export const getExercises = async (userId: string): Promise<ExerciseData[]> => {
  try {
    const doc = await initializeGoogleSheets()
    
    const sheetName = `${userId}Exercises`
    let sheet = doc.sheetsByTitle[sheetName]

    const progressSheetName = `${userId}Progress`
    let progressSheet = doc.sheetsByTitle[progressSheetName]

    // If the sheet doesn't exist, create it with headers
    if (!sheet && !progressSheet) {
      try {
        sheet = await doc.addSheet({
          title: sheetName,
          headerValues: ["id", "name", "category", "lastWeight", "personalBest", "unit"],
        })

        progressSheet = await doc.addSheet({
          title: progressSheetName,
          headerValues: ["exerciseId", "date", "weight", "reps", "sets"],
        })

      } catch (error) {
        console.error("Error creating sheet:", error)
        // If sheet creation fails (e.g., already exists), try to get the existing sheet
        sheet = doc.sheetsByTitle[sheetName]
        if (!sheet) {
          throw error // If we still can't find the sheet, throw the original error
        }
      }
    }

    // Get rows from the sheet
    const rows = await sheet.getRows()

    return rows.map((row) => ({
      id: row.id as string,
      name: row.name as string,
      category: row.category as string,
      lastWeight: Number.parseFloat(row.lastWeight as string) || 0,
      personalBest: Number.parseFloat(row.personalBest as string) || 0,
      unit: row.unit as string || "lbs",
    }))
  } catch (error) {
    console.error("Error fetching exercises:", error)
    return []
  }
}

// Get progress data for a specific exercise
export const getExerciseProgress = async (userId: string, exerciseId: string): Promise<ExerciseProgress[]> => {
  try {
    const doc = await initializeGoogleSheets()
    const sheetName = `${userId}Progress`  // e.g., "IvanProgress"
    let sheet = doc.sheetsByTitle[sheetName]

    // If the sheet doesn't exist, create it with headers
    if (!sheet) {
      try {
        sheet = await doc.addSheet({ 
          title: sheetName, 
          headerValues: ["exerciseId", "date", "weight", "reps", "sets"] 
        })

        // Add some sample data if the sheet is new
        const today = new Date()
        const sampleData = []

        // Generate sample data for each exercise
        for (let i = 1; i <= 5; i++) {
          for (let j = 0; j < 10; j++) {
            const date = new Date(today)
            date.setDate(date.getDate() - j * 7) // Weekly data points

            // Generate a weight that generally increases over time (as we go back in time)
            // with some random variation
            const baseWeight = i === 1 ? 185 : i === 2 ? 225 : i === 3 ? 275 : i === 4 ? 135 : 0

            const randomVariation = Math.floor(Math.random() * 10) - 5 // -5 to +5
            const weightTrend = Math.max(0, baseWeight - j * 5) // Decrease as we go back in time
            const weight = weightTrend + randomVariation

            sampleData.push({
              exerciseId: i.toString(),
              date: date.toISOString().split("T")[0], // YYYY-MM-DD format
              weight,
              reps: Math.floor(Math.random() * 5) + 8, // 8-12 reps
              sets: Math.floor(Math.random() * 2) + 3, // 3-4 sets
            })
          }
        }

        await sheet.addRows(sampleData)
      } catch (error) {
        // If sheet creation fails (e.g., already exists), try to get the existing sheet
        sheet = doc.sheetsByTitle[sheetName]
        if (!sheet) {
          throw error // If we still can't find the sheet, throw the original error
        }
      }
    }

    // Get rows from the sheet
    const rows = await sheet.getRows()

    // Filter rows for the specific exercise
    const filteredRows = rows.filter((row) => row.exerciseId === exerciseId)

    return filteredRows
      .map((row) => ({
        date: row.date as string,
        weight: Number.parseFloat(row.weight as string) || 0,
        reps: Number.parseInt(row.reps as string) || 0,
        sets: Number.parseInt(row.sets as string) || 0,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  } catch (error) {
    console.error(`Error fetching progress for exercise ${exerciseId}:`, error)
    return []
  }
}

// Add a new exercise to the sheet
export const addExercise = async (userId: string, exercise: Omit<ExerciseData, "id">): Promise<ExerciseData> => {
  try {
    
    const doc = await initializeGoogleSheets()
    
    // Get Exercises sheet
    const exercisesSheetName = `${userId}Exercises`
    const exercisesSheet = doc.sheetsByTitle[exercisesSheetName]

    if (!exercisesSheet) {
      throw new Error(`Sheet ${exercisesSheetName} not found`)
    }

    // Get Progress sheet
    const progressSheetName = `${userId}Progress`
    const progressSheet = doc.sheetsByTitle[progressSheetName]

    if (!progressSheet) {
      throw new Error(`Sheet ${progressSheetName} not found`)
    }

    // Get all exercises to determine the next ID
    const rows = await exercisesSheet.getRows()
    
    const nextId = rows.length > 0 
      ? Math.max(...rows.map((row) => Number.parseInt(row.id as string || "0"))) + 1 
      : 1

    // Prepare the new exercise data
    const newExercise = {
      id: nextId.toString(),
      name: exercise.name,
      category: exercise.category,
      lastWeight: exercise.lastWeight || 0,
      personalBest: exercise.personalBest || exercise.lastWeight || 0,
      unit: exercise.unit || "kgs",
    }

    // Add the new exercise
    const addedRow = await exercisesSheet.addRow(newExercise)


    // Add initial progress entry if weight is provided
    if (exercise.lastWeight > 0) {
      const today = new Date().toISOString().split('T')[0]
      const initialProgress = {
        exerciseId: nextId.toString(),
        date: today,
        weight: exercise.lastWeight,
        reps: 0,
        sets: 0
      }
      await progressSheet.addRow(initialProgress)
    }
    
    return newExercise
  } catch (error) {
    console.error("Error in addExercise:", error)
    throw error
  }
}

// Add a new progress entry
export const addProgressEntry = async (
  userId: string,
  entry: { exerciseId: string } & Omit<ExerciseProgress, "id">,
): Promise<ExerciseProgress> => {
  try {
    const doc = await initializeGoogleSheets()
    const progressSheetName = `${userId}Progress`
    const exercisesSheetName = `${userId}Exercises`
    
    const sheet = doc.sheetsByTitle[progressSheetName]
    const exercisesSheet = doc.sheetsByTitle[exercisesSheetName]

    // Add the new progress entry
    await sheet.addRow(entry)

    // Update the last weight in the Exercises sheet
    const exerciseRows = await exercisesSheet.getRows()
    const exerciseRow = exerciseRows.find((row) => row.id === entry.exerciseId)

    if (exerciseRow) {
      const currentPB = Number.parseFloat(exerciseRow.personalBest as string || "0")

      // Update last weight
      exerciseRow.lastWeight = entry.weight.toString()

      // Update personal best if the new weight is higher
      if (entry.weight > currentPB) {
        exerciseRow.personalBest = entry.weight.toString()
      }

      await exerciseRow.save()
    }
    return entry
  } catch (error) {
    console.error("Error adding progress entry:", error)
    throw error
  }
}
