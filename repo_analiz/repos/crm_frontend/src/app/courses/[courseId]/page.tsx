"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Courses } from "@/features"
import { useAllFetchedData } from "@/lib/ui.state"
import { Course, Group } from "@/types"
import { ArrowLeft } from "lucide-react"

export default function CoursePage({
    params,
}: {
    params: Promise<{ courseId: string }>
}) {
    const { courseId } = React.use(params)
    const router = useRouter()

    const [course, setCourse] = useState<Course | null>(null)
    const [groupesByCourseId, setGroupesByCourseId] = useState<Group[]>([])
    const { groupes, loading, error, fetchAll } = useAllFetchedData()

    // 🎓 Kursni olish
    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const res = await Courses.coursesApi.getOne(courseId)
                setCourse(res)
            } catch (err) {
                console.error("❌ Kursni olishda xatolik:", err)
            }
        }
        fetchCourse()
    }, [courseId])

    // 🧩 Guruhlarni kurs ID bo‘yicha filter qilish
    useEffect(() => {
        if (groupes && groupes.length > 0) {
            const filtered = groupes.filter((g) => g.courseId === courseId)
            setGroupesByCourseId(filtered)
        } else if (!groupes && !loading) {
            fetchAll()
        }
    }, [groupes, courseId, loading, fetchAll])

    if (!course) {
        return (
            <div className="p-6 text-gray-600">
                <h1 className="text-xl font-semibold">⏳ Kurs ma’lumotlari yuklanmoqda...</h1>
                <p className="mt-2 font-mono">{courseId}</p>
            </div>
        )
    }

    // 🚀 Guruhga o‘tish funksiyasi
    const handleViewGroup = (groupId: string) => {
        router.push(`/groupes/${groupId}`)
    }

    return (
        <div className="p-6 space-y-6">
            <div className="mb-4">
                <button
                    onClick={() => router.push("/courses")}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition text-lg font-medium"
                >
                    <ArrowLeft className="w-6 h-6" />
                    Ortga
                </button>
            </div>
            {/* 📘 Kurs ma’lumotlari */}
            <div className="flex items-center gap-4">
                {course.image && (
                    <img
                        src={course.image}
                        alt={course.name}
                        className="w-20 h-20 rounded-xl object-cover border"
                    />
                )}
                <div>
                    <h1 className="text-3xl font-semibold text-blue-600">{course.name}</h1>
                    <p className="text-gray-500 mt-1">
                        Narxi: <span className="font-medium">{course.price.toLocaleString()} so‘m</span>
                    </p>
                    <p className="text-gray-500">
                        Davomiyligi: {course.durationMont} oy, {course.durationMinut} daqiqa
                    </p>
                </div>
            </div>

            {/* 📋 Guruhlar jadvali */}
            <div>
                <h2 className="text-xl font-semibold mb-2 text-gray-700">Guruhlar ro‘yxati</h2>

                {loading ? (
                    <p className="text-gray-500">⏳ Yuklanmoqda...</p>
                ) : error ? (
                    <p className="text-red-500">❌ Xatolik: {error}</p>
                ) : groupesByCourseId.length === 0 ? (
                    <p className="text-gray-500">Bu kursda hali guruhlar mavjud emas.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-300 rounded-xl shadow-sm">
                            <thead className="bg-blue-600 text-white">
                                <tr>
                                    <th className="px-4 py-2 text-left">#</th>
                                    <th className="px-4 py-2 text-left">Guruh nomi</th>
                                    <th className="px-4 py-2 text-left">O‘qituvchi</th>
                                    <th className="px-4 py-2 text-left">Xona</th>
                                    <th className="px-4 py-2 text-left">Boshlanish</th>
                                    <th className="px-4 py-2 text-left">Holat</th>
                                    <th className="px-4 py-2 text-center">View</th>
                                </tr>
                            </thead>
                            <tbody>
                                {groupesByCourseId.map((g, i) => (
                                    <tr key={g.id} className="border-t hover:bg-blue-50 transition">
                                        <td className="px-4 py-2">{i + 1}</td>
                                        <td className="px-4 py-2 font-medium">{g.name}</td>
                                        <td className="px-4 py-2">
                                            {g.teacherFirstName} {g.teacherLastName}
                                        </td>
                                        <td className="px-4 py-2">
                                            {g.romName} #{g.romNumber}
                                        </td>
                                        <td className="px-4 py-2">
                                            {new Date(g.startDate).toLocaleDateString("uz-UZ")}
                                        </td>
                                        <td className="px-4 py-2">
                                            {g.isEnd ? (
                                                <span className="text-red-500 font-medium">Yakunlangan</span>
                                            ) : g.isStart ? (
                                                <span className="text-green-600 font-medium">Faol</span>
                                            ) : (
                                                <span className="text-gray-500">Kutilmoqda</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                            <button
                                                onClick={() => handleViewGroup(g.id)}
                                                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm transition"
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}
