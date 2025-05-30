"use client"

import { useState, useEffect } from "react"
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

interface SetData {
  weight: number
  reps: number
}

export function LogProgressForm({ exerciseId, exerciseName, unit }: LogProgressFormProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [numSets, setNumSets] = useState(1)
  const [setsData, setSetsData] = useState<SetData[]>([{ weight: 0, reps: 0 }])
  const { toast } = useToast()

  // Set today's date as default
  const today = new Date().toISOString().split("T")[0]

  // Update sets data when number of sets changes
  useEffect(() => {
    const newSetsData = Array(numSets).fill(null).map((_, index) => 
      setsData[index] || { weight: 0, reps: 0 }
    )
    setSetsData(newSetsData)
  }, [numSets])

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
        <Button>Registrar progreso</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Log Progress for {exerciseName}</DialogTitle>
          <DialogDescription>Record your latest workout data for this exercise.</DialogDescription>
        </DialogHeader>
        <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const form = e.currentTarget;
            if (!form) return;
            const formData = new FormData(form);
            handleSubmit(formData);
          }} className="space-y-4 py-4">
          <input type="hidden" name="exerciseId" value={exerciseId} />

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input id="date" name="date" type="date" defaultValue={today} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sets">Number of Sets</Label>
            <Input 
              id="sets" 
              name="sets" 
              type="number" 
              min="1" 
              value={numSets || ''}
              onChange={(e) => {
                const value = e.target.value === '' ? 0 : parseInt(e.target.value);
                setNumSets(value);
              }}
              required 
            />
          </div>
          <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto">
            {setsData.map((set, index) => (
              <div key={index} className="space-y-4 border rounded-lg p-4">
                <h3 className="font-medium">Set {index + 1}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`weight_${index}`}>Weight ({unit})</Label>
                    <Input 
                      id={`weight_${index}`}
                      name={`set_${index + 1}_weight`}
                      type="number" 
                      min="0" 
                      placeholder="0"
                      step="any" 
                      value={set.weight || ''}
                      onChange={(e) => {
                        const newSetsData = [...setsData]
                        newSetsData[index].weight = parseFloat(e.target.value) || 0
                        setSetsData(newSetsData)
                      }}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`reps_${index}`}>Reps</Label>
                    <Input 
                      id={`reps_${index}`}
                      name={`set_${index + 1}_reps`}
                      type="number" 
                      min="1"
                      value={set.reps || ''}
                      placeholder="0"
                      onChange={(e) => {
                        const newSetsData = [...setsData]
                        newSetsData[index].reps = e.target.value === '' ? 0 : parseInt(e.target.value)
                        setSetsData(newSetsData)
                      }}
                      required 
                    />
                  </div>
                </div>
              </div>
            ))}
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
