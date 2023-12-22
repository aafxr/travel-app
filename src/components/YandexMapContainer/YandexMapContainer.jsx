import React, {useEffect, useRef} from 'react'
import useMap from "../../hooks/useMap";
import MapControls from "../MapControls/MapControls";

/**
 * @typedef {function} HandleMapSelected
 * @param {IMap} map
 */

/**
 * компонент обновляет карту если блок был заново монтирован в дом
 * @function
 * @param {Travel} travel
 * @param {[number,number]} userLocation
 * @param children
 * @param {(p: WaypointType) => void} onPointUpdate Callback вызывается при обновлении информации о точке
 * @param {(p: WaypointType) => void} onPointClick Callback вызывается при клике на точке
 * @param {(p: WaypointType) => void} onPointAdd Callback вызывается при доьавлении новой точки
 * @param {(map:IMap) => unknown} onMapReadyCB
 * @returns {JSX.Element}
 * @category Components
 */
function YandexMapContainer({travel, userLocation, children, onPointAdd, onPointClick, onPointUpdate, onMapReadyCB}) {
    /** интерфейс для взаимодействия с картой */
    const map = useMap({
        onPointAdd,
        onPointClick,
        onPointUpdate
    })


    useEffect(() => {
        if (map && onMapReadyCB) onMapReadyCB(map)
        if (map)
            map.setContainerID('map')
    }, [map])

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