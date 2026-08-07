import { create } from "zustand";

export const emailStore = create((set) => {
    return {
        email: "",
        setEmail: (email) => set({ email })
    }
})

export const otpStore = create((set) => {
    return {
        otp : "",
        setOtp : otp => set({otp})
    }
})

export const userDataStore = create((set) => ({
    userData: {
        id: "",
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        repeatPassword: "",
        phone: "",
        avatar: "" 
    },
    setUserData: (field, value) => set(state => ({
        userData: {
            ...state.userData,
            [field]: value
        }
    })),
    resetUserData: () => set({
        userData: {
            id: "",
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            repeatPassword: "",
            phone: "",
            avatar: ""
        }
    })
}));

