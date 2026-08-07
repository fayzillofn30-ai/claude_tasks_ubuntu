import React from 'react'
import { isRegisterStore } from '../store/IsAuth-store'
import RegisterComponent from '../utils/SIgn-utils/Sign-Component'
import LoginComponenta from '../utils/SIgn-utils/Login-Componenta'
import { Link } from 'react-router-dom'
import { Button } from '@mui/material'
import { Home } from '@mui/icons-material'

function Sign() {

    const { isRegister, setIsRegister } = isRegisterStore()

    return (
        <main className='w-full min-h-screen h-[85%] flex justify-center items-center'>

            <section className='flex flex-col items-center shadow-2xl p-4 rounded-2xl'>
                {
                    isRegister ? <RegisterComponent /> : <LoginComponenta />
                }
                <div className="flex items-">
                    <h3 className='text-[18px]'>
                        {
                            !isRegister ? "I am not already accaunt " : "I am already exists accaun "
                        }
                        <Button onClick={() => setIsRegister(!isRegister)}>
                            {
                                isRegister ? "login" : "register"
                            }
                        </Button>
                    </h3>
                    <Button>
                        <Link to="/" className='flex items-center'> Home</Link>
                    </Button>
                </div>
            </section>

        </main>
    )
}

export default Sign