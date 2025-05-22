"use client"

import { useUser } from "../contexts/UserContext"
import { LogoutButton } from "./logout-button"

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const { user } = useUser()
  
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="flex items-center justify-between px-4 py-2">
          {user ? (
            <>
              <h1 className="text-xl font-bold">Hello, {user.name.charAt(0).toUpperCase() + user.name.slice(1) + ' 💪🏼 !'} </h1>
              <LogoutButton />
            </>
          ) : (
            <h1 className="text-xl font-bold"></h1>
          )}
        </div>
      </header>
      <main className="w-full px-4 py-6 flex-1 flex items-center justify-center">
        {children}
      </main>
    </div>
  )
} 