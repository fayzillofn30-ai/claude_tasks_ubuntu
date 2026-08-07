"use client"

import React, { useEffect, useState } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Checkbox,
    Button,
    CircularProgress,
} from "@mui/material"
import { Staff } from "@/types"
import { Attendentionals } from "@/features"

interface CreateAttendenceProps {
    lessonId: string
    students: Staff[]
}

const CreateAttendence: React.FC<CreateAttendenceProps> = ({ lessonId, students }) => {
    const [attendances, setAttendances] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    // 📥 Davomatni olish yoki yaratish
    const fetchAttendences = async () => {
        try {
            setLoading(true)
            const attends = await Attendentionals.createAttendentional({
                attendances: students.map(staff => ({
                    studentId: staff.id,
                    kelgan: false
                })),
                lessonId: lessonId
            })
            const data = await Attendentionals.getAttendentionalsByLessonId(lessonId)
            // Agar bazada mavjud bo‘lsa — normalize qilib olamiz
            const existing = (data || []).map((a: any) => ({
                id: a.id,
                lessonId: a.lessonId,
                studentId: a.studentId,
                studentName: a.student?.user?.fullName ?? a.studentName ?? "Noma’lum",
                studentPhone: a.student?.user?.phone ?? a.studentPhone ?? "-",
                studentEmail: a.student?.user?.email ?? a.studentEmail ?? "-",
                kelgan: a.kelgan ?? false,
                kelganVaqti: a.kelganVaqti ?? null,
                isDeleted: a.isDeleted ?? false,
            }))

            // Har bir student uchun — agar davomat bo‘lmasa, default yaratamiz
            const merged = students.map((s) => {
                const found = existing.find((a) => a.studentId === s.id)
                if (found) return found // mavjud bo‘lsa, bazadagini olamiz

                // bo‘lmasa yangi default yaratamiz
                return {
                    id: crypto.randomUUID(),
                    lessonId,
                    studentId: s.id,
                    studentName: s.user.fullName,
                    studentPhone: s.user.phone,
                    studentEmail: s.user.email,
                    kelgan: false,
                    kelganVaqti: null,
                    isDeleted: false,
                }
            })

            setAttendances(merged)
        } catch (err) {
            console.error("Davomatni olishda xatolik:", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAttendences()
    }, [lessonId, students])

    // 🔄 Checkboxni o‘zgartirish
    const handleToggle = (studentId: string) => {
        setAttendances((prev) =>
            prev.map((item) =>
                item.studentId === studentId
                    ? {
                        ...item,
                        kelgan: !item.kelgan,
                        kelganVaqti: !item.kelgan ? new Date().toISOString() : null,
                    }
                    : item
            )
        )
    }

    // 💾 Saqlash
    const handleSubmit = async () => {
        try {
            setLoading(true)
            await Promise.all(
                attendances.map(async (p) => {
                    const payload = {
                        lessonId,
                        studentId: p.studentId,
                        kelganVaqti: p.kelgan ? p.kelganVaqti : undefined,
                        kelgan: p.kelgan,
                        isDeleted: p.isDeleted,
                    }
                    return Attendentionals.updateAttendentional(p.id, payload)
                })
            )

            alert("Davomat muvaffaqiyatli saqlandi ✅")
        } catch (error) {
            console.error(error)
            alert("Davomatni saqlashda xatolik yuz berdi ❌")
        } finally {
            setLoading(false)
        }
    }

    // 🌀 Yuklanish holati
    if (loading && attendances.length === 0) {
        return (
            <div className="flex justify-center p-6">
                <CircularProgress />
            </div>
        )
    }

    // 📋 Jadval
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">
                🧾 Dars davomat jadvali
            </h2>

            <TableContainer component={Paper} className="shadow-md">
                <Table>
                    <TableHead>
                        <TableRow className="bg-blue-600">
                            <TableCell className="text-white font-semibold">#</TableCell>
                            <TableCell className="text-white font-semibold">Ism familiya</TableCell>
                            <TableCell className="text-white font-semibold">Telefon</TableCell>
                            <TableCell className="text-white font-semibold">Email</TableCell>
                            <TableCell className="text-white font-semibold">Kelgan</TableCell>
                            <TableCell className="text-white font-semibold">Kelgan vaqti</TableCell>
                            <TableCell className="text-white font-semibold">Status</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {attendances.length > 0 ? (
                            attendances.map((a, index) => (
                                <TableRow key={a.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{a.studentName}</TableCell>
                                    <TableCell>{a.studentPhone}</TableCell>
                                    <TableCell>{a.studentEmail}</TableCell>
                                    <TableCell>
                                        <Checkbox
                                            checked={a.kelgan || false}
                                            onChange={() => handleToggle(a.studentId)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {a.kelganVaqti
                                            ? new Date(a.kelganVaqti).toLocaleTimeString("uz-UZ")
                                            : "-"}
                                    </TableCell>
                                    <TableCell>
                                        {a.isDeleted ? (
                                            <span className="px-3 py-1 rounded bg-red-100 text-red-600 text-sm">
                                                O‘chirilgan
                                            </span>
                                        ) : (
                                            <span className="px-3 py-1 rounded bg-green-100 text-green-600 text-sm">
                                                Faol
                                            </span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    Davomat ma’lumotlari yo‘q
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <div className="flex justify-end">
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    Saqlash
                </Button>
            </div>
        </div>
    )
}

export default CreateAttendence
