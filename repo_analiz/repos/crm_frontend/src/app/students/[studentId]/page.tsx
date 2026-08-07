"use client"

import { StudentGroupes } from '@/features'
import { useAllFetchedData } from '@/lib/ui.state'
import { Staff, Group } from '@/types'
import React, { useEffect, useMemo, useState } from 'react'
import { CircularProgress } from '@mui/material'
import api from '@/lib/axios'
import { useRouter } from 'next/navigation'

interface StudentPagePropsType {
    params: Promise<{ studentId: string }>
}

function StudentPage({ params }: StudentPagePropsType) {
    const { studentId } = React.use(params)
    const { groupes, students, loading } = useAllFetchedData()
    const [selectedGroupId, setSelectedGroupId] = useState<string>("")
    const [assigning, setAssigning] = useState(false)
    const [existsGroupes, setExistsGroupes] = useState<string[]>([])

    const router = useRouter() // router ni olish

    // === Talabaning mavjud guruhlarini olish ===
    const fetchGroupIds = async () => {
        try {
            const res = await api.get<string[]>(`student-groups/getids/studentid/${studentId}`)
            setExistsGroupes(res.data || [])
        } catch (err) {
            console.error("Talaba guruhlarini olishda xatolik:", err)
        }
    }

    useEffect(() => {
        fetchGroupIds()
    }, [studentId])

    // === Talabani topish ===
    const student: Staff | null = useMemo(() => {
        return students.find((s) => s.id === studentId) || null
    }, [students, studentId])

    // === Obuna bo'lmagan guruhlar ro‘yxati ===
    const availableGroupes: Group[] = useMemo(() => {
        return groupes.filter(g => !existsGroupes.includes(g.id))
    }, [groupes, existsGroupes])

    // === Guruhga biriktirish ===
    const handleSubmit = async () => {
        if (!selectedGroupId) {
            alert("Iltimos, guruh tanlang!")
            return
        }

        try {
            setAssigning(true)
            const res = await StudentGroupes.createStudentGroup({
                groupId: selectedGroupId,
                studentId: studentId,
            })
            alert("✅ Talaba guruhga muvaffaqiyatli biriktirildi!")
            // Yangi biriktirilgan guruhni mavjud ro‘yxatga qo‘shamiz
            setExistsGroupes(prev => [...prev, selectedGroupId])
            setSelectedGroupId("")
        } catch (err: any) {
            console.error("Biriktirishda xatolik:", err)
            alert(err?.response?.data?.message || "Xatolik yuz berdi!")
        } finally {
            setAssigning(false)
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <CircularProgress size={100} />
            </div>
        )
    }

    if (!student) {
        return (
            <div className="flex justify-center items-center h-screen text-gray-600">
                <p>❌ Talaba topilmadi</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex justify-center items-start p-10 bg-gray-50">
            <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md">
                {/* Back Button */}
                <div className="mb-4">
                    <button
                        onClick={() => router.back()} // "Back" tugmasi
                        className="text-indigo-600 font-medium hover:underline cursor-pointer"
                    >
                        🔙 
                    </button>
                </div>

                {/* Talaba rasmi */}
                <div className="flex flex-col items-center">
                    <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-indigo-500">
                        <img
                            src={
                                student.user.image
                                    ? `http://localhost:15976/${student.user.image}`
                                    : "https://via.placeholder.com/150"
                            }
                            alt={student.user.fullName}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <h2 className="mt-3 text-xl font-semibold text-gray-800">
                        {student.user.fullName}
                    </h2>
                    <p className="text-sm text-indigo-600 font-medium">{student.role}</p>
                </div>

                {/* Talaba ma'lumotlari */}
                <div className="mt-4 space-y-1 text-gray-600 text-sm border-t border-gray-200 pt-3">
                    <p>📧 <b>Email:</b> {student.user.email}</p>
                    <p>📞 <b>Telefon:</b> {student.user.phone}</p>
                    <p>🎂 <b>Tug‘ilgan sana:</b> {student.user.birthDay}</p>
                </div>

                {/* Guruh tanlash */}
                <div className="mt-6">
                    <label className="block text-sm font-medium mb-1">
                        Guruhni tanlang:
                    </label>

                    {availableGroupes.length > 0 ? (
                        <select
                            value={selectedGroupId}
                            onChange={(e) => setSelectedGroupId(e.target.value)}
                            className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">Tanlang...</option>
                            {availableGroupes.map((g: Group) => (
                                <option key={g.id} value={g.id}>
                                    {g.name}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <p className="text-gray-500 text-sm">
                            📘 Barcha guruhlarga obuna bo‘lgan
                        </p>
                    )}
                </div>

                {/* Submit tugmasi */}
                {availableGroupes.length > 0 && (
                    <div className="mt-5">
                        <button
                            disabled={assigning}
                            onClick={handleSubmit}
                            className={`w-full py-2 rounded-lg text-white font-medium transition ${assigning
                                ? "bg-indigo-400 cursor-not-allowed"
                                : "bg-indigo-600 hover:bg-indigo-700"
                                }`}
                        >
                            {assigning ? "Biriktirilmoqda..." : "Guruhga biriktirish"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default StudentPage
