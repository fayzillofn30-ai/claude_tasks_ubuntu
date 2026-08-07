import { create } from "zustand";

export const SaleTypes = ["SALE", "RENT"]

export const featuresStore = create((set) => {
    return {
        featuresData: {},
        setFeaturesData: (field, value) => set(state => (
            {
                featuresData: {
                    ...state.featuresData,
                    [field]: value
                }
            }
        )),
        resetFeatures: () => set({}),
    }
})
export const propertyMediaStore = create((set) => {
    const propertyMediaData = {
        features: [],
        gallery: [],
        attachments: [],
        propertyId : ""
    },
    setPropertyMedia  = (field,value) => set(prev => {
        return {
            propertyMediaData : {
                ...prev.propertyMediaData,
                [field] : value
            }
        }
    })
    return { propertyMediaData,setPropertyMedia}
})
export const additionalStore = create((set) => {
    return {
        additionalData: {
            rooms : "",
            propertyId: "",
            label: "",
            material: "",
            beds: "",
            baths: "",
            garages: "",
            garageSize: "",
            year_build: 2025,
            homeArea: 1200,
            lotDimensions: "",
            lotArea: "",
            buildTypeId: ""
        },
        setAdditionalData: (field, value) => set(state => (
            {
                additionalData: {
                    ...state.additionalData,
                    [field]: value
                }
            }
        )),
        resetAdditionalData: () => set({
            additionalData: {
                rooms : "",
                propertyId: "",
                label: "",
                material: "",
                beds: "",
                baths: "",
                garages: "",
                garageSize: "",
                year_build: 2025,
                homeArea: 1200,
                lotDimensions: "",
                lotArea: "",
                buildTypeId: ""
            }
        })
    }
})

export const PropertyStore = create((set) => {
    return {
        propertyData: {
            title: "",
            description: "",
            price: "",
            discount: "",
            locationUrl: "",
            address: "",
            status: SaleTypes[0],
            isSale: true,
            categoryId: "",
            ownerId: "",
        },
        setPropertyData: (field, value) => set(state => ({
            propertyData: {
                ...state.propertyData,
                [field]: value
            }
        })),
        resetPropertyData: () => set({
            propertyData: {
                title: "",
                description: "",
                price: "",
                discount: "",
                locationUrl: "",
                address: "",
                status: SaleTypes[0],
                isSale: true,
                categoryId: "",
                ownerId: "",
            }
        })
    }
})