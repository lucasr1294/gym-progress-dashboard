"use client"

import { useState } from "react"
import { createExercise } from "@/app/actions/exercise-actions"
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
import { Loader2 } from "lucide-react"
import { useFormStatus } from "react-dom"

function SubmitButton() {
  const { pending } = useFormStatus()
  
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Agregando...
        </>
      ) : (
        "Agregar ejercicio"
      )}
    </Button>
  )
}

export function AddExerciseForm() {
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  async function handleSubmit(formData: FormData) {
    try {
      const result = await createExercise(formData)

      if (result.success) {
        toast({
          title: "Éxito",
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
        description: "Algo salió mal. Intentá de nuevo.",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Agregar ejercicio</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Agregar nuevo ejercicio</DialogTitle>
          <DialogDescription>Ingresá los detalles del ejercicio que querés registrar.</DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre del ejercicio</Label>
            <Input id="name" name="name" placeholder="ej. Press de banca" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Categoría</Label>
            <Select name="category" defaultValue="Pecho">
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pecho">Pecho</SelectItem>
                <SelectItem value="Espalda">Espalda</SelectItem>
                <SelectItem value="Hombro">Hombro</SelectItem>
                <SelectItem value="Brazos">Brazos</SelectItem>
                <SelectItem value="Piernas">Piernas</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="personalBest">Mejor marca (opcional)</Label>
            <Input
              id="personalBest"
              name="personalBest"
              type="number"
              min="0"
              step="any"
              placeholder="Igual al peso actual si no se especifica"
            />
          </div>
          <DialogFooter>
            <SubmitButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
