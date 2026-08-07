// src/features/attendentionals/types.ts
export type AttendentionalFlat = {
  id: string;
  lessonId: string;
  studentId: string;
  kelgan: boolean;
  kelganVaqti?: string | null;
  isDeleted: boolean;
  createdAt?: string;
};
export interface Attendentional {
  id: string
  lessonId: string
  studentId: string
  kelganVaqti?: string | null
  kelgan: boolean
  isDeleted: boolean
}