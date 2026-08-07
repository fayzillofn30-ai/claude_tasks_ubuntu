"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { UserCircle2 } from "lucide-react"

function Header() {
  return (
    <header
      className={cn(
        "w-full h-16 px-6 flex items-center justify-between",
        "bg-white shadow-md border-b"
      )}
    >
      <h1 className="text-xl font-semibold text-gray-800">
        🎓 EduCenter Panel
      </h1>

    </header>
  )
}

export default Header
