import {useEffect, useRef, useState} from "react";

import {DEFAULT_PLACEMARK_ICON} from "../static/constants";
import ErrorReport from "../controllers/ErrorReport";
import YandexMap from "../api/YandexMap";

/**
 * хук загружает api карты и инициализирует карту
 * @param {TravelType | null} travel
 * @param {[number, number] | null} userLocation
 * @param {boolean} withSelectedPoints default = true
 * @returns {IMap}
 */
export default function useMap(travel, userLocation, withSelectedPoints = true) {
    const [map, setMap] = useState(/**@type {IMap | null} */null)
    const [loading, setLoading] = useState(/**@type {boolean} */false)
    const error = useRef(/**@type {Error | null} */null)

    useEffect(() => {
        if (!map && !loading && !error.current) {
            setLoading(true)
            /** инициализация карты */
            YandexMap.init({
                api_key: process.env.REACT_APP_API_KEY,
                mapContainerID: 'map',
                iconClass: 'location-marker',
                points: (withSelectedPoints && travel?.waypoints ) ? travel.waypoints.map(wp => ({...wp.point})) : [],
                location: userLocation,
                iconURL: DEFAULT_PLACEMARK_ICON,
                // suggestElementID: points[0]?.id,
                markerClassName: 'location-marker'
            }).then(newMap => {
                window.map = newMap
                setMap(newMap)
                setLoading(false)
                error.current = null

            }).catch(err => {
                ErrorReport.sendError(err).catch(console.error)
                console.error(err)
                setLoading(false)
                error.current = err
            })
        }

        return () => map && map.destroyMap()
    }, [map, loading])


    return map
}