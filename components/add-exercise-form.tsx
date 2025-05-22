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

// Componente separado para el botón de submit
function SubmitButton() {
  const { pending } = useFormStatus()
  
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Adding...
        </>
      ) : (
        "Add Exercise"
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
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Exercise</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Exercise</DialogTitle>
          <DialogDescription>Enter the details of the exercise you want to track.</DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Exercise Name</Label>
            <Input id="name" name="name" placeholder="e.g. Pecho plano" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select name="category" defaultValue="Pecho">
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
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
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lastWeight">Current Weight</Label>
              <Input id="lastWeight" name="lastWeight" type="number" min="0" step="any" placeholder="0" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Select name="unit" defaultValue="kg">
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">kg</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="personalBest">Personal Best (Optional)</Label>
            <Input
              id="personalBest"
              name="personalBest"
              type="number"
              min="0"
              step="any"
              placeholder="Same as current weight if not specified"
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
