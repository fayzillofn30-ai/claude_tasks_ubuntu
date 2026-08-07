"use client"

import CreateUser from '@/components/modal/CreateUser'
import api from '@/lib/axios'
import { useAllFetchedData } from '@/lib/ui.state'
import { User } from '@/types'
import { Button } from '@mui/material'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

function StudentsPage() {
  const { students, setStudents } = useAllFetchedData()
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false)
  const router = useRouter()

  const groupIds = []


  const onSuccess = async (user: User) => {
    try {
      const { data } = await api.post("/admin/create-role", {
        userId: user.id,
        role: "STUDENT",
      })
      console.log(data)
      setStudents([...students, data.staff])
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className="p-6">
      <div className="flex justify-between">
        <h2 className="text-2xl font-semibold mb-4">📚 O'quvchilar jadvali</h2>
        <Button variant="contained" onClick={() => setIsOpenModal(true)}>Yangi O'quvchi qo'shish</Button>
      </div>
      <div className="overflow-x-auto rounded-xl shadow">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left">#</th>
              <th className="py-3 px-4 text-left">Avatar</th>
              <th className="py-3 px-4 text-left">Ism</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Telefon</th>
              <th className="py-3 px-4 text-left">Tug‘ilgan sana</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500">
                  O‘quvchilar topilmadi.
                </td>
              </tr>
            ) : (
              students.map((student, index) => {
                const user = student.user
                const birthDay = new Date(user.birthDay).toLocaleDateString('uz-UZ')

                return (
                  <tr
                    key={student.id}
                    className="border-t hover:bg-gray-50 transition cursor-pointer active:bg-amber-200"
                    onClick={() => router.push(`/students/${student.id}`)}

                  >
                    <td className="py-3 px-4">{index + 1}</td>
                    <td className="py-3 px-4">
                      <img
                        src={
                          user.image ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}`
                        }
                        alt={user.fullName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    </td>
                    <td className="py-3 px-4 font-medium">{user.fullName}</td>
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4">{user.phone}</td>
                    <td className="py-3 px-4">{birthDay}</td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
      <div className={isOpenModal ? "flex justify-center items-center absolute inset-0 w-full h-full bg-[rgba(1,1,1,0.8)]" : "hidden"}>
        <CreateUser onSuccess={onSuccess} setModal={setIsOpenModal} />
      </div>
    </div>
  )
}

export default StudentsPage
