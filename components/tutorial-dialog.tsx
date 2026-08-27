"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const MOTIVATION_URL =
  "https://www.youtube.com/watch?v=QYniYISCgHM&ab_channel=ILPOLITICS"

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-1.5">
      <h3 className="font-semibold text-foreground">{title}</h3>
      <div className="space-y-1.5 text-sm text-muted-foreground">{children}</div>
    </section>
  )
}

export function TutorialDialog() {
  return (
    <Dialog>
      <DialogTrigger className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium">
        Cómo usar la app 📖
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Cómo usar la app 🏋️</DialogTitle>
          <DialogDescription>
            Guía rápida para registrar tus entrenamientos y seguir tu progreso.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <Section title="1. Ingresar">
            <p>
              En la pantalla de inicio escribí tu nombre y tocá{" "}
              <strong className="font-medium text-foreground">Ingresar</strong>. No
              hay contraseña. Tu nombre queda guardado en este dispositivo, así la
              próxima vez entrás con un solo toque.
            </p>
          </Section>

          <Section title="2. Moverte por la app">
            <p>
              El menú está en la barra lateral (en compu) o en el botón{" "}
              <strong className="font-medium text-foreground">☰</strong> arriba a la
              izquierda (en celular). Tenés tres secciones:
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong className="font-medium text-foreground">Dashboard:</strong>{" "}
                resumen general — cuántos ejercicios tenés, categorías, cuántos
                están en tu mejor marca y la fecha de tu última sesión. Abajo, tus
                6 ejercicios más recientes.
              </li>
              <li>
                <strong className="font-medium text-foreground">Ejercicios:</strong>{" "}
                todos tus ejercicios agrupados por categoría (Pecho, Espalda,
                Hombro, Brazos, Piernas).
              </li>
              <li>
                <strong className="font-medium text-foreground">Progreso:</strong>{" "}
                gráficos con tu evolución de fuerza y la distribución de tus
                entrenamientos.
              </li>
            </ul>
          </Section>

          <Section title="3. Agregar un ejercicio">
            <p>
              Entrá a <strong className="font-medium text-foreground">Ejercicios</strong>{" "}
              y tocá{" "}
              <strong className="font-medium text-foreground">Agregar ejercicio</strong>.
              Poné el nombre (ej. “Press de banca”), elegí la categoría y, si
              querés, tu mejor marca actual. Si la dejás vacía, se toma igual al
              peso que registres primero.
            </p>
          </Section>

          <Section title="4. Registrar un entrenamiento">
            <p>
              Desde <strong className="font-medium text-foreground">Ejercicios</strong>{" "}
              o desde el Dashboard, abrí el detalle de un ejercicio con{" "}
              <strong className="font-medium text-foreground">Ver</strong> /{" "}
              <strong className="font-medium text-foreground">Details</strong>. Ahí
              tocá{" "}
              <strong className="font-medium text-foreground">Registrar progreso</strong>{" "}
              y cargá:
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>La fecha (por defecto, hoy).</li>
              <li>
                La cantidad de series (hasta 4) y, en cada una, el peso × las
                repeticiones.
              </li>
              <li>
                <strong className="font-medium text-foreground">Copiar a todas</strong>{" "}
                repite los valores de una serie en las demás.
              </li>
              <li>
                Si el ejercicio es solo con el peso del cuerpo (dominadas,
                flexiones), marcá{" "}
                <strong className="font-medium text-foreground">
                  “Este ejercicio no usa peso”
                </strong>{" "}
                y cargás solo repeticiones. La app se acuerda de esa preferencia
                para ese ejercicio.
              </li>
              <li>
                La próxima vez que registres, el formulario ya viene pre-cargado
                con tus últimas series.
              </li>
            </ul>
          </Section>

          <Section title="5. Ver el progreso de un ejercicio">
            <p>
              En el detalle de cada ejercicio vas a ver tu peso actual, tu mejor
              peso, el aumento total, el % de mejora, un gráfico con la evolución y
              una tabla con todo tu historial de entrenamientos.
            </p>
          </Section>

          <Section title="6. Editar o borrar un registro">
            <p>
              En la tabla{" "}
              <strong className="font-medium text-foreground">
                Historial de entrenamiento
              </strong>
              , usá el ícono de lápiz para editar un registro o el de tacho para
              eliminarlo.
            </p>
          </Section>

          <Section title="7. Salir">
            <p>
              El botón para salir está arriba a la derecha. Cuando vuelvas, entrás
              de nuevo con tu nombre. Tus datos quedan guardados.
            </p>
          </Section>

          <div className="border-t pt-4">
            <a
              href={MOTIVATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Si necesitas motivacion, el Javo te da una mano, clickea aca
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
