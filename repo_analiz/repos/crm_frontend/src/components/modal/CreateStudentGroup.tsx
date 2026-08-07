"use client"

import { Groupes, Staffs, StudentGroupes } from '@/features'
import React, { useEffect, useState } from 'react'

type studentGroupData = {
  studentId: string,
  groupId: string
}

function CreateStudentGroup() {
  const [selectedStudent, setSelectedStudent] = useState<string>("")
  const [selectedGroup, setSelectedGroup] = useState<string>("")
  const [allStudentsState, setAllStudentsState] = useState<any[]>([])
  const [allTeachersState, setAllTeachersState] = useState<any[]>([])
  const [allGroupesState, setAllGroupesState] = useState<any[]>([])

  const handleCreategroup = async () => {
    const students = await Staffs.getAllStudents()
    const teachers = await Staffs.getAllTeachers()
    const groupes = await Groupes.getAllGroupes()

    setAllStudentsState(students)
    setAllTeachersState(teachers)
    setAllGroupesState(groupes)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedStudent || !selectedGroup) {
      alert("Iltimos, talabani va guruhni tanlang.")
      return
    }

    const res = await StudentGroupes.createStudentGroup({
      studentId: selectedStudent,
      groupId: selectedGroup
    })
    console.log(res)
  }

  useEffect(() => {
    handleCreategroup()
  }, [])

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-4 p-4">
        <div>
          <label className="block mb-1">Talaba</label>
          <select
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">Tanlang</option>
            {allStudentsState.map((student: any) => {
              const { id, user: { fullName } } = student
              return <option key={id} value={id}>{fullName}</option>
            })}
          </select>
        </div>

        <div>
          <label className="block mb-1">Guruh</label>
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">Tanlang</option>
            {allGroupesState.map((group: any) => (
              <option key={group.id} value={group.id}>{group.name}</option>
            ))}
          </select>
        </div>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Biriktirish
        </button>
      </div>
    </form>
  )
}

export default CreateStudentGroup
