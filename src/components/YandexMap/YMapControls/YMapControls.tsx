import clsx from "clsx";
import React from 'react'
import type {Map} from 'ymaps/index'

import userLocation from "../../../utils/userLocation";
import {UserLocationIcon, MinusIcon} from "../../svg";
import {pushAlertMessage} from "../../Alerts/Alerts";
import {PlusIcon} from "../../svg";
import {useYMap} from "../useYMap";

import './MapControls.css'

type MapControlsPropsType = {
    className?: string
    duration?: number
    onPlusClick?: (map: Map) => unknown
    onMinusClick?: (map: Map) => unknown
    onUserLocationClick?: (map: Map) => unknown
}

/**
 * Компонент отображает элементы управления зумом и геолокацией
 * @param {string} className css class
 * @param {number} duration плавный эффект перерисовки карты
 * @param {Function} onPlusClick обработчик на клик по кнопке "приблизить карту"
 * @param {Function} onMinusClick обработчик на клик по кнопке "отдалить карту"
 * @param {Function} onUserLocationClick обработчик на клик по кнопке "геолокация пользователя"
 * @returns {JSX.Element|null}
 * @category Components
 */
export function YMapControls({
                          className,
                          duration = 300,
                          onPlusClick,
                          onMinusClick,
                          onUserLocationClick
                      }: MapControlsPropsType) {
    const map = useYMap()
    if (!map) return null

    /*** увеличение зума на +1 */
    function handleZoomPlus() {
        if (!map) return
        const zoom = map.getZoom()
        map.setZoom(zoom + 1, {duration}).catch(console.error)
        onPlusClick && onPlusClick(map)
    }

    /*** уменьшение зума карты на -1 */
    function handleZoomMinus() {
        if (!map) return
        const zoom = map.getZoom()
        map.setZoom(zoom - 1, {duration}).catch(console.error)
        onMinusClick && onMinusClick(map)
    }

    /*** попытка получить геолокацию пользователя и установить центр карты на текущие координаты пользователя */
    async function handleUserLocation() {
        if (!map) return
        try {
            const userCoords = await userLocation()
            if (userCoords) {
                await map.setCenter(userCoords, undefined, {duration})
                onUserLocationClick && onUserLocationClick(map)
            } else {
                pushAlertMessage({type: 'warning', message: 'Не удалось получить геолокацию устройства'})
            }
        } catch (err) {
            pushAlertMessage({type: 'warning', message: 'Не удалось определить координаты'})
        }
    }

    return (
        <div className={clsx('map-controls column gap-0.5', className)}>
            <button className='map-control-btn center' onClick={handleZoomPlus}><PlusIcon/></button>
            <button className='map-control-btn center' onClick={handleZoomMinus}><MinusIcon/></button>
            <button className='map-control-btn center' onClick={handleUserLocation}><UserLocationIcon/></button>
        </div>
    )
}

// export React.memo(YMapControls) as YMapControls
