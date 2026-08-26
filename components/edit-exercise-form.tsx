"use client"

import { useState } from "react"
import { updateExerciseAction } from "@/app/actions/exercise-actions"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Pencil } from "lucide-react"
import type { ExerciseData } from "@/lib/google-sheets"

interface EditExerciseFormProps {
  exercise: ExerciseData
}

const CATEGORIES = ["Pecho", "Espalda", "Hombro", "Brazos", "Piernas"]

export function EditExerciseForm({ exercise }: EditExerciseFormProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    try {
      const result = await updateExerciseAction(formData)

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
        setOpen(false)
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Editar ejercicio">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar ejercicio</DialogTitle>
          <DialogDescription>Actualizá el nombre, categoría o mejor marca del ejercicio.</DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4 py-4">
          <input type="hidden" name="exerciseId" value={exercise.id} />
          <div className="space-y-2">
            <Label htmlFor={`name-${exercise.id}`}>Nombre</Label>
            <Input id={`name-${exercise.id}`} name="name" defaultValue={exercise.name} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`category-${exercise.id}`}>Categoría</Label>
            <Select name="category" defaultValue={exercise.category}>
              <SelectTrigger id={`category-${exercise.id}`}>
                <SelectValue placeholder="Seleccionar categoría" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor={`personalBest-${exercise.id}`}>Mejor marca ({exercise.unit})</Label>
            <Input
              id={`personalBest-${exercise.id}`}
              name="personalBest"
              type="number"
              min="0"
              step="any"
              defaultValue={exercise.personalBest || ""}
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                "Guardar cambios"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
