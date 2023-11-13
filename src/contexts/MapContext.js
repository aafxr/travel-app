import React, {useEffect, useState} from "react";
import PageContainer from "../components/Loading/PageContainer";
import Loader from "../components/Loader/Loader";

export default function MapContext({children}) {
    const [mapLoading, setMapLoading] = useState(true)

    useEffect(() => {
        if (window.ymaps) {
            window.ymaps.ready(() => setMapLoading(false))
        }
    }, [])

    if (mapLoading) {
        return (
            <PageContainer center>
                <Loader className='loader'/>
            </PageContainer>
        )
    } else {
        return children
    }
}