"use client"

import { useVerificationUrlStore } from '@/store/api.store'
import { Button, CircularProgress, TextField } from '@mui/material'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { emailStore } from '@/store/user.store'
import {Auth} from "@/features"
function Sign() {

    const { email, setEmail } = emailStore()
    const { verificationUrl, setVerifyUrl } = useVerificationUrlStore()
    const router = useRouter()
    const [isLoad,setIslOad] = useState<boolean>(false)

    const handleSubmit = () => {
        if(!email) return
        setIslOad(true)
        Auth.sendOtp({email : email }).then(result => {
            if (result.sessionToken) {
                localStorage.setItem("sessionToken", result.sessionToken)
            } else {
                localStorage.removeItem("sessionToken")
            }
            const { verificationUrl } = result
            setVerifyUrl(verificationUrl)
            router.push("/otp")
        }).catch(error => {
            console.log(error)
            alert(error.message || "Kutilmagan xatolik !")
        }).finally(() => {
            setIslOad(false)
        })
    }

    if(isLoad){

    }
    return (
        <div className='container mx-auto flex flex-col justify-center items-center min-h-screen' >
            <div className='w-[400px] space-y-5 flex flex-col items-center shadow-2xl p-6'>
                <h1 className='text-2xl font-extrabold'>Sign</h1>
                <div className='w-full'>
                    <TextField
                        label="Email"
                        name="email"
                        placeholder='Enter your email ...'
                        fullWidth
                        key={"email"}
                        value={email}
                        onChange={(e) => {
                            !isLoad ? setEmail(e.target.value) : console.log(e.target.value)
                        }}
                        type='email'
                    >
                    </TextField>
                </div>
                <Button variant='contained' fullWidth onClick={() => handleSubmit()} disabled={isLoad}>Submit</Button>
            </div>
            <div className={ isLoad ?  "inset-0 bg-[rgba(1,1,1,0.5)] absolute flex justify-center items-center" : "hidden"}>
                <CircularProgress size={500}></CircularProgress>
            </div>
        </div>
    )
}

export default Sign