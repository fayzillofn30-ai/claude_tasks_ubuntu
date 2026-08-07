"use client"

import React, { useEffect, useState } from "react"
import { Courses } from "@/features"
import { useAllFetchedData, useSelectedStore } from "@/lib/ui.state"
import { useRouter } from "next/navigation"
import { Button } from "@mui/material"
import CreateCourse from "@/components/modal/CreateCourse"
import { Course } from "@/types"
import { Edit } from "lucide-react"
import CourseUpdateModal from "@/components/modal/UodateCourseModal"

function CoursesRender() {
    const [courses, setCourses] = useState<Course[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { setCourseId } = useSelectedStore()
    const { courses: GlobalCourses } = useAllFetchedData()
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false)
    const [isOpenUpdateModal, setIsOpenUpdateModal] = useState<boolean>(false)

    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
    const router = useRouter()
    const fetchData = async () => {
        if (GlobalCourses && GlobalCourses[0]) {
            setCourses(GlobalCourses)
            return
        }
        setLoading(true)
        setError(null)
        try {
            const allCoursesRender = await Courses.coursesApi.getAll()
            setCourses(allCoursesRender)
        } catch (err) {
            console.error(err)
            setError("Kurslarni yuklashda xatolik yuz berdi!")
        } finally {
            setLoading(false)
        }
    }

    const handleUpdatedCourse = async (course: Course) => {
        try {
            setCourses((prev) => {
                let old = [...prev]
                return old.map(c => {
                    if (c.id == course.id) {
                        return course
                    }
                    return c
                })
            })
        } catch (error) {
            console.log(error)
        }
    }

    const updateCoursePublished = async (course: Course) => {
        try {
            // 1️⃣ Kursni holatini topamiz

            // 4️⃣ Frontda local state-ni yangilaymiz
            setCourses((prev) =>
                prev.map((c) =>
                    c.id === course.id ? { ...c, published: !c.published } : c
                )
            )

            // 5️⃣ Ixtiyoriy: foydalanuvchiga xabar
            console.log(
                `Kurs "${course.name}" ${!course.published ? "faollashtirildi ✅" : "nofaol qilindi 🕓"}`
            )
        } catch (error) {
            console.error("Kursni yangilashda xatolik:", error)
        }
    }



    useEffect(() => {
        fetchData()
    }, [])

    if (loading) return <p>Yuklanmoqda...</p>
    if (error) return <p style={{ color: "red" }}>{error}</p>

    return (
        <div>
            <div className="w-full flex justify-between items-center my-4">
                <h1>Kurslar </h1>
                <Button variant="contained" onClick={() => setIsOpenModal(true)}>Yangi kurs qo'shish</Button>

            </div>
            {
                courses.length > 0 ? <div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
                        {courses.map((course) => (
                            <div
                                key={course.id}
                                style={{
                                    border: "1px solid #ddd",
                                    borderRadius: "8px",
                                    width: "250px",
                                    padding: "12px",
                                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                }}
                                className="bg-gradient-to-b from-[rgba(107,177,105,0.8)] to-[rgba(105,125,192,0.8)]"
                            >
                                <div className="flex">

                                </div>
                                <div className="relative">
                                    {course.image ? (
                                        <img
                                            src={course.image.startsWith("http") ? course.image : `http://localhost:15976/${course.image}`}
                                            alt={course.name}
                                            style={{ width: "100%", height: "140px", objectFit: "cover", borderRadius: "6px" }}
                                            className="shadow-2xl"
                                        />
                                    ) : (
                                        <div
                                            style={{
                                                width: "100%",
                                                height: "140px",
                                                backgroundColor: "#eee",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: "48px",
                                                fontWeight: "bold",
                                                borderRadius: "6px",
                                            }}
                                        >
                                            {course.name.charAt(0)}
                                        </div>
                                    )}
                                    <button className="absolute top-3 right-3 bg-gradient-to-b from-red-950 to-blue-600 p-1.5 rounded-2xl text-amber-50 cursor-pointer" onClick={() => {
                                        setIsOpenUpdateModal(true)
                                        setSelectedCourse(course)
                                    }}><Edit size={16}></Edit></button>
                                </div>
                                <div className="flex justify-between my-2.5">
                                    <h3 className="text-2xl bg-gradient-to-b from-violet-400 to-green-700 px-2 rounded-2xl">{course.name}</h3>
                                </div>
                                <p><strong>Narxi:</strong> {course.price.toLocaleString("uz-UZ")} so'm</p>
                                <p><strong>Davomiyligi:</strong> {course.durationMont} oy</p>
                                <p>
                                    <strong>Hafta kunlari:</strong>{" "}
                                    {course.weekDays.length ? course.weekDays.join(", ") : "Belgilanmagan"}
                                </p>
                                <p><strong>Dars davomiyligi:</strong> {course.durationMinut} daqiqa</p>
                                <p style={{ color: course.published ? "green" : "orange" }}>
                                    {course.published ? "✅ Faol" : "🕓 Nofaol"}
                                </p>
                                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
                                    <button
                                        style={{
                                            backgroundColor: course.published ? "#f57c00" : "#2e7d32",
                                            color: "white",
                                            border: "none",
                                            padding: "6px 12px",
                                            borderRadius: "4px",
                                            cursor: "pointer",
                                        }}
                                        onClick={() => updateCoursePublished(course)}
                                    >
                                        {course.published ? "Bekor qilish" : "Elon qilish"}
                                    </button>

                                    <button
                                        style={{
                                            backgroundColor: "#1976d2",
                                            color: "white",
                                            border: "none",
                                            padding: "6px 12px",
                                            borderRadius: "4px",
                                            cursor: "pointer",
                                        }}
                                        onClick={() => {
                                            setCourseId(course.id)
                                            router.push(`/courses/${course.id}`)
                                        }}
                                    >
                                        Ko'rish
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className={isOpenUpdateModal ? "flex bg-[rgba(1,1,1,0.8)]" : "hidden"}>
                        {
                            selectedCourse ? <CourseUpdateModal course={selectedCourse} onUpdated={handleUpdatedCourse} open={isOpenUpdateModal} setOpen={setIsOpenUpdateModal} /> : ""
                        }
                    </div>
                </div> : <p>Hozircha hech qanday kurs mavjud emas.</p>
            }
            <div className={isOpenModal ? "flex" : "hidden"}>
                <CreateCourse setModal={setIsOpenModal} setCourses={setCourses} />
            </div>
        </div>
    )
}

export default CoursesRender
