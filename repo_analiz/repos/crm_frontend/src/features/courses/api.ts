// src/features/courses/api.ts
import api from "@/lib/axios";
import { CourseFlat } from "./types";
import { Course } from "@/types";

type CreateDto = Partial<CourseFlat>;
type UpdateDto = Partial<CourseFlat>;

export const coursesApi = {
  /** Create course — if image provided → multipart, else → json */
  create: async (dto: object, image?: File) => {
    let data;

    if (image) {
      const form = new FormData();

      // DTO qiymatlarini stringga aylantirib formga qo‘shamiz
      Object.entries(dto).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          form.append(key, typeof value === "object" ? JSON.stringify(value) : String(value));
        }
      });

      // Backend FileInterceptor("image") kutgani uchun nomi "image" bo‘lishi kerak
      form.append("image", image);

      const res = await api.post("/courses/create", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      data = res.data;
    } else {
      const res = await api.post("/courses/create", dto);
      data = res.data;
    }

    return data as { message: string; course: CourseFlat };
  },

  /** Get all courses */
  getAll: async () => {
    const { data } = await api.get("/courses/get-all");
    return (data as { message: string; count: number; courses: CourseFlat[] }).courses;
  },

  /** Get one course */
  getOne: async (id: string) : Promise<Course>=> {
    const { data } = await api.get<{message : string,course : Course}>(`/courses/get-one/${id}`);
    return data.course;
  },

  /** Update course — image bo‘lsa multipart, bo‘lmasa JSON */
  update: async (id: string, dto: UpdateDto, image?: File) : Promise< { message: string; course: CourseFlat }>=> {
    let data;

    if (image) {
      const form = new FormData();
      Object.entries(dto).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          form.append(key, typeof value === "object" ? JSON.stringify(value) : String(value));
        }
      });
      form.append("image", image);

      const res = await api.patch(`/courses/update-one/${id}`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      data = res.data;
    } else {

      const res = await api.patch(`/courses/update-one/${id}`, dto);
      data = res.data;
    }

    return data as { message: string; course: CourseFlat };
  },

  /** Delete one course */
  remove: async (id: string) => {
    const { data } = await api.delete(`/courses/delete-one/${id}`);
    return data as { message: string; courseId?: string };
  },
};
