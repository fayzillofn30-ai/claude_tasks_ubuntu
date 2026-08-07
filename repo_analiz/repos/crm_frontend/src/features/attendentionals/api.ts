import api from "@/lib/axios";
import { Attendentional } from "./types";

/** 🔹 Attendance Item (har bir student uchun) */
export interface AttendanceItemDto {
  studentId: string;
  kelgan?: boolean;
  kelganVaqti?: string;
  isDeleted?: boolean;
}

/** 🔹 Create Attendentionals DTO */
export interface CreateAttendentionalsDto {
  lessonId: string;
  attendances: AttendanceItemDto[];
}

/**
 * 🔹 Yangi attendance yozuvlarini yaratish (bir nechta student uchun)
 */
export const createAttendentional = async (
  data: CreateAttendentionalsDto
): Promise<{ message: string; createdCount: number }> => {
  const res = await api.post("/attendentionals/create", data);
  return res.data;
};

/**
 * 🔹 Barcha attendentionlarni olish
 */
export const getAllAttendentionals = async (): Promise<Attendentional[]> => {
  const res = await api.get("/attendentionals/get-all");
  return res.data.attendentionals;
};

/**
 * 🔹 Lesson bo‘yicha attendentionlarni olish
 */
export const getAttendentionalsByLessonId = async (
  lessonId: string
): Promise<Attendentional[]> => {
  const res = await api.get(`/attendentionals/get-all/by-lessonid/${lessonId}`);
  return res.data.attendentionals;
};

/**
 * 🔹 Group bo‘yicha attendentionlarni olish
 */
export const getAttendentionalsByGroupId = async (
  groupId: string
): Promise<Attendentional[]> => {
  const res = await api.get(`/attendentionals/get-all/by-groupid/${groupId}`);
  return res.data.attendentionals;
};

/**
 * 🔹 Bitta attendentionalni olish
 */
export const getAttendentionalById = async (
  id: string
): Promise<Attendentional> => {
  const res = await api.get(`/attendentionals/get-one/${id}`);
  return res.data.attendentional;
};

/**
 * 🔹 Attendentionni yangilash
 */
export const updateAttendentional = async (
  id: string,
  data: Partial<Attendentional>
): Promise<Attendentional> => {
  const res = await api.patch(`/attendentionals/update-one/${id}`, data);
  return res.data.attendentional;
};

/**
 * 🔹 Attendentionni o‘chirish (soft delete)
 */
export const deleteAttendentional = async (
  id: string
): Promise<Attendentional> => {
  const res = await api.delete(`/attendentionals/delete-one/${id}`);
  return res.data.attendentional;
};
