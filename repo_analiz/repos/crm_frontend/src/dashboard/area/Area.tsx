"use client"

import React from "react"
import {
  LeftTargetType,
  TargetFolderStore,
  useAllFetchedData,
  useModalStore,
  useSelectedStore,
} from "@/lib/ui.state"

import GroupesRender from "../../src/components/render/Groupes"
import CoursesRender from "../../src/components/render/Courses"
import TeachersRender from "../../src/components/render/TeachersRender"

import GroupeRender from "./pages/GroupRender"
import CoursePage from "./pages/CoursePage"
import LessonPage from "./pages/LessonPage"

type selectedResourseType = "group" | "course" | "teacher" | "lesson" | "user" | "student"

const RenderMultiResourses: Map<LeftTargetType, React.ReactNode> = new Map([
  ["groupes", <GroupesRender />],
  ["courses", <CoursesRender />],
  ["teachers", <TeachersRender />],
])

const RenderSingleResourse: Map<selectedResourseType, React.ReactNode> = new Map([
  ["group", <GroupeRender />],
  ["course", <CoursePage />],
  ["lesson", <LessonPage />],
])

function Area() {
  const { currentFolder: leftTarget } = TargetFolderStore()
  const { selectedGroupId, selectedCourseId, selectedLessonId } = useSelectedStore()
  const { modalType, setModal, CreatorModal } = useModalStore()

  // 🔹 Tanlangan sahifa
  let selectedResource: selectedResourseType | null = null
  if (selectedLessonId) selectedResource = "lesson"
  else if (selectedGroupId) selectedResource = "group"
  else if (selectedCourseId) selectedResource = "course"

  return (
    <div className="relative w-full h-full border border-green-500 rounded-lg bg-gray-50 overflow-y-auto">
      <div className="p-4">
        {selectedResource
          ? RenderSingleResourse.get(selectedResource)
          : RenderMultiResourses.get(leftTarget ?? "groupes")}
      </div>

      {/* 🔘 Modal oynalar */}
      {modalType && (
        <div
          className="absolute inset-0 bg-[rgba(0,0,0,0.8)] flex items-center justify-center z-50"
          onClick={() => setModal(null)}
        >
          <div
            className="relative w-[35%] bg-white rounded-lg shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {CreatorModal.get(modalType) ?? (
              <p className="p-4 text-center text-gray-600">Modal topilmadi</p>
            )}
          </div>
        </div>
      )}

      {/* 🔹 Test uchun tugmalar */}
      <div className="p-3 flex gap-2 fixed bottom-3 right-3">
        {Array.from(CreatorModal.keys()).map((key) => (
          <button
            key={key}
            onClick={() => setModal(key)}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm shadow"
          >
            {key}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Area
