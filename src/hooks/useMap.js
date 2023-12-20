import {useEffect, useRef, useState} from "react";

import YMap from "../api/YMap";
import useTravelContext from "./useTravelContext";

/**
 * хук загружает api карты и инициализирует карту
 * @function
 * @name useMap
 * @param {IMapOptionType} options
 * @returns {IMap}
 */
export default function useMap(options = {}) {
    const {travel} = useTravelContext()
    const [map, setMap] = useState(/**@type {IMap | null} */null)
    // const [loading, setLoading] = useState(/**@type {boolean} */false)
    // const error = useRef(/**@type {OtherPages | null} */null)
    const optionsRef = useRef(/**@type{IMapOptionType}*/null)

    useEffect(() => {
        optionsRef.current = options
    }, [options])

    useEffect(() => {
        function init(){
            /** инициализация карты */
            const m = new YMap({
                travel,
                icon_size: [32, 32],
                zoom: 7,
                add_location_icon: process.env.PUBLIC_URL + '/icons/add_location_24px.svg',
                location_icon: process.env.PUBLIC_URL + '/icons/location_on_24px.svg',
                onPointAdd(point) {
                    optionsRef.current.onPointAdd && optionsRef.current.onPointAdd(point)
                },
                onPointClick(point) {
                    console.log(point)
                    optionsRef.current.onPointClick && optionsRef.current.onPointClick(point)
                },
                onPointMoved(point) {
                    optionsRef.current.onPointMoved && optionsRef.current.onPointMoved(point)
                },
            })
            setMap(m)
        }

        if('ymaps' in window){
            window.ymaps.ready(init)
        }

        return () => map && map.destroyMap()
    }, [])


    return map
}