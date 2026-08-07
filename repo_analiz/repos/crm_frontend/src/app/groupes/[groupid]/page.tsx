"use client"

import React, { useEffect, useMemo } from "react"
import { useAllFetchedData, useSelectedStore } from "@/lib/ui.state"
import { Button } from "@mui/material"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

export default function GroupeRender({ params }: { params: Promise<{ groupid: string }> }) {
    // ✅ Promise ni React.use() orqali ochamiz
    const { groupid } = React.use(params)
    const router = useRouter()
    const { selectedGroupId, setGroupId, } = useSelectedStore()
    const { groupes, error, loading, fetchAll } = useAllFetchedData()

    // ⚙️ groupid ni store'ga o‘rnatish
    useEffect(() => {
        if (groupid) setGroupId(groupid)
    }, [groupid, setGroupId])


    useEffect(() => {
        console.log("Tanlangan ID:", selectedGroupId)
        fetchAll()
    }, [selectedGroupId])

    const selectedGroup = useMemo(() => {
        console.log(groupes)
        return groupes && groupes[0] ? groupes?.find((g: any) => g.id === selectedGroupId) : null
    }, [selectedGroupId, groupes])

    if (loading) return <p className="text-center text-gray-500">⏳ Guruhlar yuklanmoqda...</p>
    if (error) return <p className="text-center text-red-500">Xatolik yuz berdi: {error}</p>
    if (!selectedGroupId) return <p className="text-center text-gray-500">Hech qanday guruh tanlanmagan.</p>


    if (!selectedGroup) return <p className="text-center text-gray-500">Tanlangan guruh topilmadi.</p>

    return (
        <div className="flex flex-col justify-center p-4">
            <div className="mb-4">
                <button
                    onClick={() => router.push(`/groupes`)}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition text-lg font-medium"
                >
                    <ArrowLeft className="w-6 h-6" />
                    Ortga
                </button>
            </div>
            <div className="relative bg-white shadow-lg rounded-2xl p-6 w-full max-w-md border border-blue-500">
                {/* 🔘 CLOSE tugmasi */}
                <button
                    onClick={() => setGroupId(null)}
                    className="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition-colors"
                    title="Yopish"
                >
                    ✕
                </button>

                <h2 className="text-xl font-semibold text-blue-600 text-center mb-4">
                    {selectedGroup.name}
                </h2>

                <div className="space-y-2 text-gray-700">
                    <p><span className="font-medium">Kurs:</span> {selectedGroup.courseName}</p>
                    <p><span className="font-medium">O‘qituvchi:</span> {selectedGroup.teacherFirstName} {selectedGroup.teacherLastName}</p>
                    <p><span className="font-medium">Telefon:</span> {selectedGroup.teacherPhone}</p>
                    <p><span className="font-medium">Xona:</span> {selectedGroup.romName} #{selectedGroup.romNumber}</p>
                    <p><span className="font-medium">Narx:</span> {selectedGroup.coursePrice.toLocaleString()} so‘m</p>
                    <p><span className="font-medium">O‘quvchilar:</span> {selectedGroup.studentCount}</p>
                    <p><span className="font-medium">Darslar:</span> {selectedGroup.lessonCount}</p>
                    <p><span className="font-medium">To‘lovlar:</span> {selectedGroup.paymentCount}</p>
                    <p><span className="font-medium">Boshlanish:</span> {new Date(selectedGroup.startDate).toLocaleDateString()}</p>
                </div>

                <div className="flex items-center justify-between">
                    <div
                        className={`text-center font-semibold ${selectedGroup.isEnd
                            ? "text-red-500"
                            : selectedGroup.isStart
                                ? "text-green-500"
                                : "text-orange-500"
                            }`}
                    >
                        {selectedGroup.isEnd
                            ? "🔴 Tugagan"
                            : selectedGroup.isStart
                                ? "🟢 Boshlangan"
                                : "🟠 Boshlanmagan"}
                    </div>
                    <div>
                        <Button>
                            {selectedGroup.isEnd
                                ? "🔴 Tugagan"
                                : selectedGroup.isStart
                                    ? "🟢 Yopish"
                                    : "🟠 Boshlash"}
                        </Button>
                    </div>
                    <div className="">
                        <Button onClick={() => {
                            router.push(`${groupid}/lessons`)
                        }}>Lessons</Button>
                    </div>
                </div>

            </div>

        </div>
    )
}
