import axios from "axios"
import { create } from "zustand"

export const apiStore = create((set) => {
    const api = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
        headers: {
            "Content-Type": "application/json"
        }
    })

    // refresh token uchun alohida axios instance (headers Authorization kerak emas)
    const refreshApi = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
        headers: {
            "Content-Type": "application/json"
        }
    })

    let isRefreshing = false
    let failedQueue = []

    const processQueue = (error, token = null) => {
        failedQueue.forEach(prom => {
            if (error) {
                prom.reject(error)
            } else {
                prom.resolve(token)
            }
        })

        failedQueue = []
    }

    api.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem("accessToken")
            if (token) {
                config.headers["Authorization"] = `Bearer ${token}`
            }
            return config
        },
        (error) => Promise.reject(error)
    )

    api.interceptors.response.use(
        (response) => response,
        (error) => {
            const originalRequest = error.config

            if (error.response?.status === 401 && !originalRequest._retry) {
                if (isRefreshing) {
                    // refresh token jarayonida bo‘lsa, so‘rovlarni navbatga qo‘shamiz
                    return new Promise(function (resolve, reject) {
                        failedQueue.push({ resolve, reject })
                    })
                        .then(token => {
                            originalRequest.headers['Authorization'] = 'Bearer ' + token
                            return api(originalRequest)
                        })
                        .catch(err => {
                            return Promise.reject(err)
                        })
                }

                originalRequest._retry = true
                isRefreshing = true

                const refreshToken = localStorage.getItem("refreshToken")
                if (!refreshToken) {
                    // refreshToken yo‘q bo‘lsa logout qilish mumkin
                    localStorage.removeItem("accessToken")
                    localStorage.removeItem("refreshToken")
                    // Masalan, redirect yoki boshqa logout operatsiyasi
                    window.location = "/sign"
                    return Promise.reject(error)
                }

                return new Promise((resolve, reject) => {
                    refreshApi.get("/auth/reset-token", { headers : { "Authorization" : 'Bearer ' + refreshToken}  })
                        .then(({ data }) => {
                            localStorage.setItem("accessToken", data.accessToken)
                            localStorage.setItem("refreshToken", data.refreshToken)

                            api.defaults.headers.common['Authorization'] = 'Bearer ' + data.accessToken
                            originalRequest.headers['Authorization'] = 'Bearer ' + data.accessToken

                            processQueue(null, data.accessToken)
                            resolve(api(originalRequest))
                        })
                        .catch((err) => {
                            processQueue(err, null)
                            localStorage.removeItem("accessToken")
                            localStorage.removeItem("refreshToken")
                            // logout yoki redirect qilishingiz mumkin
                            window.location = "/sign"
                            reject(err)
                        })
                        .finally(() => {
                            isRefreshing = false
                        })
                })
            }

            return Promise.reject(error)
        }
    )

    return { api }
})
