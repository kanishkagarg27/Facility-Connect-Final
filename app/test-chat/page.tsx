"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RoleBasedChat } from "@/components/role-based-chat"

export default function TestChatPage() {
  const [showChat, setShowChat] = useState(false)
  const [userRole, setUserRole] = useState<"user" | "staff">("user")

  const mockUser = {
    id: "123",
    name: userRole === "user" ? "John Doe" : "Staff Member",
    role: userRole,
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Chat Test Page</h1>

      <div className="flex gap-4 mb-8">
        <Button onClick={() => setUserRole("user")} variant={userRole === "user" ? "default" : "outline"}>
          User Role
        </Button>
        <Button onClick={() => setUserRole("staff")} variant={userRole === "staff" ? "default" : "outline"}>
          Staff Role
        </Button>
      </div>

      <Button onClick={() => setShowChat(!showChat)}>{showChat ? "Hide Chat" : "Show Chat"}</Button>

      {showChat && <RoleBasedChat user={mockUser} />}
    </div>
  )
}
