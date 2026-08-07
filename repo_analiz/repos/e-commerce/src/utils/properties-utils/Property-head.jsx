import { FormControl, InputLabel, MenuItem, Select, TextareaAutosize } from '@mui/material'
import Input from '@mui/material/Input'
import TextField from '@mui/material/TextField'
import { useEffect, useState } from 'react'
import { PropertyStore, SaleTypes } from '../../store/Property-store'
import { categoryStore } from '../../store/Category.store'
import { apiStore } from '../../service/api'
import { useLocation } from 'react-router-dom'

function PropertyHead() {
    const [category, setCategory] = useState("")
    const { categories, setCategories } = categoryStore()

    const { propertyData, setPropertyData, resetPropertyData } = PropertyStore()

    useEffect(() => {
        const ct = categories.find(el => el.name === category)
        if (ct && ct.id) {
            setPropertyData("categoryId",ct.id)
        }
    }, [category])

    const { api } = apiStore()
    const url = useLocation()

    useEffect(() => {
        api.get("/categories/get-all").then(res => {
            const result = res.data
            setCategories(result.categories)
        })
    }, [url.pathname])

    return (
        <div className='container mx-auto flex flex-col gap-y-5 py-5 px-1.5 rounded-[5px] shadow-2xl mt-6'>
            <div className='grid grid-cols-2 w-full gap-x-10'>
                <TextField label="title" fullWidth value={propertyData.title} onChange={(e) => setPropertyData("title", e.target.value)}></TextField>
                <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                        aria-placeholder='Enter Value'
                        label="Category"
                        autoWidth={true}
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select">
                        {
                            categories.map((el, index) => (
                                <MenuItem value={el.name} key={"type-sale" + index}>{el.name}</MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>

            </div>
            <div>
                <TextareaAutosize
                    minRows={3}
                    aria-label='Description'
                    placeholder="Description..."
                    value={propertyData.description}
                    onChange={(e) => setPropertyData("description", e.target.value)}
                    style={{
                        width: '100%',
                        fontSize: '16px',
                        padding: '16.5px 14px',
                        borderRadius: '4px',
                        border: '1px solid #c4c4c4',
                        fontFamily: 'Roboto, sans-serif',
                        lineHeight: '1.4375em',
                        maxHeight: "70px"
                    }}
                />

            </div>
        </div>
    )
}

export default PropertyHead