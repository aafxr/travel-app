import React, {createContext, useEffect, useState} from "react";
import PageContainer from "../components/Loading/PageContainer";
import Loader from "../components/Loader/Loader";
import YMap from "../classes/YMap";


/**
 * @name MapContextType
 * @typedef TravelContextType
 * @property {IMap | null} map instance класса IMap
 * @category Types
 */


/**@type {MapContextType}*/
const defaultMap = {
    map: null
}

/**
 * @type {React.Context<MapContextType>}
 */
export const MapContext = createContext(defaultMap)

export default function MapContextProvider({children}) {
    const [loading, setLoading] = useState(true)
    const [state, setState] = useState(defaultMap)

    useEffect(() => {
        if (window.ymaps) {
            window.ymaps.ready(() => {
                const map = new YMap({})
                setLoading(false)
                setState({map})
            })
        }
    }, [])

    if (loading) {
        return (
            <PageContainer center>
                <Loader className='loader'/>
            </PageContainer>
        )
    } else {
        return (
            <MapContext.Provider value={state}>
                {children}
            </MapContext.Provider>
        )
    }
}