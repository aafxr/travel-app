import clsx from "clsx";

import UserLocationIcon from "../svg/userLocationIcon";
import {pushAlertMessage} from "../Alerts/Alerts";
import MinusIcon from "../svg/MinusIcon";
import {PlusIcon} from "../svg";

import './MapControls.css'


/**
 * Компонент отображает элементы управления зумом и геолокацией
 * @param {IMap} map
 * @param {string} className
 * @param {Function} onPlusClick
 * @param {Function} onMinusClick
 * @param {Function} onUserLocationClick
 * @param props
 * @returns {JSX.Element|null}
 * @constructor
 */
export default function MapControls({map, className, onPlusClick, onMinusClick, onUserLocationClick,...props}) {
    if(!map) return null

    // обработка контроллов карты ======================================================================================
    function handleZoomPlus() {
        const zoom = map.getZoom()
        map.setZoom(zoom + 1)
        onPlusClick && onPlusClick(zoom + 1)
    }

    function handleZoomMinus() {
        const zoom = map.getZoom()
        map.setZoom(zoom - 1)
        onMinusClick && onMinusClick(zoom - 1)
    }

    async function handleUserLocation() {
        const userCoords = await map.getUserLocation()
        if (userCoords) {
            map.focusOnPoint(userCoords)
            onUserLocationClick && onUserLocationClick(userCoords)
        } else {
            pushAlertMessage({type: 'warning', message: 'Не удалось получить геолокацию устройства'})
        }
    }
    return (
        <div {...props} className={clsx('map-controls column gap-0.5', className)} >
            <button className='map-control-btn center' onClick={handleZoomPlus}><PlusIcon/></button>
            <button className='map-control-btn center' onClick={handleZoomMinus}><MinusIcon/></button>
            <button className='map-control-btn center' onClick={handleUserLocation}><UserLocationIcon/></button>
        </div>
    )
}
