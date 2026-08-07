import { create } from "zustand";

export const categoryStore = create((set) => {
    return {
        categories : [],
        setCategories : (categories) => set({categories})
    }
})