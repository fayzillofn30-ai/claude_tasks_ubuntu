import { Courses, Groupes, Lessons, Rooms, Staffs, Users } from "@/features";
import { create } from "zustand";
import type { Room, Group, Lesson, Staff, Course, User } from "@/types"; // o'z joyiga moslab import qiling

// Tiplar
export type LeftTargetType = "teachers" | "groupes" | "courses" | "statistika" | "students" | "lids";

// useModalStore uchun tip va implementatsiya
interface ModalState {
    isOpen: boolean;
    target: LeftTargetType | null;
    openModal: (target: LeftTargetType) => void;
    closeModal: () => void;
}

// TargetFolderStore uchun tip va implementatsiya
interface TargetFolderState {
    currentFolder: LeftTargetType | null;
    setFolder: (folder: LeftTargetType) => void;
    clearFolder: () => void;
}

export const TargetFolderStore = create<TargetFolderState>((set) => ({
    currentFolder: null,
    setFolder: (folder) => set({ currentFolder: folder }),
    clearFolder: () => set({ currentFolder: null }),
}));

// useSelectedStore uchun tip va implementatsiya

interface SelectedState {
  selectedTeacherId: string | null;
  selectedCourseId: string | null;
  selectedGroupId: string | null;
  selectedLessonId: string | null;
  selectedStudentId: string | null;
  selectedIds: string[];

  // Selection actions
  select: (id: string) => void;
  deselect: (id: string) => void;
  clearSelection: () => void;

  // Setters
  setTeacherId: (id: string | null) => void;
  setCourseId: (id: string | null) => void;
  setGroupId: (id: string | null) => void;
  setLessonId: (id: string | null) => void;
  setStudentId: (id: string | null) => void;

  // Reset all
  resetAll: () => void;
}

export const useSelectedStore = create<SelectedState>((set) => ({
  selectedTeacherId: null,
  selectedCourseId: null,
  selectedGroupId: null,
  selectedLessonId: null,
  selectedStudentId: null,
  selectedIds: [],

  // Davomat uchun tanlash
  select: (id) =>
    set((state) => ({
      selectedIds: state.selectedIds.includes(id)
        ? state.selectedIds
        : [...state.selectedIds, id],
    })),

  deselect: (id) =>
    set((state) => ({
      selectedIds: state.selectedIds.filter((item) => item !== id),
    })),

  clearSelection: () => set({ selectedIds: [] }),

  // Individual setters
  setTeacherId: (id) => set({ selectedTeacherId: id }),
  setCourseId: (id) => set({ selectedCourseId: id }),
  setGroupId: (id) => set({ selectedGroupId: id }),
  setLessonId: (id) => set({ selectedLessonId: id }),
  setStudentId: (id) => set({ selectedStudentId: id }),

  // Reset all
  resetAll: () =>
    set({
      selectedTeacherId: null,
      selectedCourseId: null,
      selectedGroupId: null,
      selectedLessonId: null,
      selectedStudentId: null,
      selectedIds: [],
    }),
}));


// Har bir entity uchun tiplarni aniqlang (agar kerak bo‘lsa, bu `features` dan import qilinadi)
// yoki @/features ichidan

// Ehtimol sizda bu tiplar kerak bo‘ladi


interface AllFetchedDataState {
  rooms: Room[]
  courses: Course[]
  groupes: Group[]
  users: User[]
  students: Staff[]
  teachers: Staff[]
  lessons: Lesson[]

  loading: boolean
  error: string | null

  // === Actions ===
  fetchAll: () => Promise<void>

  // === Individual setters ===
  setRooms: (rooms: Room[]) => void
  setCourses: (courses: Course[]) => void
  setGroupes: (groupes: Group[]) => void
  setUsers: (users: User[]) => void
  setStudents: (students: Staff[]) => void
  setTeachers: (teachers: Staff[]) => void
  setLessons: (lessons: Lesson[]) => void
}

export const useAllFetchedData = create<AllFetchedDataState>((set) => ({
  rooms: [],
  courses: [],
  groupes: [],
  users: [],
  students: [],
  teachers: [],
  lessons: [],
  loading: false,
  error: null,

  // === FETCH ALL DATA ===
  fetchAll: async () => {
    set({ loading: true, error: null })

    try {
      const [
        rooms,
        courses,
        groupes,
        users,
        students,
        teachers,
        lessons,
      ] = await Promise.all([
        Rooms.getAllRooms(),
        Courses.coursesApi.getAll(),
        Groupes.getAllGroupes(),
        Users.usersApi.getAll(),
        Staffs.getAllStudents(),
        Staffs.getAllTeachers(),
        Lessons.getAllLessons(),
      ])

      set({
        rooms,
        courses,
        groupes,
        users,
        students,
        teachers,
        lessons,
        loading: false,
        error: null,
      })
    } catch (err: any) {
      console.error("Error fetching data:", err)
      set({
        loading: false,
        error: err?.message || "Ma’lumotlarni yuklashda xatolik yuz berdi",
      })
    }
  },

  // === SETTERS ===
  setRooms: (rooms) => set({ rooms }),
  setCourses: (courses) => set({ courses }),
  setGroupes: (groupes) => set({ groupes }),
  setUsers: (users) => set({ users }),
  setStudents: (students) => set({ students }),
  setTeachers: (teachers) => set({ teachers }),
  setLessons: (lessons) => set({ lessons }),
}))


