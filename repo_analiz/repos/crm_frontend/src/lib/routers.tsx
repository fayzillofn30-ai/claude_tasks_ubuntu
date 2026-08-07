import { create } from "zustand";

type PaginationState = {
  currentPage: number;
  totalPages: number;
  setPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  setTotalPages: (total: number) => void;
};

export const paginationStore = create<PaginationState>((set) => ({
  currentPage: 1,
  totalPages: 1,

  setPage: (page) => set({ currentPage: page }),
  nextPage: () =>
    set((state) => ({
      currentPage:
        state.currentPage < state.totalPages
          ? state.currentPage + 1
          : state.currentPage,
    })),
  prevPage: () =>
    set((state) => ({
      currentPage:
        state.currentPage > 1 ? state.currentPage - 1 : state.currentPage,
    })),
  setTotalPages: (total) => set({ totalPages: total }),
}));
