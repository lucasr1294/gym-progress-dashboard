"use client"

import { useEffect, useState } from "react"

import { PROVERBS, type Proverb } from "@/lib/proverbs"

// Muestra un proverbio al azar. Se elige en el cliente al montar el componente,
// así cada vez que se entra al Dashboard sale otro. Elegirlo en un efecto (y no
// en el render) evita el desajuste de hidratación de Next.
export function ProverbioDelDia() {
  const [proverb, setProverb] = useState<Proverb | null>(null)

  useEffect(() => {
    setProverb(PROVERBS[Math.floor(Math.random() * PROVERBS.length)])
  }, [])

  return (
    <figure
      className="mt-3 min-h-[3.25rem] border-l-2 border-border pl-3"
      aria-live="polite"
    >
      {proverb && (
        <>
          <blockquote className="text-sm italic leading-relaxed text-muted-foreground md:text-base">
            «{proverb.text}»
          </blockquote>
          <figcaption className="mt-1 font-mono text-xs uppercase tracking-wide text-muted-foreground/70">
            {proverb.ref}
          </figcaption>
        </>
      )}
    </figure>
  )
}
