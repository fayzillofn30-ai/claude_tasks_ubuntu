import { FormControl, InputLabel, MenuItem, Select, TextField, Button } from "@mui/material"
import PropertyHead from "../utils/properties-utils/Property-head"
import { Additionals } from "../utils/properties-utils/Property-Additionals"
import MapComponent from "../utils/properties-utils/Property-Map"
import MediaComponent from "../utils/properties-utils/Property-Media"
import Amenities from "../utils/properties-utils/Property-Features"
import { additionalStore, featuresStore, propertyMediaStore, PropertyStore } from "../store/Property-store"
import { useEffect, useState } from "react"
import { ApiStore, VITE_BASE_URL } from "../store/Api.store"
import axios from "axios"
import { userDataStore } from "../store/User-store"


function PropertiyAdd() {

    const { additionalData, setAdditionalData, resetAdditionalData } = additionalStore()
    const { propertyData, setPropertyData, resetPropertyData } = PropertyStore()
    const { featuresData, setFeaturesData, resetFeatures } = featuresStore()
    const { userData, setUserData } = userDataStore()
    const { propertyMediaData, setPropertyMedia } = propertyMediaStore()

    const { api } = ApiStore()
    const createProperty = async () => {
        console.log("Create Function")
        setPropertyData("locationUrl", `https://www.google.com/maps?q=${41.2995},${69.2401}`)
        setPropertyData("features", featuresData)
        setPropertyData("ownerId", userData.id)

        let { title, address, description, price, discount, locationUrl, status, isSale, categoryId, ownerId } = propertyData
        let { label, material, beds, baths, garages, garageSize, year_build, homeArea, lotDimensions, lotArea, rooms, buildTypeId } = additionalData

        try {
            const propertyCreateRequest = await api.post("/properties/create", {
                title: title,
                address: address,
                description: description,
                price: parseInt(price),
                discount: parseFloat(discount),
                locationUrl: locationUrl,
                features: featuresData,
                status: status,
                isSale: isSale,
                categoryId: parseInt(categoryId)
            })

            const propertyId = propertyCreateRequest.data.id
            const buildTypeId = "53802dde-969e-439e-ae6c-c0605288abf6"
            setAdditionalData("propertyId", propertyId)
            setAdditionalData("buildTypeId", buildTypeId)

            const additionalsRequest = await api.post("/additional", {
                propertyId: propertyId, label: label, material: material,
                beds: parseInt(beds),
                rooms: parseInt(rooms) || 10,
                baths: parseInt(baths) || 1,
                garages: parseInt(garages),
                garageSize: parseInt(garageSize) || 1000,
                year_build: parseInt(year_build),
                homeArea: parseInt(homeArea),
                lotDimensions: lotDimensions,
                lotArea: parseInt(lotArea),
                buildTypeId: buildTypeId
            })
            console.log(additionalsRequest.data)
            const propertyMediaFormData = new FormData()

            if (Array.isArray(propertyMediaData.features)) {
                propertyMediaData.features.forEach(file => {
                    propertyMediaFormData.append("features", file)
                })
            } else if (propertyMediaData.features) {
                propertyMediaFormData.append("features", propertyMediaData.features)
            }

            if (Array.isArray(propertyMediaData.gallery)) {
                propertyMediaData.gallery.forEach(file => {
                    propertyMediaFormData.append("gallery", file)
                })
            } else if (propertyMediaData.gallery) {
                propertyMediaFormData.append("gallery", propertyMediaData.gallery)
            }

            if (Array.isArray(propertyMediaData.attachments)) {
                propertyMediaData.attachments.forEach(file => {
                    propertyMediaFormData.append("attachments", file)
                })
            } else if (propertyMediaData.attachments) {
                propertyMediaFormData.append("attachments", propertyMediaData.attachments)
            }

            propertyMediaFormData.append("propertyId", propertyId)



            const propertyMediaRequest = await api.post("/property-media/create", propertyMediaFormData, {
                headers: { "Content-Type": "multipart/form-data" }
            })

        } catch (error) {
            console.log(error)
        }

    }

    return (
        <main className="flex flex-col gap-y-9">
            <PropertyHead />
            <Additionals />
            <MapComponent />
            <MediaComponent />
            <Amenities />
            <section>
                <div className="container mx-auto flex justify-end my-10">
                    <Button variant="contained" sx={{ marginBottom: 2 }} onClick={() => createProperty()}>Submit</Button>
                </div>
            </section>
        </main>
    )
}

export default PropertiyAdd