"use client"

import React from "react"
import { useRouter, usePathname } from "next/navigation"
import { TargetFolderStore } from "@/lib/ui.state"
import { LeftTargetType } from "@/lib/ui.state"
import { cn } from "@/lib/utils"
import {
  Users,
  BookOpen,
  Layers,
  BarChart2,
  GraduationCap,
  ActivitySquare,
} from "lucide-react"

// 🔹 Lids uchun yangi tip qo‘shamiz
type ExtendedLeftTargetType = LeftTargetType | "lids"

const menuItems: {
  id: ExtendedLeftTargetType
  label: string
  icon: React.ReactNode
  path: string
}[] = [
  { id: "teachers", label: "O‘qituvchilar", icon: <Users size={18} />, path: "/teachers" },
  { id: "students", label: "Talabalar", icon: <GraduationCap size={18} />, path: "/students" },
  { id: "groupes", label: "Guruhlar", icon: <Layers size={18} />, path: "/groupes" },
  { id: "courses", label: "Kurslar", icon: <BookOpen size={18} />, path: "/courses" },
  { id: "lids", label: "Lids", icon: <ActivitySquare size={18} />, path: "/lids" },
  { id: "statistika", label: "Statistika", icon: <BarChart2 size={18} />, path: "/statistika" },
]

function Left() {
  const router = useRouter()
  const pathname = usePathname()
  const { currentFolder, setFolder } = TargetFolderStore()

  const handleClick = (target: ExtendedLeftTargetType, path: string) => {
    setFolder(target as LeftTargetType)
    router.push(path)
  }

  return (
    <div className="h-full flex flex-col gap-2 py-3">
      {menuItems.map((item) => {
        const active =
          currentFolder === item.id || pathname.startsWith(item.path)
        return (
          <button
            key={item.id}
            onClick={() => handleClick(item.id, item.path)}
            className={cn(
              "flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm font-medium transition-colors",
              active
                ? "bg-violet-600 text-white"
                : "text-gray-800 hover:bg-violet-200"
            )}
          >
            {item.icon}
            {item.label}
          </button>
        )
      })}
    </div>
  )
}

export default Left
