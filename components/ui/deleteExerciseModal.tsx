import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "./alert-dialog";
import { ExerciseProgress } from "@/lib/google-sheets";
import { memo, useCallback } from "react";

interface DeleteExerciseModalProps {
    workoutToDelete: ExerciseProgress | null;
    setWorkoutToDelete: (workout: ExerciseProgress | null) => void;
    handleDeleteWorkout: (workout: ExerciseProgress) => void;
    unit?: string;
}

function summarizeWorkout(workout: ExerciseProgress, unit: string): string {
    const perSet = [
        [workout.set1Weight, workout.set1Reps],
        [workout.set2Weight, workout.set2Reps],
        [workout.set3Weight, workout.set3Reps],
        [workout.set4Weight, workout.set4Reps],
    ]
        .filter(([weight, reps]) => (weight ?? 0) > 0 || (reps ?? 0) > 0)
        .map(([weight, reps], index) => `serie ${index + 1}: ${weight ?? 0} ${unit} × ${reps ?? 0}`)

    if (perSet.length > 0) return perSet.join(", ")
    if ((workout.weight ?? 0) > 0 || (workout.reps ?? 0) > 0) {
        return `${workout.weight ?? 0} ${unit} × ${workout.reps ?? 0}`
    }
    return ""
}

export const DeleteExerciseModal = memo(function DeleteExerciseModal({
    workoutToDelete,
    setWorkoutToDelete,
    handleDeleteWorkout,
    unit = "kg",
}: DeleteExerciseModalProps) {
    const handleClose = useCallback(() => {
        setWorkoutToDelete(null);
    }, [setWorkoutToDelete]);

    const handleDelete = useCallback(() => {
        if (workoutToDelete) {
            handleDeleteWorkout(workoutToDelete);
        }
    }, [workoutToDelete, handleDeleteWorkout]);

    const summary = workoutToDelete ? summarizeWorkout(workoutToDelete, unit) : ""

    return (
        <AlertDialog
            open={!!workoutToDelete}
            onOpenChange={(open) => !open && setWorkoutToDelete(null)}
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>¿Eliminar el entrenamiento del {workoutToDelete?.date}?</AlertDialogTitle>
                    <AlertDialogDescription>
                        {summary
                            ? `Se eliminará este registro (${summary}). Esta acción no puede deshacerse.`
                            : "Esta acción no puede deshacerse."}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={handleClose}>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        Eliminar
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
});
