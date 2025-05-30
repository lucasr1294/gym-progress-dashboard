import { Suspense } from "react"
import { getAllExercises, getLastWorkout } from "@/app/actions/exercise-actions"
import { DashboardContent } from "@/components/dashboard-content"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ErrorComponent } from "./error-component"
import { ErrorBoundary } from "next/dist/client/components/error-boundary"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function DashboardPage() {
  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm md:text-base text-muted-foreground">Resumen de tu progreso en el gimnasio.</p>
      </div>
      <Dialog>
        <DialogTrigger className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md">
          Ver notas de actualizacion 📝
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¡Bienvenido a la app de luxor! 🦁</DialogTitle>
            <DialogDescription>
              Se cambio el idioma a español. <br /> Tambien agregue la opcion de editar los ejercicios, y la opcion de agregar series a cada ejercicio. <br/>
              Ahora ponete a entrenar y no seas trolo que la libertad avanza necesita gordos gigantes.
              <br />
              <br />
              <a 
                href="https://www.youtube.com/watch?v=QYniYISCgHM&ab_channel=ILPOLITICS" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md inline-block"
              >
                Ver video motivacional 
              </a>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <ErrorBoundary errorComponent={ErrorComponent}>
        <Suspense fallback={<DashboardSkeleton />}>
          <DashboardContentWrapper />
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}

async function DashboardContentWrapper() {
  const exercises = await getAllExercises()
  const lastWorkout = await getLastWorkout()
  return <DashboardContent exercises={exercises} lastWorkout={lastWorkout} />
}

function DashboardSkeleton() {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-12 mb-2" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
      </div>
      <div className="mt-6">
        <Skeleton className="h-8 w-48 mb-4" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-5 w-32 mb-2" />
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div>
                      <Skeleton className="h-3 w-20 mb-2" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <div>
                      <Skeleton className="h-3 w-20 mb-2" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <Skeleton className="h-4 w-16" />
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </>
  )
}
