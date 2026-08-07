"use client"

import React, { useEffect, useState } from "react"
import { useAllFetchedData } from "@/lib/ui.state"
import { useRouter } from "next/navigation"
import CreateUser from "@/components/modal/CreateUser"
import { User } from "@/types"
import api from "@/lib/axios"
import { Button } from "@mui/material"

export default function Teachers() {
  const { teachers, loading, error, fetchAll, setTeachers } = useAllFetchedData()
  const router = useRouter()
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false)

  const onSuccess = async (user: User) => {
    try {
      const { data } = await api.post("/admin/create-role", {
        userId: user.id,
        role: "TEACHER",
      })
      console.log(data)
      setTeachers([...teachers, data.staff])
    } catch (error) {
      console.log(error)
    }
  }

  if (loading) return <p className="text-center text-gray-500">⏳ O‘qituvchilar yuklanmoqda...</p>
  if (error) return <p className="text-center text-red-500">❌ Xatolik: {error}</p>

  return (
    <div className="p-6">
      <div className="flex justify-between">
        <h2 className="text-2xl font-semibold text-blue-600 mb-4">O‘qituvchilar ro‘yxati</h2>
        <Button variant="contained" onClick={() => setIsOpenModal(true)}>Yangi O'qituvchi qo'shish</Button>
      </div>

      {teachers.length ? <div>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-xl overflow-hidden shadow-sm">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-4 py-2 text-left">#</th>
                <th className="px-4 py-2 text-left">Ism</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Telefon</th>
                <th className="px-4 py-2 text-left">Tug‘ilgan sana</th>
                <th className="px-4 py-2 text-left">Holati</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((t: any, index: number) => (
                <tr
                  key={t.id}
                  className={`border-t hover:bg-blue-50 transition cursor-pointer ${t.isDeleted ? "opacity-50" : ""
                    }`}
                  onClick={() => router.push(`/teachers/${t.id}`)}
                >
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2 flex items-center gap-2">
                    {t.user?.image ? (
                      <img
                        src={t.user.image}
                        alt={t.user.fullName}
                        className="w-8 h-8 rounded-full border"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm">
                        {t.user?.fullName?.charAt(0) || "?"}
                      </div>
                    )}
                    <span>{t.user?.fullName || "-"}</span>
                  </td>
                  <td className="px-4 py-2">{t.user?.email || "-"}</td>
                  <td className="px-4 py-2">{t.user?.phone || "-"}</td>
                  <td className="px-4 py-2">
                    {t.user?.birthDay
                      ? new Date(t.user.birthDay).toLocaleDateString("uz-UZ")
                      : "-"}
                  </td>
                  <td className="px-4 py-2">
                    {t.isDeleted ? (
                      <span className="text-red-500 font-medium">O‘chirildi</span>
                    ) : (
                      <span className="text-green-600 font-medium">Faol</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-sm text-gray-600 mt-2 text-right">
          Jami o‘qituvchilar: {teachers.length}
        </p>
      </div> : 
      <p className="text-center text-gray-500">Hech qanday o‘qituvchi topilmadi.</p>}
      <div className={isOpenModal ? "flex justify-center items-center absolute inset-0 w-full h-full bg-[rgba(1,1,1,0.8)]" : "hidden"}>
        <CreateUser onSuccess={onSuccess} setModal={setIsOpenModal} />
      </div>
    </div>
  )
}
