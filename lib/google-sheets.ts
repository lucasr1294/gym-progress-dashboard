import { initializeGoogleSheets } from "@/app/actions/exercise-actions"

export interface ExerciseData {
  id: string
  name: string
  category: string
  lastWeight: number
  personalBest: number
  unit: string
}

export interface ExerciseProgress {
  weight?: number
  reps?: number
  sets?: number
  date: string
  exerciseId: string
  set1Weight?: number
  set1Reps?: number
  set2Weight?: number
  set2Reps?: number
  set3Weight?: number
  set3Reps?: number
  set4Weight?: number
  set4Reps?: number
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
    const sheetName = `${userId}Progress`
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
        exerciseId: row.exerciseId as string,
        set1Weight: Number.parseFloat(row.set1Weight as string) || 0,
        set1Reps: Number.parseInt(row.set1Reps as string) || 0,
        set2Weight: Number.parseFloat(row.set2Weight as string) || 0,
        set2Reps: Number.parseInt(row.set2Reps as string) || 0,
        set3Weight: Number.parseFloat(row.set3Weight as string) || 0,
        set3Reps: Number.parseInt(row.set3Reps as string) || 0,
        set4Weight: Number.parseFloat(row.set4Weight as string) || 0,
        set4Reps: Number.parseInt(row.set4Reps as string) || 0,
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
    if (!exercise.name?.trim()) {
      throw new Error("Exercise name is required")
    }
    if (!exercise.category?.trim()) {
      throw new Error("Exercise category is required")
    }

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

    const newExercise = {
      id: nextId.toString(),
      name: exercise.name,
      category: exercise.category,
      lastWeight: 0,
      personalBest: 0,
      unit: "kgs"
    }

    // Add the new row to the sheet
    await exercisesSheet.addRow(newExercise)
    
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

      const maxWeight = entry.weight || Math.max(
          entry.set1Weight || 0,
          entry.set2Weight || 0,
          entry.set3Weight || 0,
          entry.set4Weight || 0
        )

      // Update last weight
      exerciseRow.lastWeight = entry.weight ? entry.weight.toString() : maxWeight.toString()

      // Update personal best if the new weight is higher
      if (maxWeight > currentPB) {
        exerciseRow.personalBest = maxWeight.toString()
      }

      await exerciseRow.save()
    }
    return entry
  } catch (error) {
    console.error("Error adding progress entry:", error)
    throw error
  }
}
