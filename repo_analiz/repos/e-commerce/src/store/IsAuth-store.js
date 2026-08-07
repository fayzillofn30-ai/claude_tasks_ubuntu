import { create } from "zustand";


export const isAuthStore = create((set) => {
    return {
        isAuth : !!localStorage.getItem("accessToken"),
        setIsAuth : (isAuth) => set({isAuth})
    }
})

export const accessTokenStore = create((set) => {
    return {
        accessToken : localStorage.getItem("accessToken") ,
        getAccessToken : () => localStorage.getItem("accessToken"),
        setAccessToken : (accessToken) => {
            if(typeof accessToken === "string"){
                localStorage.setItem("accessToken",accessToken)
                set({accessToken})
            }else{
                localStorage.removeItem("accessToken")
            }
        }
    }
})

export const refreshTokenStore = create((set) => {
    return {
        refreshToken : localStorage.getItem("refreshToken") ,
        getRefreshToken : () => localStorage.getItem("refreshToken"),
        setRefreshToken : (refreshToken) => {
            if(typeof refreshToken === "string"){
                localStorage.setItem("refreshToken",refreshToken)
                set({refreshToken})
            }else{
                localStorage.removeItem("refreshToken")
            }
        }
    }
})

export const isRegisterStore = create((set) => {
    return {
        isRegister : false,
        setIsRegister : (isRegister) => set({isRegister})
    }
})

