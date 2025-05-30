"use client"

import { useState } from "react"
import { updateProgressAction } from "@/app/actions/exercise-actions"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import type { ExerciseProgress } from "@/lib/google-sheets"

interface EditProgressFormProps {
  exerciseId: string
  exerciseName: string
  unit?: string
  workout: ExerciseProgress
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditProgressForm({ 
  exerciseId, 
  exerciseName, 
  unit,
  workout,
  open,
  onOpenChange 
}: EditProgressFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    
    try {
      const result = await updateProgressAction(formData)

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
        onOpenChange(false)
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar progreso de {exerciseName}</DialogTitle>
          <DialogDescription>Actualiza los datos de tu entrenamiento para este ejercicio.</DialogDescription>
        </DialogHeader>
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          formData.append("exerciseId", exerciseId);
          formData.append("date", workout.date);
          handleSubmit(formData);
        }} className="space-y-4 py-4">

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="set1Weight">Peso de la serie 1</Label>
              <Input id="set1Weight" name="set1Weight" type="number" min="0" step="any" defaultValue={workout.set1Weight} required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="set1Reps">Repe de la serie 1</Label>
              <Input id="set1Reps" name="set1Reps" type="number" min="0" defaultValue={workout.set1Reps} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="set2Weight">Peso de la serie 2</Label>
              <Input id="set2Weight" name="set2Weight" type="number" min="0" step="any" defaultValue={workout.set2Weight} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="set2Reps">Repe de la serie 2</Label>
              <Input id="set2Reps" name="set2Reps" type="number" min="0" defaultValue={workout.set2Reps} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="set3Weight">Peso de la serie 3</Label>
              <Input id="set3Weight" name="set3Weight" type="number" min="0" step="any" defaultValue={workout.set3Weight} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="set3Reps">Repe de la serie 3</Label>
              <Input id="set3Reps" name="set3Reps" type="number" min="0" defaultValue={workout.set3Reps} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="set4Weight">Peso de la serie 4</Label>
              <Input id="set4Weight" name="set4Weight" type="number" min="0" step="any" defaultValue={workout.set4Weight} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="set4Reps">Repe de la serie 4</Label>
              <Input id="set4Reps" name="set4Reps" type="number" min="0" defaultValue={workout.set4Reps} required />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Guardar cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}