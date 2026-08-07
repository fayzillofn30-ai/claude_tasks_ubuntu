import api from "@/lib/axios"
import { studentGroupresponseType,StudentGroup } from "./types"


export const createStudentGroup = async  (payload : {studentId : string,groupId : string}) : Promise<StudentGroup> => {
    const {data} = await api.post<studentGroupresponseType>("/student-groups/create",payload)
    return data.studentGroup
}

export const getFullStatistika = async (id : string) => {
    const {data} = await api(`/student-groups/get-full/by-roomid/${id}`)
    return data
}