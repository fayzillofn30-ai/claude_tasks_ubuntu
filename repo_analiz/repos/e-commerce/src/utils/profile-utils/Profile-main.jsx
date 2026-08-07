import React, { useEffect, useState } from "react"
import {
    TextField,
    Button,
} from "@mui/material"
import { DarkMode, LightMode } from "@mui/icons-material"
import { userDataStore } from "../../store/User-store"
import { isDarkStore } from "../../store/Them.store"
import hero_img from "../../assets/img/hero_img.png"
import { ApiStore } from "../../store/Api.store"

function ProfileMain() {
    const { userData, setUserData } = userDataStore()
    let { id, firstName, lastName, email, avatar } = userData
    const { isDark, setIsDark } = isDarkStore()
    const { api } = ApiStore()

    const [updatedAvatar, setAvatar] = useState(null)
    const [newFirstName, setFirstName] = useState(firstName || "")
    const [newLastName, setLastName] = useState(lastName || "")
    const [newEmail, setEmail] = useState(email || "")
    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")

    useEffect(() => {
        if (userData) {
            setFirstName(firstName || "")
            setLastName(lastName || "")
            setEmail(email || "")
        }
    }, [userData])

    const handleSubmit = async () => {
        try {
            let updatedUser = null

            // Avatar update
            if (updatedAvatar) {
                const formData = new FormData()
                formData.append("image", updatedAvatar)
                const res = await api.patch(`/users/updateimange/${id}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                })
                updatedUser = res.data?.updatedUser || res.data
            }

            // Password update
            if (newPassword && newPassword.trim().length > 0 && oldPassword.trim() !== newPassword.trim()) {
                await api.post(`/auth/change-password`, {
                    oldPassword: oldPassword.trim(),
                    newPassword: newPassword.trim(),
                })
            }

            // Basic info update
            const body = {}
            if (newEmail.trim() && newEmail.trim() !== email) {
                body.email = newEmail.trim()
            }
            if (newFirstName.trim() !== firstName || newLastName.trim() !== lastName) {
                body.fullName = newFirstName.trim() + " " + newLastName.trim()
            }

            if (Object.keys(body).length > 0) {
                const res = await api.patch(`/users/${id}`, body)
                updatedUser = res.data?.updatedUser || res.data
            }

            // 🔥 Agar biror narsa yangilansa
            if (updatedUser) {
                // store yangilash
                Object.entries(updatedUser).forEach(([key, value]) => setUserData(key, value))

                // local state yangilash
                setFirstName(updatedUser.firstName || "")
                setLastName(updatedUser.lastName || "")
                setEmail(updatedUser.email || "")
                setAvatar(updatedUser.avatar || null)
            }
        } catch (error) {
            console.error("Update error:", error)
        }
    }


    return (
        <div className="w-full flex flex-col">
            <div className="h-[100px] flex items-center justify-between px-10 w-[95%] mt-6 mx-auto bg-[rgba(107,67,158,0.8)] max-md:px-6">
                <div className="flex items-end space-x-10">
                    <img src={avatar} className="w-[50px] h-[50px] rounded-2xl" alt="" />
                    <h1 className="text-[25px]">{firstName + " " + lastName}</h1>
                </div>
                <Button onClick={() => setIsDark(!isDark)}>
                    {!isDark ? <DarkMode className="!size-[70px]" /> : <LightMode className="!size-[70px]" />}
                </Button>
            </div>

            <div className={`w-[95%] mx-auto flex max-md:flex-col-reverse max-md:h-max ${isDark ? "bg-[rgba(28,24,43,0.92)]" : "bg-[rgba(69,40,197,0.5)]"}`}>
                <div className={`flex w-full flex-col shadow-2xl p-10 ${isDark ? "bg-[rgba(24,29,27,0.92)]" : "bg-[rgba(121,192,165,0.5)]"}`}>
                    <div className="flex items-center gap-3 mb-4">
                        <img src={avatar} className="w-12 h-12 rounded-full object-cover border" alt="avatar" />
                        <label className="cursor-pointer bg-blue-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-blue-600 transition">
                            Upload
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files[0]
                                    if (file) setAvatar(file)
                                }}
                            />
                        </label>
                    </div>

                    <TextField
                        margin="normal"
                        fullWidth
                        label="First Name"
                        value={newFirstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        label="Last Name"
                        value={newLastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        label="Email"
                        value={newEmail}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        label="Old Password"
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        label="New Password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />

                    <Button variant="contained" onClick={handleSubmit} className="mt-4">
                        Update
                    </Button>
                </div>

                <div
                    className={`w-full bg-cover bg-center ${isDark ? "bg-[rgba(167,77,36,0.92)]" : "bg-[rgba(40,197,61,0.5)]"}`}
                    style={{
                        backgroundImage: `url(${hero_img})`,
                        backgroundRepeat: "no-repeat",
                    }}
                ></div>
            </div>
        </div>
    )
}

export default ProfileMain
