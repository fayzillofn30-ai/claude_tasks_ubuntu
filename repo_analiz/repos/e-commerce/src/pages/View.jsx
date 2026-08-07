
import React, { useEffect, useState } from 'react'
import CustomCardComponenta from '../utils/home-utils/card-createre';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { isLoadingStore } from '../store/isLoading-store';
import { apiStore } from '../service/api';
import { userDataStore } from '../store/User-store';

function View({ propertyViewId, setView }) {

    console.log(propertyViewId)
    const navigate = useNavigate()
    if(!propertyViewId) {
        navigate("/")
    }
    const [data, setData] = useState([]);

    const { userData } = userDataStore()

    const { isLoadingModal, setIsLoadingModal } = isLoadingStore();
    const { api } = apiStore()
    useEffect(() => {
        setIsLoadingModal(true);
        api.get(`/properties/get-one/id=${propertyViewId}`)
            .then(res => {
                setData(res.data.data);
            })
            .catch(err => {
                console.error("Xatolik yuz berdi:", err);
            })
            .finally(() => setIsLoadingModal(false));
    }, []);

    if (isLoadingModal) {
        return <div>Loading...</div>;
    }

    useEffect(() => console.log(data),[data])

    return (
        <main className='w-full p-4 max-h-full overflow-y-scroll'>
            <div className="container mx-auto flex justify-between py-6">
                <Button variant='contained'>
                    <NavLink to="/add-property">New Property</NavLink>
                </Button>
            </div>
            <div className="container mx-auto flex">
                <div></div>
                <div className='grid grid-cols-2 grid-rows-2'>
                </div>
            </div>
        </main>
    )
}

export default View