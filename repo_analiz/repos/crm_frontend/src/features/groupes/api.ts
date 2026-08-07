import { api } from "@/lib/axios" // yoki fetchWrapper, agar o‘zingda shunday fayl bo‘lsa
import { Group } from "./types"

/**
 * 🧾 Barcha groupes (guruhlar) ro‘yxatini olish
 */
export const getAllGroupes = async (): Promise<Group[]> => {
  const res = await api.get("/groupes/get-all")
  return res.data.groupes
}

/**
 * 📘 Bitta groupe-ni olish
 */
export const getOneGroupe = async (id: string): Promise<Group> => {
  const res = await api.get(`/groupes/${id}`)
  return res.data.group
}

export const getAllByRooId = async (id : string) => {
  const {data} = await api.get(`/groupes/get-all/by-roomid/${id}`)
  return data
}
/**
 * 🧠 Groupe yaratish
 */
export const createGroupe = async (data: object): Promise<Group> => {
  const res = await api.post("/groupes/create", data)
  return res.data.group
}

/**
 * ✏️ Groupe yangilash
 */
export const updateGroupe = async (id: string, data: object): Promise<Group> => {
  const res = await api.patch(`/groupes/${id}`, data)
  return res.data.group
}

/**
 * ❌ Groupe o‘chirish
 */
export const deleteGroupe = async (id: string): Promise<Group> => {
  const res = await api.delete(`/groupes/${id}`)
  return res.data.group
}
