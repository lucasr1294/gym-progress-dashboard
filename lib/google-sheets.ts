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

// Get all exercises from the "Exercises" sheet
export const getExercises = async (): Promise<ExerciseData[]> => {
  try {
    const doc = await initializeGoogleSheets()

    // Check if the "Exercises" sheet exists
    let sheet = doc.sheetsByTitle["Exercises"]

    // If the sheet doesn't exist, create it with headers
    if (!sheet) {
      sheet = await doc.addSheet({
        title: "Exercises",
        headerValues: ["id", "name", "category", "lastWeight", "personalBest", "unit"],
      })

      // Add some sample data if the sheet is new
      await sheet.addRows([
        { id: "1", name: "Bench Press", category: "Chest", lastWeight: 185, personalBest: 225, unit: "lbs" },
        { id: "2", name: "Squat", category: "Legs", lastWeight: 225, personalBest: 315, unit: "lbs" },
        { id: "3", name: "Deadlift", category: "Back", lastWeight: 275, personalBest: 365, unit: "lbs" },
        { id: "4", name: "Shoulder Press", category: "Shoulders", lastWeight: 135, personalBest: 165, unit: "lbs" },
        { id: "5", name: "Pull-ups", category: "Back", lastWeight: 0, personalBest: 15, unit: "reps" },
      ])
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
    // Return mock data if there's an error
    return [
      {
        id: "1",
        name: "Bench Press",
        category: "Chest",
        lastWeight: 185,
        personalBest: 225,
        unit: "lbs",
      },
      {
        id: "2",
        name: "Squat",
        category: "Legs",
        lastWeight: 225,
        personalBest: 315,
        unit: "lbs",
      },
      {
        id: "3",
        name: "Deadlift",
        category: "Back",
        lastWeight: 275,
        personalBest: 365,
        unit: "lbs",
      },
      {
        id: "4",
        name: "Shoulder Press",
        category: "Shoulders",
        lastWeight: 135,
        personalBest: 165,
        unit: "lbs",
      },
      {
        id: "5",
        name: "Pull-ups",
        category: "Back",
        lastWeight: 0,
        personalBest: 15,
        unit: "reps",
      },
    ]
  }
}

// Get progress data for a specific exercise
export const getExerciseProgress = async (exerciseId: string): Promise<ExerciseProgress[]> => {
  try {
    const doc = await initializeGoogleSheets()
    let sheet = doc.sheetsByTitle["Progress"]

    // If the sheet doesn't exist, create it with headers
    if (!sheet) {
      sheet = await doc.addSheet({ title: "Progress", headerValues: ["exerciseId", "date", "weight", "reps", "sets"] })

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

    // Return mock data if there's an error
    const today = new Date()
    const mockData: ExerciseProgress[] = []

    // Generate 10 data points going back in time
    for (let i = 0; i < 10; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() - i * 7) // Weekly data points

      // Generate a weight that generally increases over time (as we go back in time)
      // with some random variation
      const baseWeight =
        exerciseId === "1" ? 185 : exerciseId === "2" ? 225 : exerciseId === "3" ? 275 : exerciseId === "4" ? 135 : 0

      const randomVariation = Math.floor(Math.random() * 10) - 5 // -5 to +5
      const weightTrend = Math.max(0, baseWeight - i * 5) // Decrease as we go back in time
      const weight = weightTrend + randomVariation

      mockData.push({
        date: date.toISOString().split("T")[0], // YYYY-MM-DD format
        weight,
        reps: Math.floor(Math.random() * 5) + 8, // 8-12 reps
        sets: Math.floor(Math.random() * 2) + 3, // 3-4 sets
      })
    }

    // Sort by date ascending
    return mockData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }
}

// Add a new exercise to the sheet
export const addExercise = async (exercise: Omit<ExerciseData, "id">): Promise<ExerciseData> => {
  try {
    const doc = await initializeGoogleSheets()
    const sheet = doc.sheetsByTitle["Exercises"]

    // Get all exercises to determine the next ID
    const rows = await sheet.getRows()
    const nextId = rows.length > 0 
      ? Math.max(...rows.map((row) => Number.parseInt(row.id as string || "0"))) + 1 
      : 1

    // Add the new exercise
    const newExercise = {
      id: nextId.toString(),
      ...exercise,
    }

    await sheet.addRow(newExercise)

    return newExercise
  } catch (error) {
    console.error("Error adding exercise:", error)
    throw error
  }
}

// Add a new progress entry
export const addProgressEntry = async (
  entry: { exerciseId: string } & Omit<ExerciseProgress, "id">,
): Promise<ExerciseProgress> => {
  try {
    const doc = await initializeGoogleSheets()
    const sheet = doc.sheetsByTitle["Progress"]

    // Add the new progress entry
    await sheet.addRow(entry)

    // Update the last weight in the Exercises sheet
    const exercisesSheet = doc.sheetsByTitle["Exercises"]
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
