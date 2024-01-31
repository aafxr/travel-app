import clsx from "clsx";
import React from 'react'

import {UserLocationIcon, MinusIcon} from "../svg";
import {pushAlertMessage} from "../Alerts/Alerts";
import {PlusIcon} from "../svg";

import './MapControls.css'


/**
 * Компонент отображает элементы управления зумом и геолокацией
 * @param {IMap} map интерфейс для взаимодействия с api карты
 * @param {string} className css class
 * @param {Function} onPlusClick обработчик на клик по кнопке "приблизить карту"
 * @param {Function} onMinusClick обработчик на клик по кнопке "отдалить карту"
 * @param {Function} onUserLocationClick обработчик на клик по кнопке "геолокация пользователя"
 * @param props
 * @returns {JSX.Element|null}
 * @category Components
 */
function MapControls({map, className, onPlusClick, onMinusClick, onUserLocationClick, ...props}) {
    if (!map) return null

    // обработка контроллов карты ======================================================================================
    /*** увеличение зума на +1 */
    function handleZoomPlus() {
        const zoom = map.getZoom()
        map.setZoom(zoom + 1)
        /*** поднятие нового значения зума в компонент родитель */
        onPlusClick && onPlusClick(zoom + 1)
    }

    /*** уменьшение зума карты на -1 */
    function handleZoomMinus() {
        const zoom = map.getZoom()
        map.setZoom(zoom - 1)
        /*** передача нового значения зума в компонент родитель */
        onMinusClick && onMinusClick(zoom - 1)
    }

    /*** попытка получить геолокацию пользователя и установить центр карты на текущие координаты пользователя */
    async function handleUserLocation() {
        try {
            const userCoords = await map.getUserLocation()
            if (userCoords) {
                /*** установить центр карты на текущие координаты пользователя */
                map.showPoint(userCoords)
                /*** передача геолокации пользователя в родительский компонент */
                onUserLocationClick && onUserLocationClick(userCoords)
            } else {
                pushAlertMessage({type: 'warning', message: 'Не удалось получить геолокацию устройства'})
            }
        }catch (err){
            pushAlertMessage({type: 'warning', message: 'Не удалось определить координаты'})
        }
    }

    return (
        <div {...props} className={clsx('map-controls column gap-0.5', className)}>
            <button className='map-control-btn center' onClick={handleZoomPlus}><PlusIcon/></button>
            <button className='map-control-btn center' onClick={handleZoomMinus}><MinusIcon/></button>
            <button className='map-control-btn center' onClick={handleUserLocation}><UserLocationIcon/></button>
        </div>
    )
}

export default React.memo(MapControls)
