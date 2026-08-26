"use client"

import { useState, useEffect } from "react"
import { Copy } from "lucide-react"
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
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"

const MAX_SETS = 4

interface SetData {
  weight: number
  reps: number
}

interface LogProgressFormProps {
  exerciseId: string
  exerciseName: string
  unit: string
  lastSets?: SetData[]
}

export function LogProgressForm({ exerciseId, exerciseName, unit, lastSets }: LogProgressFormProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [numSets, setNumSets] = useState(1)
  const [setsData, setSetsData] = useState<SetData[]>([{ weight: 0, reps: 0 }])
  const [isBodyweight, setIsBodyweight] = useState(false)
  const { toast } = useToast()

  const bodyweightStorageKey = `bodyweight-exercise-${exerciseId}`

  // Set today's date as default
  const today = new Date().toISOString().split("T")[0]

  // Remember whether this exercise doesn't use weight (e.g. Dominadas, Flexiones)
  useEffect(() => {
    const stored = localStorage.getItem(bodyweightStorageKey)
    setIsBodyweight(stored === "true")
  }, [bodyweightStorageKey])

  // Pre-fill from the last logged sets for this exercise every time the dialog opens
  useEffect(() => {
    if (!open) return
    if (lastSets && lastSets.length > 0) {
      setNumSets(lastSets.length)
      setSetsData(lastSets.map((set) => ({ ...set })))
    } else {
      setNumSets(1)
      setSetsData([{ weight: 0, reps: 0 }])
    }
  }, [open, lastSets])

  function handleBodyweightChange(checked: boolean) {
    setIsBodyweight(checked)
    localStorage.setItem(bodyweightStorageKey, checked ? "true" : "false")
    if (checked) {
      setSetsData((prev) => prev.map((set) => ({ ...set, weight: 0 })))
    }
  }

  // Update sets data when number of sets changes
  useEffect(() => {
    const newSetsData = Array(numSets).fill(null).map((_, index) =>
      setsData[index] || { weight: 0, reps: 0 }
    )
    setSetsData(newSetsData)
  }, [numSets])

  function applySetToAll(index: number) {
    const template = setsData[index]
    setSetsData((prev) => prev.map(() => ({ ...template })))
  }

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    
    try {

      const result = await logProgressAction(formData)

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
          <DialogTitle>Registrar progreso: {exerciseName}</DialogTitle>
          <DialogDescription>Registrá los datos de tu último entrenamiento para este ejercicio.</DialogDescription>
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
            <Label htmlFor="date">Fecha</Label>
            <Input id="date" name="date" type="date" defaultValue={today} required />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="isBodyweight"
              checked={isBodyweight}
              onCheckedChange={(checked) => handleBodyweightChange(checked === true)}
            />
            <Label htmlFor="isBodyweight" className="cursor-pointer font-normal">
              Este ejercicio no usa peso (solo repeticiones)
            </Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sets">Cantidad de series</Label>
            <Input
              id="sets"
              name="sets"
              type="number"
              min="1"
              max={MAX_SETS}
              value={numSets || ''}
              onChange={(e) => {
                const value = e.target.value === '' ? 0 : Math.min(MAX_SETS, parseInt(e.target.value));
                setNumSets(value);
              }}
              required
            />
            <p className="text-xs text-muted-foreground">Máximo {MAX_SETS} series por registro.</p>
          </div>
          <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto">
            {setsData.map((set, index) => (
              <div key={index} className="space-y-4 border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Serie {index + 1}</h3>
                  {numSets > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 gap-1 px-2 text-xs text-muted-foreground"
                      onClick={() => applySetToAll(index)}
                    >
                      <Copy className="h-3 w-3" />
                      Copiar a todas
                    </Button>
                  )}
                </div>
                <div className={isBodyweight ? "grid grid-cols-1 gap-4" : "grid grid-cols-2 gap-4"}>
                  {isBodyweight ? (
                    <input type="hidden" name={`set_${index + 1}_weight`} value={0} />
                  ) : (
                    <div className="space-y-2">
                      <Label htmlFor={`weight_${index}`}>Peso ({unit})</Label>
                      <Input
                        id={`weight_${index}`}
                        name={`set_${index + 1}_weight`}
                        type="number"
                        min="0"
                        placeholder="0"
                        step="any"
                        className="font-mono tabular-nums"
                        value={set.weight || ''}
                        onChange={(e) => {
                          const newSetsData = [...setsData]
                          newSetsData[index].weight = parseFloat(e.target.value) || 0
                          setSetsData(newSetsData)
                        }}
                        required
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor={`reps_${index}`}>Repeticiones</Label>
                    <Input
                      id={`reps_${index}`}
                      name={`set_${index + 1}_reps`}
                      type="number"
                      min="1"
                      className="font-mono tabular-nums"
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
              {isSubmitting ? "Guardando..." : "Guardar progreso"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
