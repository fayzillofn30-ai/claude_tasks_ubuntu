import React, { useState } from "react"
import { Button, setRef, TextField, Typography } from "@mui/material"
import { Link, useNavigate } from "react-router-dom"
import { apiStore } from "../service/api"
import { userDataStore } from "../store/User-store"
import { accessTokenStore, isAuthStore, refreshTokenStore } from "../store/IsAuth-store"

function Otp() {
    const [otp, setOtp] = useState("")
    const [error, setError] = useState("")
    const { api } = apiStore()
    const { userData ,setUserData} = userDataStore()
    const {setAccessToken} = accessTokenStore()
    const {setRefreshToken } = refreshTokenStore()
    const {setIsAuth} = isAuthStore()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")

        if (otp.length !== 6) {
            setError("Iltimos, 6 xonali OTP kodini kiriting")
            return
        }

        try {
            const response = await api.post("/auth/verify-register", {
                email: userData.email,
                code: +(otp.trim())
            })

            if (response.status === 201) {
                alert(response.data.message || "Tasdiqlandi!")
                setAccessToken(response.data.accessToken)
                setRefreshToken(response.data.refreshToken)
                Object.keys(response.data.user).forEach(field => setUserData(field,response.data.user[field]))
                setIsAuth(true)
                navigate("/") 
            }
        } catch (err) {
            if (err.response?.status === 400) {
                setError(err.response.data.message || "Noto‘g‘ri OTP kodi")
                setIsAuth(false)
            } else {
                setError("Server bilan bog‘lanishda xatolik yuz berdi")
            }
        }
    }

    return (
        <div style={{ maxWidth: 400, margin: "auto", paddingTop: 50 }}>
            <Typography variant="h5" align="center" gutterBottom>
                OTP tasdiqlash
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="6 xonali OTP"
                    variant="outlined"
                    fullWidth
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    inputProps={{ maxLength: 6 }}
                    margin="normal"
                />
                {error && (
                    <Typography color="error" variant="body2">
                        {error}
                    </Typography>
                )}
                <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
                    Tasdiqlash
                </Button>
                <Button type="button" variant="contained" fullWidth sx={{ mt: 2 }}>
                    <Link to="/sign">Back to register</Link>
                </Button>

            </form>
        </div>
    )
}

export default Otp
