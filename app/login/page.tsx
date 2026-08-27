"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { setCookie } from "cookies-next"
import { ArrowRight, Loader2, X } from "lucide-react"

import { useUser } from "../contexts/UserContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const STORAGE_KEY = "gpd:names"
const MAX_NAMES = 6

const toId = (name: string) => name.trim().toLowerCase().replace(/\s+/g, "")

function readNames(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter((n): n is string => typeof n === "string" && n.trim().length > 0)
      .slice(0, MAX_NAMES)
  } catch {
    return []
  }
}

function writeNames(names: string[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(names.slice(0, MAX_NAMES)))
  } catch {
    // Storage unavailable (private window, blocked). The userId cookie still
    // carries the session — losing the convenience list is acceptable.
  }
}

function withNameFirst(name: string, existing: string[]): string[] {
  const id = toId(name)
  return [name.trim(), ...existing.filter((n) => toId(n) !== id)].slice(0, MAX_NAMES)
}

export default function LoginPage() {
  const router = useRouter()
  const { setUser } = useUser()

  const [hydrated, setHydrated] = useState(false)
  const [names, setNames] = useState<string[]>([])
  const [name, setName] = useState("")
  const [pending, setPending] = useState<string | null>(null)
  const submitRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const stored = readNames()
    setNames(stored)
    // One known name: pre-fill it and put focus on the button so a single
    // tap (or Enter) completes re-entry.
    if (stored.length === 1) {
      setName(stored[0])
      requestAnimationFrame(() => submitRef.current?.focus())
    }
    setHydrated(true)
  }, [])

  const enter = (raw: string) => {
    const value = raw.trim()
    if (!value || pending) return
    const id = toId(value)
    setPending(id)
    writeNames(withNameFirst(value, names))
    setUser({ id, name: value })
    setCookie("userId", id)
    router.push("/dashboard")
  }

  const forget = (target: string) => {
    const next = names.filter((n) => toId(n) !== toId(target))
    setNames(next)
    writeNames(next)
    setName(next.length === 1 ? next[0] : "")
  }

  const showRoster = hydrated && names.length >= 2
  const trimmed = name.trim()
  const submitting = pending !== null && (!showRoster || pending === toId(name))

  return (
    <div
      className={cn(
        "mx-auto w-full min-w-0 max-w-xs transition-[opacity,transform,filter] duration-500 ease-out motion-reduce:transition-none",
        hydrated
          ? "opacity-100 translate-y-0 blur-0"
          : "opacity-0 translate-y-2 blur-[3px]",
      )}
    >
      <h1 className="text-lg font-semibold tracking-tight text-foreground">
        ¿Quién entrena hoy?
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Sin contraseña, solo tu nombre.
      </p>

      {showRoster && (
        <ul className="mt-7 space-y-2">
          {names.map((n) => (
            <li key={toId(n)} className="flex items-stretch gap-1">
              <button
                type="button"
                onClick={() => enter(n)}
                disabled={pending !== null}
                className="group flex h-12 flex-1 items-center justify-between rounded-md border border-border bg-background px-4 text-base font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50"
              >
                <span className="truncate">{n}</span>
                {pending === toId(n) ? (
                  <Loader2 className="ml-3 size-4 shrink-0 animate-spin text-muted-foreground" />
                ) : (
                  <ArrowRight className="ml-3 size-4 shrink-0 -translate-x-1 text-muted-foreground opacity-0 transition-all duration-200 ease-out group-hover:translate-x-0 group-hover:opacity-100" />
                )}
              </button>
              <button
                type="button"
                onClick={() => forget(n)}
                disabled={pending !== null}
                aria-label={`Quitar ${n} de la lista`}
                className="flex h-12 w-10 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive hover:text-destructive-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50"
              >
                <X className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault()
          enter(name)
        }}
        className="mt-6"
      >
        {showRoster && (
          <div className="mb-3 flex items-center gap-3">
            <span className="h-px flex-1 bg-border" />
            <span className="text-xs uppercase tracking-wide text-muted-foreground">
              otro nombre
            </span>
            <span className="h-px flex-1 bg-border" />
          </div>
        )}

        <label htmlFor="name" className="sr-only">
          Tu nombre
        </label>
        <Input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          autoFocus={hydrated && names.length === 0}
          enterKeyHint="go"
          placeholder="Tu nombre"
          className="h-12 text-base"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button
          ref={submitRef}
          type="submit"
          disabled={!trimmed || pending !== null}
          className="mt-3 h-12 w-full text-base disabled:bg-secondary disabled:text-muted-foreground disabled:opacity-100"
        >
          {submitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Ingresando…
            </>
          ) : (
            "Ingresar"
          )}
        </Button>
      </form>
    </div>
  )
}
