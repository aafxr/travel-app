import React, {useEffect, useRef} from 'react'
import useMap from "../../hooks/useMap";
import MapControls from "../MapControls/MapControls";

/**
 * @typedef {function} HandleMapSelected
 * @param {IMap} map
 */

/**
 * компонент обновляет карту если блок был заново монтирован в дом
 * @param {TravelType} travel
 * @param {Array.<number,number>} userLocation
 * @param children
 * @param {HandleMapSelected} onMapReady
 * @returns {JSX.Element}
 * @constructor
 */
function YandexMapContainer({travel, userLocation, children, onMapReady}){
    /** интерфейс для взаимодействия с картой */
    const map = useMap(travel, userLocation)

    useEffect(() => {
        if (onMapReady && map) onMapReady(map)
    }, [map, onMapReady])


    // обработка зума при прокрутки колесика мыши
    function handleWheel(e) {
        if (e.deltaY) {
            const zoom = map.getZoom()
            if (e.deltaY < 0) {
                map.setZoom(zoom + 1)
            } else {
                map.setZoom(zoom - 1)
            }
        }
    }

    return (
        <div
            id='map'
            className='relative'
            onWheel={handleWheel}
        >
            <MapControls className='map-controls' map={map}/>
            {children}
        </div>
    )
}

export default React.memo(YandexMapContainer)