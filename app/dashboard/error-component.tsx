"use client"

export function ErrorComponent({ error }: { error: Error }) {
  return <div>Error: {error.message}</div>
}