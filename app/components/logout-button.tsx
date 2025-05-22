"use client"

import { useRouter } from "next/navigation"
import { useUser } from "@/app/contexts/UserContext"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { deleteCookie } from "cookies-next"

export function LogoutButton() {
  const router = useRouter()
  const { setUser } = useUser()

  const handleLogout = () => {
    // Clear user context
    setUser(null)
    // Remove cookie
    deleteCookie("userId")
    // Redirect to login
    router.push("/login")
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleLogout}
      className="hover:bg-destructive hover:text-destructive-foreground"
    >
      <LogOut className="h-5 w-5" />
      <span className="sr-only">Logout</span>
    </Button>
  )
} 