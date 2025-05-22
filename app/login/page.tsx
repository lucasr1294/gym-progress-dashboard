"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "../contexts/UserContext"
import { setCookie } from "cookies-next"

export default function LoginPage() {
  const [name, setName] = useState("")
  const router = useRouter()
  const { setUser } = useUser()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      // In a real app, you'd want to validate the user against a database
      // For now, we'll just use the name as the ID
      const userId = name.toLowerCase().replace(/\s+/g, "")
      setUser({ id: userId, name })
      setCookie("userId", userId)
      router.push("/dashboard")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-black border border-white-700 rounded-lg shadow">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white-900">
            Ingresa tu nombre 💪🏼
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="sr-only">
              Tu nombre
            </label>
            <input
              style={{
                backgroundColor: "white",
              }}
              id="name"
              name="name"
              type="text"
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={!name.trim()}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-black bg-white hover:bg-black hover:border-white hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Ingresar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 