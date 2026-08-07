import React, { useEffect, useState } from 'react';
import { Box, Checkbox, FormControlLabel, Grid, Typography } from '@mui/material';
import { featuresStore } from '../../store/Property-store';

const amenitiesList = [
    'Air conditioning', 'Lawn', 'Dining Room', 'Waterfront',
    'Barbeque', 'Microwave', 'Fireplace', 'Parking',
    'Dryer', 'Outdoor Shower', 'Pets Allowed', 'Doorman',
    'Gym', 'Refrigerator', 'Unit Washer/Dryer', 'Central Heating',
    'Laundry', 'Stunning views', 'Onsite Parking', 'Cleaning Service'
];

const Amenities = () => {
    const [checkedAmenities, setCheckedAmenities] = useState([]);
    const { featuresData, setFeaturesData, resetFeatures } = featuresStore()

    useEffect(() => {
        amenitiesList.forEach(amenity => {
            setFeaturesData(amenity.toLowerCase().replaceAll(" ", "_"), false)
        })
    }, [])

    useEffect(() => {
        amenitiesList.forEach(amenity => {
            setFeaturesData(amenity.toLowerCase().replaceAll(" ", "_"),checkedAmenities.includes(amenity.toLowerCase().replaceAll(" ", "_")) )
        })
    }, [checkedAmenities])

    const handleChange = (event) => {

        const value = event.target.name.toLowerCase().replaceAll(" ", "_");
        setCheckedAmenities((prev) =>
            prev.includes(value)
                ? prev.filter((item) => item !== value)
                : [...prev, value]
        );
    };

    return (
        <section className='w-full'>
            <div className='container mx-auto shadow-2xl p-6'>
                <Typography variant="h6" gutterBottom>
                    Amenities
                </Typography>
                <div className='w-full grid grid-cols-4 border-2 max-xl:grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1 pl-4'>
                    {amenitiesList.map((amenity) => (
                        <Grid key={amenity} container fontSize={50}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={checkedAmenities.includes(amenity.toLowerCase().replaceAll(" ", "_"))}
                                        onChange={(e) => handleChange(e)}
                                        name={amenity}
                                        color="primary"
                                    />
                                }
                                label={amenity}

                            />
                        </Grid>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Amenities;
