"use client"

import { createContext, useContext, useState, ReactNode, useEffect } from "react"
import { getCookie } from "cookies-next"

interface User {
  id: string
  name: string
}

interface UserContextType {
  user: User | null
  setUser: (user: User | null) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Recuperar el userId de las cookies
    const userId = getCookie("userId")
    if (userId) {
      setUser({
        id: userId as string,
        name: userId as string
      })
    }
  }, [])

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
} 