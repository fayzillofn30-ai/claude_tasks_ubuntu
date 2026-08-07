import { create } from "zustand";


export const lastPageStore = create((set) => {
    return {
        lastPage : "/",
        setLastPage : (lastPage) => set({lastPage})
    }
})

