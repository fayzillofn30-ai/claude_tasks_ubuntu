import { Attendentionals, Staffs } from '@/features'
import { useAllFetchedData, useSelectedStore } from '@/lib/ui.state'
import { Staff } from '@/types'
import React, { useEffect, useState } from 'react'

function AddAttendense() {

    const { groupes, lessons, loading, error, fetchAll } = useAllFetchedData()
    const { selectedLessonId, selectedGroupId, setGroupId, setLessonId, setTeacherId, selectedTeacherId } = useSelectedStore()
    const [isSubmit,] = useState()
    const [students, setStudets] = useState<Staff[]>([])

    const fetchStudents = async () => {
        if (selectedGroupId && selectedLessonId) {

            /*
            [
    {
        "id": "3c0f817b-de41-4087-8c9c-c66bea445f69",
        "role": "STUDENT",
        "user": {
            "id": "d930d04f-5ebc-4fa3-b9d8-fde94b298a70",
            "fullName": "Abdulloh Ummatov",
            "email": "cdscdswcdscsdc@gmail.com",
            "phone": "916102142",
            "image": null,
            "birthDay": "2025-10-06T00:00:00.000Z",
            "isDeleted": false
        },
        "isDeleted": false
    }
]
            */
            const res = await Staffs.getStudentsByGroupId(selectedGroupId)
            /*
            [
    {
        "id": "12a320e6-bcb4-4e95-be39-9b6c092375bd",
        "lessonId": "0f734490-4adc-4d74-8534-ac53e5ecdebd",
        "lessonName": null,
        "studentId": "3c0f817b-de41-4087-8c9c-c66bea445f69",
        "studentName": null,
        "kelganVaqti": "2025-10-21T20:08:34.806Z",
        "kelgan": true,
        "isDeleted": false
    }
]
            */
            const attendenses = await Attendentionals.getAttendentionalsByLessonId(selectedLessonId)
            console.log(res, attendenses)
        }
    }

    useEffect(() => {
        fetchStudents()
    }, [])

    return (
        <div>AddAttendense</div>
    )
}

export default AddAttendense