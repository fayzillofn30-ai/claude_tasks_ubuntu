import React, { useEffect, useState } from 'react'
import Slider from 'react-slick'
import { isLoadingStore } from '../../store/isLoading-store'
import { apiStore } from '../../service/api'
import CustomCardComponenta from './card-createre'

import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

function PropertyRender({ url = "/properties/get-all",propertyViewId,setView  }) {
    const [data, setData] = useState([])
    const { isLoadingModal, setIsLoadingModal } = isLoadingStore()
    const { api } = apiStore()

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        centerMode: true,
        centerPadding: "40px",
        responsive: [
            {
                breakpoint: 1280, // laptop
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    centerPadding: "30px",
                },
            },
            {
                breakpoint: 768, // tablet
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    centerPadding: "20px",
                },
            },
            {
                breakpoint: 480, // mobile
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    centerPadding: "100px",
                },
            },
        ],
    }

    useEffect(() => {
        setIsLoadingModal(true)
        api
            .get(url)
            .then((res) => {
                setData(res.data.data)
            })
            .catch((err) => {
                console.error("Xatolik yuz berdi:", err)
            })
            .finally(() => setIsLoadingModal(false))
    }, [url, setIsLoadingModal, api])

    if (isLoadingModal) {
        return <div>Loading...</div>
    }

    return (
        <div className="w-full">
            <Slider {...settings} >
                {data.slice(0, 12).map((property) => {
                    const { additionals, owner, PropertyMedia, id, address, name, price, discount, isSale, status } = property
                    const { baths, beds, garages: garage, lotArea: squareFoot } = additionals[0]
                    const { gallery } = PropertyMedia[0]
                    return (
                        <div key={id} className="px-2">
                            <div className="w-[350px] mx-auto"> {/* max eni qo‘ydik */}
                                <CustomCardComponenta
                                    data={{
                                        id,
                                        propertyViewId:{propertyViewId} ,setView:{setView},
                                        owner,
                                        name,
                                        address,
                                        img: gallery[0],
                                        garage,
                                        beds,
                                        baths,
                                        squareFoot,
                                        price,
                                        discount,
                                        isSale,
                                        status,
                                    }}
                                />
                            </div>
                        </div>

                    )
                })}
            </Slider>
        </div>
    )
}

export default PropertyRender
