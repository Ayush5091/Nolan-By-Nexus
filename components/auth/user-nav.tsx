"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, User, Settings, LogOut } from "lucide-react"
import { SignupModal } from "./signup-modal"
import { LoginModal } from "./login-modal"
import { ForgotPasswordModal } from "./forgot-password-modal"

export function UserNav() {
  const { user, userData, loading, logOut } = useAuth()
  const router = useRouter()

  const [isSignupOpen, setIsSignupOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await logOut()
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const getInitials = (name: string | null) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  if (loading) {
    return (
      <Button variant="ghost" size="sm" disabled>
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
        Loading...
      </Button>
    )
  }

  if (!user) {
    return (
      <>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsLoginOpen(true)}>
            Log in
          </Button>
          <Button size="sm" onClick={() => setIsSignupOpen(true)}>
            Sign up
          </Button>
        </div>

        <SignupModal
          isOpen={isSignupOpen}
          onClose={() => setIsSignupOpen(false)}
          onSwitchToLogin={() => {
            setIsSignupOpen(false)
            setIsLoginOpen(true)
          }}
        />

        <LoginModal
          isOpen={isLoginOpen}
          onClose={() => setIsLoginOpen(false)}
          onSwitchToSignup={() => {
            setIsLoginOpen(false)
            setIsSignupOpen(true)
          }}
          onForgotPassword={() => {
            setIsLoginOpen(false)
            setIsForgotPasswordOpen(true)
          }}
        />

        <ForgotPasswordModal
          isOpen={isForgotPasswordOpen}
          onClose={() => setIsForgotPasswordOpen(false)}
          onSwitchToLogin={() => {
            setIsForgotPasswordOpen(false)
            setIsLoginOpen(true)
          }}
        />
      </>
    )
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.photoURL || undefined} alt={userData?.displayName || "User"} />
              <AvatarFallback>{getInitials(userData?.displayName)}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{userData?.displayName}</p>
              <p className="text-xs leading-none text-muted-foreground">{userData?.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push("/profile")}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/settings")}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

