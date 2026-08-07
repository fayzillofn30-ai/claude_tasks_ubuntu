import React from 'react'
import FieldBox from './Field'
import { userDataStore } from '../../store/User-store'
import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { apiStore } from '../../service/api'
import { isLoadingStore } from '../../store/isLoading-store'
import { accessTokenStore, isAuthStore, refreshTokenStore } from '../../store/IsAuth-store'

function LoginComponenta() {

    const fields = ["email", "password"]
    const { userData, setUserData } = userDataStore()
    const { isLoadingModal, setIsLoadingModal } = isLoadingStore();
    const { setAccessToken } = accessTokenStore()
    const { setRefreshToken } = refreshTokenStore()
    const {setIsAuth} = isAuthStore()
    const { api } = apiStore()

    const navigate = useNavigate()

    const setValue = (field, value) => {
        const key = value
        return setUserData(field, value)
    }

    const handLeSubmit = async () => {
        console.log(userData)
        const { email, password } = userData
        setIsLoadingModal(true)

        try {
            const { data } = await api.post("/auth/login", { email, password })
            console.log(data)
            const {accessToken,refreshToken ,user} = data
            Object.keys(user).forEach(field => setUserData(field,user[field]))
            setAccessToken(accessToken)
            setRefreshToken(refreshToken)
            setIsAuth(true)
            navigate("/")
        } catch (error) {
            console.log(error)
            const {data} = error.response
            alert(data.message || error.message || "Sign in filed !")
        }
        finally {

            setIsLoadingModal(false)
        }
    }

    const handleKeyDown = (e, field) => {
        const key = e.key
        if ("0123456789qwertyuiopasdfghjklzxcvbnm@._".includes(key)) {
            if (field === "phone") {
                if (
                    !/[0-9]/.test(key)
                ) {
                    e.preventDefault();
                    alert("Faqat raqam kiritish mumkin!");
                }
            }
        }
    }
    return (
        <div className='w-[600px] h-[600px] flex flex-col items-center'>
            <h1 className='text-4xl'>Sign In</h1>
            {
                fields.map((el, index) => <><FieldBox field={el} setValue={setValue} value={userData[el]} validation={handleKeyDown} key={index} /></>)
            }
            <Button onClick={() => handLeSubmit()}>Submit</Button>
        </div>
    )
}

export default LoginComponenta