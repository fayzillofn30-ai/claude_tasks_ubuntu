import { create } from "zustand";

export const isLoadingStore = create((set) => {
    return {
        isLoadingModal : false,
        setIsLoadingModal : (isLoadingModal) => set({isLoadingModal})
    }
})