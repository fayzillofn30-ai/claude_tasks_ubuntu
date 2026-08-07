import React, { useEffect, useState } from 'react'
import { apiStore } from '../service/api';
import { isLoadingStore } from '../store/isLoading-store';
import { userDataStore } from '../store/User-store';
import CustomCardComponenta from '../utils/home-utils/card-createre';
import { NavLink } from 'react-router-dom';
import { Button } from '@mui/material';
import { sendFavorite } from '../utils/user-utils/FavoriteApi';

function Properties({propertyViewId,setView}) {
    const [data, setData] = useState([]);

    const { userData } = userDataStore()

    const { isLoadingModal, setIsLoadingModal } = isLoadingStore();
    const { api } = apiStore()
    useEffect(() => {
        setIsLoadingModal(true);
        api.get("/properties/get-all/my-properties")
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

    const query = "ownerId="

    return (
        <main className='w-full p-4 max-h-full overflow-y-scroll'>
            <div className="container mx-auto flex justify-between py-6">
                <Button variant='contained'>
                    <NavLink to="/add-property">New Property</NavLink>
                </Button>
            </div>
            <div className='container mx-auto rotate-180 grid grid-cols-3 relative shadow-2xl max-md:grid-cols-1'>
                {
                    data.map(property => {
                        const { additionals, owner, PropertyMedia, ownerId } = property
                        const { baths, beds, buildTypeId, garages: garage, garageSize, homeArea, lotArea: squareFoot, rooms, year_build, label, lotDimensions } = additionals[0]
                        const { features, gallery, attachments } = PropertyMedia[0]
                        const { locationUrl, title: name, isSale, status, price, discount, address, description, id } = property
                        const { avatar, fullName, email, role } = owner
                        return <div className='w-[450px] h-max my-10 mx-8 relative rotate-180' key={id}>
                            <CustomCardComponenta data={{ id: id, owner: owner, name : name, address : address, img: gallery[0], garage, beds, baths, squareFoot, price, discount, isSale, status, marginLeft: 0, setFavorite: sendFavorite ,setView :setView}} />
                        </div>
                    })
                }
            </div>
        </main>
    )
}

export default Properties