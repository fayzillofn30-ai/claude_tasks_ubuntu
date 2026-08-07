"use client"

import { useAllFetchedData } from '@/lib/ui.state';
import React, { useEffect } from 'react'

function Providers({ children }: { children: React.ReactNode }) {
    
    const { fetchAll, error, loading, ...allData } = useAllFetchedData()

    const getTests = async () => {
        try {
            await fetchAll()

        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (error || loading) {
            console.log(error)
        } else {
            console.log(allData)
        }
    }, [allData])

    useEffect(() => {
        getTests();
    }, []);
    
    return (

        <div>
            {
                children
            }
        </div>
    )
}

export default Providers