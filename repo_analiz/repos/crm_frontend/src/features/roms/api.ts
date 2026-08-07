import { api } from "@/lib/axios"
import { Room } from "./types"

/**
 * 🧾 Barcha rooms ro‘yxatini olish
 */
export const getAllRooms = async (): Promise<Room[]> => {
  const res = await api.get("/rooms/get-all")
  return res.data.roms
}

/**
 * 📘 Bitta room-ni olish
 */
export const getOneRoom = async (id: string): Promise<Room> => {
  const res = await api.get(`/rooms/get-one/${id}`)
  return res.data.room
}
export const getAllStatistika = async() => {
  const {data} =  await api.get("/rooms/get-all/statistika/romms")
  return data
}
/**
 * 🧠 Room yaratish
 */
export const createRoom = async (data: object): Promise<Room> => {
  const res = await api.post("/rooms/create", data)
  return res.data.room
}

/**
 * ✏️ Room yangilash
 */
export const updateRoom = async (id: string, data: Partial<Room>): Promise<Room> => {
  const res = await api.patch(`/rooms/update-one/${id}`, data)
  return res.data.room
}

/**
 * ❌ Room o‘chirish
 */
export const deleteRoom = async (id: string): Promise<Room> => {
  const res = await api.delete(`/rooms/delete-one/${id}`)
  return res.data.room
}
