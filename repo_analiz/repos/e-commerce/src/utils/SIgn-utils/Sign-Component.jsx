import React, { useState } from 'react'
import FieldBox from './Field';
import { userDataStore } from '../../store/User-store';
import { Button } from '@mui/material';
import { apiStore } from '../../service/api';
import { useNavigate } from 'react-router-dom';
import { isLoadingStore } from '../../store/isLoading-store';

function RegisterComponent() {

    const allowedFields = ["firstName", "lastName", "email", "password", "repeatPassword", "phone",];
    const { userData, setUserData } = userDataStore()
    const { isLoadingModal, setIsLoadingModal } = isLoadingStore();
    const { api } = apiStore()
    const navigate = useNavigate()

    const setValue = (field, value) => {
        const key = value
        return setUserData(field, value)
    }

    const handLeSubmit = async () => {
        const { firstName, lastName, email, password, phone } = userData

        if (firstName.trim().legth === 0 || lastName.trim().legth === 0 || email.trim().legth === 0 || password.trim().legth === 0 || phone.trim().legth === 0) {
            alert("Iltimos, barcha maydonlarni to'ldiring")
            return
        }
        const phoneRegex = /^998\d{9}$/
        if(!phoneRegex.test(phone)){
            alert("Invalid Phone format ")
            return
        }
        const fullName = `${firstName} ${lastName}`

        try {
            setIsLoadingModal(true)
            const response = await api.post("/auth/register", {
                fullName,
                email,
                password,
                // phone,
            })

            if (response.status === 201) {
                alert(response.data.message || "Ro'yxatdan o'tish muvaffaqiyatli")
            }
            if(response.data.data.code){
                console.log(response)
                navigate("/otp")
            }
        } catch (error) {
            if (error.response?.status === 400) {
                alert(error.response.data.message || "Xato: noto‘g‘ri ma’lumotlar")
            } else {
                alert("Server bilan bog‘lanishda xatolik yuz berdi")
            }
        }finally{
            setIsLoadingModal(false)
        }
    }

    return (
        <div className='w-[600px] h-[600px] flex flex-col justify-center items-center'>
            <h1 className='text-4xl'>Sign Up</h1>
            {
                allowedFields.map((el, index) => (
                    <FieldBox field={el} value={userData[el]} setValue={setValue} key={index} />
                ))
            }
            <Button onClick={() => handLeSubmit()} className='bg-green-400'> Submit </Button>
        </div>
    )
}

export default RegisterComponent