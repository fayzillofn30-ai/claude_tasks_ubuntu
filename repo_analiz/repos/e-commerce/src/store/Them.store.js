import { create } from "zustand"

export const isDarkStore = create((set) => {
    return {
        isDark : false,
        setIsDark : (isDark) => set({isDark})
    }
})