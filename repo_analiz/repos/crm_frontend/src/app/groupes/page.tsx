"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Eye } from "lucide-react"
import { useAllFetchedData, useSelectedStore } from "@/lib/ui.state"
import { Group } from "@/features/groupes"
import { Groupes } from "@/features"
import CreateCourse from "@/components/modal/CreateCourse"
import { Button } from "@mui/material"
import CreateGroup from "@/components/modal/CreateGroup"

function GroupesRender() {
    const [allGroups, setAllGroups] = useState<Group[]>([])
    const [loading, setLoading] = useState(false)
    const [fetchError, setFetchError] = useState(false)
    const router = useRouter()
    const { groupes, error } = useAllFetchedData()
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false)
    const { setGroupId, setLessonId } = useSelectedStore()

    useEffect(() => {
        if (groupes && groupes[0]) {
            setAllGroups(groupes)
            return
        }
        setLoading(true)
        Groupes.getAllGroupes()
            .then(res => {
                setAllGroups(res)
                setLoading(false)
            })
            .catch(() => {
                setFetchError(true)
                setLoading(false)
            })
    }, [])


    const onSuccess = (group : Group) => {
        setAllGroups(prev => [...prev,group])
    }

    const viewGroup = (groupId: string) => {
        setGroupId(groupId)
        setLessonId(null)
        router.push(`/groupes/${groupId}`)
    }

    if (loading) {
        return (
            <div className="text-center mt-8 text-blue-600 font-medium">
                ⏳ Ma'lumotlar yuklanmoqda...
            </div>
        )
    }

    if (fetchError) {
        return (
            <div className="text-center mt-8 text-red-600 font-semibold">
                ❌ Guruhlarni yuklashda xatolik yuz berdi!
            </div>
        )
    }

    return (
        <div className="p-4">
            <div className="flex justify-between my-4">
                <h2 className="text-2xl font-semibold mb-4 text-center">
                    📚 Guruhlar ro'yxati
                </h2>
                <Button variant="contained" onClick={() => setIsOpenModal(true)}> Yangi guruh qo'shish</Button>
            </div>

            {
                groupes.length > 0 ? <div className="overflow-x-auto rounded-lg shadow">
                    <table className="min-w-full border border-gray-200 bg-white">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2 text-left">#</th>
                                <th className="px-4 py-2 text-left">Kurs nomi</th>
                                <th className="px-4 py-2 text-left">Guruh nomi</th>
                                <th className="px-4 py-2 text-left">O'qituvchi</th>
                                <th className="px-4 py-2 text-left">Xona</th>
                                <th className="px-4 py-2 text-center">O‘quvchilar</th>
                                <th className="px-4 py-2 text-center">Darslar</th>
                                <th className="px-4 py-2 text-center">To‘lovlar</th>
                                <th className="px-4 py-2 text-left">Boshlanish</th>
                                <th className="px-4 py-2 text-left">Holat</th>
                                <th className="px-4 py-2 text-center">Amal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allGroups.map((group, index) => (
                                <tr
                                    key={group.id}
                                    className="border-t hover:bg-gray-50 transition"
                                >
                                    <td className="px-4 py-2">{index + 1}</td>
                                    <td className="px-4 py-2">{group.courseName}</td>
                                    <td className="px-4 py-2">{group.name}</td>
                                    <td className="px-4 py-2">
                                        {group.teacherFirstName} {group.teacherLastName}
                                    </td>
                                    <td className="px-4 py-2">
                                        {group.romName}{" "}
                                        <span className="text-gray-400 text-sm">
                                            (#{group.romNumber})
                                        </span>
                                    </td>
                                    <td className="px-4 py-2 text-center">{group.studentCount}</td>
                                    <td className="px-4 py-2 text-center">{group.lessonCount}</td>
                                    <td className="px-4 py-2 text-center">{group.paymentCount}</td>
                                    <td className="px-4 py-2">
                                        {group.startDate
                                            ? new Date(group.startDate).toLocaleDateString()
                                            : "-"}
                                    </td>
                                    <td className="px-4 py-2">
                                        {group.isEnd ? (
                                            <span className="text-red-600 font-medium">Tugagan</span>
                                        ) : group.isStart ? (
                                            <span className="text-green-600 font-medium">Boshlangan</span>
                                        ) : (
                                            <span className="text-yellow-600 font-medium">Boshlanmagan</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-2 text-center">
                                        <button
                                            onClick={() => viewGroup(group.id)}
                                            className="p-1 rounded hover:bg-blue-100 transition"
                                            title="Ko‘rish"
                                        >
                                            <Eye className="w-5 h-5 text-blue-600" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div> : <div className="text-center mt-8 text-gray-600">
                    Hozircha hech qanday guruh mavjud emas.
                </div>
            }
            <div className={`inset-0 w-full h-screen absolute ${isOpenModal ? "flex justify-center items-center" : "hidden"}`}>
                <CreateGroup setModal={setIsOpenModal} setGroupes={setAllGroups} />
            </div>
        </div>
    )
}

export default GroupesRender
