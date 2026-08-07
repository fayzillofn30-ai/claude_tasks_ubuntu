"use client"

import React, { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Layers, GraduationCap, Activity } from "lucide-react"
import { Rooms } from "@/features"
import { useRouter } from "next/navigation"
import { Button } from "@mui/material"
import CreateRoom from "@/components/modal/CreateRoom"

function LidsPage() {
  const [stats, setStats] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const [isOpenCreateModal, setIsOpenCreateModal] = useState<boolean>(false)

  useEffect(() => {
    const fetchStatistika = async () => {
      try {
        const res = await Rooms.getAllStatistika()
        if (res?.stats) setStats(res.stats)
      } catch (err: any) {
        setError(err.message || "Xatolik yuz berdi")
      } finally {
        setLoading(false)
      }
    }

    fetchStatistika()
  }, [])

  if (loading) {
    return <div className="flex justify-center py-10">⏳ Yuklanmoqda...</div>
  }

  if (error) {
    return (
      <div className="text-center text-red-500 font-medium py-10">
        Xatolik yuz berdi: {error}
      </div>
    )
  }

  return (
    <div className="w-full p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Rooms</h1>
        <Button
          variant="contained"
          onClick={() => setIsOpenCreateModal(true)}
        >
          Yangi xona qo‘shish
        </Button>
      </div>

      {/* Agar statistika mavjud bo‘lsa */}
      {stats.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {stats.map((room) => (
            <Card
              key={room.id}
              className="shadow-lg hover:shadow-xl transition border border-gray-200 cursor-pointer"
              onClick={() => router.push(`lids/${room.id}`)}
            >
              <CardHeader className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">
                  {room.name || "Nomsiz xona"}{" "}
                  <span className="text-sm text-gray-500">
                    ({room.roomNumber}-xona)
                  </span>
                </CardTitle>
              </CardHeader>

              <CardContent className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Layers className="text-purple-600" size={18} />
                    <span>Guruhlar</span>
                  </div>
                  <span className="font-bold">{room.groupCount}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-700">
                    <GraduationCap className="text-green-600" size={18} />
                    <span>Talabalar</span>
                  </div>
                  <span className="font-bold">{room.studentCount}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Activity className="text-rose-600" size={18} />
                    <span>Darslar</span>
                  </div>
                  <span className="font-bold">{room.lessonCount}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-10">
          Hozircha xonalar statistikasi topilmadi.
        </div>
      )}

      {/* CreateRoom modal */}
      {isOpenCreateModal && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
          <CreateRoom
            setModal={setIsOpenCreateModal}
            setRooms={setStats as unknown as () => void}
          />
        </div>
      )}
    </div>
  )
}

export default LidsPage
