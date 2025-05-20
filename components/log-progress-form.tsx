"use client"

import { useState } from "react"
import { logProgressAction } from "@/app/actions/exercise-actions"
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
import { useToast } from "@/hooks/use-toast"

interface LogProgressFormProps {
  exerciseId: string
  exerciseName: string
  unit: string
}

export function LogProgressForm({ exerciseId, exerciseName, unit }: LogProgressFormProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  // Set today's date as default
  const today = new Date().toISOString().split("T")[0]

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)

    try {
      const result = await logProgressAction(formData)

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
        <Button>Log Progress</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Log Progress for {exerciseName}</DialogTitle>
          <DialogDescription>Record your latest workout data for this exercise.</DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4 py-4">
          <input type="hidden" name="exerciseId" value={exerciseId} />

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input id="date" name="date" type="date" defaultValue={today} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="weight">Weight ({unit})</Label>
            <Input id="weight" name="weight" type="number" min="0" step="any" placeholder="0" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sets">Sets</Label>
              <Input id="sets" name="sets" type="number" min="1" placeholder="3" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reps">Reps</Label>
              <Input id="reps" name="reps" type="number" min="1" placeholder="10" required />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Progress"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
