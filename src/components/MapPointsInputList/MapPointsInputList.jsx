import {useNavigate} from "react-router-dom";
import {useEffect, useRef, useState} from "react";

import useTravelContext from "../../hooks/useTravelContext";
import useUserSelector from "../../hooks/useUserSelector";
import ErrorReport from "../../controllers/ErrorReport";
import {pushAlertMessage} from "../Alerts/Alerts";
import DragIcon from "../svg/DragIcon";
import Swipe from "../ui/Swipe/Swipe";
import sleep from "../../utils/sleep";
import {Input} from "../ui";
import defaultPoint from "../../utils/default-values/defaultPoint";
import PointInput from "./PointInput";
import defaultHandleError from "../../utils/error-handlers/defaultHandleError";

/**
 * @typedef {{address: string, id: string}} PointsListChangeType
 */
/**
 * @typedef {Function} PointsListChangeFunction
 * @param {PointType[]} points
 */

/**
 * Компонент отображает список HTMLInputElement-ов (полей ввода желаемых мест для посещения)
 * @param {IMap} map интерфейс для взаимодействия с api карты
 * @param {PointType[]} pointsList список предпологаемых мест для посещения
 * @param {PointsListChangeFunction} onListChange обработчик на изменение порядка или введенной локации
 * @returns {JSX.Element}
 * @category Components
 */
export default function MapPointsInputList({map, pointsList, onListChange}) {
    const navigate = useNavigate()
    // const {user} = useUserSelector()
    const {travel} = useTravelContext()
    // const travelState = useTravelStateSelector()
    const [points, setPoints] = useState(/**@type{PointType[]} */ [])

    /*** переменная для хранения информации о draggingPoint и dragOverPoint */
    const drag = useRef({})

    /*** clone - react ref  на HTMLElement, который планируем перетаскивать */
    const clone = useRef(null)

    /*** react ref, содержит поля top, right (смещение относительно верхнего правого угда элемента)*/
    const offset = useRef(null)

    useEffect(() => {
        if (pointsList && pointsList.length) setPoints(pointsList)
    }, [pointsList])


    // обработка ввода input ===========================================================================================
    /***
     * при нажатии Enter (keyCode = 13) добавляет точку на карту
     * @param {KeyboardEvent<HTMLInputElement>} e
     * @param {PointsListChangeType} item - элемент из массива points
     * @returns {Promise<void>}
     */
    async function handleKeyDown(e, item) {
        if (e.keyCode === 13) {
            updatePointData(item)
                .catch(defaultHandleError)
        }
    }

    /***
     *
     * @param {PointsListChangeType} item
     * @returns {Promise<void>}
     */
    async function updatePointData(item) {
        const idx = points.findIndex(p => p.id === item.id)
        if (~idx) {
            const {address, id} = points[idx]
            /**@type{GeoObjectPropertiesType[]}*/
            const markers = await map.getPointByAddress(address)
            if (markers.length > 0) {
                /*** обновляем адресс в массиве points по полученным данным от api карты */
                const newPoints = pointsList.map(p => {
                    const marker = markers[0]

                    return p.id === item.id
                        ? {
                            ...p,
                            address: marker.name,
                            coords: marker.boundedBy[0],
                            kind: marker.metaDataProperty.GeocoderMetaData.kind,
                            locality: marker.metaDataProperty.GeocoderMetaData.AddressDetails.Country.AdministrativeArea.SubAdministrativeArea.Locality.LocalityName
                        }
                        : p
                })
                setPoints(newPoints)
                onListChange && onListChange(newPoints)
            } else {
                pushAlertMessage({type: "warning", message: 'не удалось определить адрес'})
            }
        }
    }

    /**
     * обработка input event
     * @param {InputEvent} e
     * @param item - элемент из массива points
     */
    function handleInputChange(e, item) {
        const newPoints = points.map(p => {
            return p === item
                ? {id: item.id, address: e.target.value}
                : p
        })
        setPoints(newPoints)
    }


    // обработка перетаскивания ========================================================================================
    function handleDragStart(item) {
        drag.current.draggingPoint = item
    }

    /**
     * @param {PointType} item - точка, которую перетаскивали
     */
    function handleDragEnd(item) {
        /**
         * индекс перетаскиваемого элемента
         * @type {number}
         */
        const draggingIDX = points.findIndex(p => !!drag.current.draggingPoint && p.id === drag.current.draggingPoint.id)
        /**
         * индекс элемента, на который навели
         * @type {number}
         */
        const overIDX = points.findIndex(p => !!drag.current.draggOverPoint && p.id === drag.current.draggOverPoint.id)
        /***  если оба индекса существуют ( индексы !== -1), то меняем элементы местами */
        if (~draggingIDX && ~overIDX) {
            /**@type{PointType[]}*/
            const newPoints = points.map((p, i, arr) => {
                if (i === draggingIDX) return arr[overIDX]
                if (i === overIDX) return arr[draggingIDX]
                return p
            })
            /**
             * логика по устаноке нового порядка точек на карте ...
             */
            drag.current = {}
            setPoints(newPoints)
            onListChange && onListChange(newPoints)
        }
    }


    function handleDragOver(item) {
        drag.current.draggOverPoint = item
    }

    function handleDragLeave(item) {
    }


    function handleTouchStart(e, item) {
        document.documentElement.classList.add('disable-reload')
        const el = e.target.closest('.travel-map-input-container')
        if (el) {
            const elRect = el.getBoundingClientRect()
            /*** создаем копию элемента */
            clone.current = cloneNode(el)
            document.body.appendChild(clone.current)

            const {clientX, clientY} = e.changedTouches[0]
            /*** смещение относительно правого верхнего угла блока-контейнерв */
            const top = clientY - elRect.top - elRect.height
            /*** смещение относительно правого верхнего угла блока-контейнерв */
            const right = clientX - elRect.left - elRect.width
            offset.current = {top, right}
        }
        handleDragStart(item)
    }

    /***
     * обработчик для позиционирования клона перемещаемого объекта
     * @param {TouchEvent} e
     */
    function handleTouchMove(e) {
        if (clone.current) {
            const {clientX, clientY} = e.changedTouches[0]
            clone.current.style.right = window.innerWidth - clientX + (offset.current?.right || 0) + 'px'
            clone.current.style.top = clientY + (offset.current?.top || 0) + 'px'
        }
    }

    function handleTouchEnd(e, p) {
        if (clone.current) clone.current.remove()

        document.documentElement.classList.remove('disable-reload')
        const {clientX, clientY} = e.changedTouches[0]
        /*** поиск обертки input элемента  */
        const container = document.elementFromPoint(clientX, clientY)?.closest('.travel-map-input-container')
        if (container) {
            /*** достаем id  из data-атрибута id */
            const pointID = container.dataset.id
            const point = points.find(p => p.id === pointID)
            if (point) {
                drag.current.draggOverPoint = point
                handleDragEnd(point)
            }
        }
    }

    /***
     * удаление точки с карты
     * @param {PointType} item
     */
    function handleRemovePoint(item) {
        if (map) {
            /***
             * индекс удаляемой точки
             * @type{number}
             */
            const pointIdx = pointsList.findIndex(p => p.id === item.id)
            /*** проверка на  pointIdx !== -1 */
            if (~pointIdx) {
                /*** удаляемая точка с карты */
                const point = pointsList[pointIdx]
                /*** point может не существовать (если не нажата кнопка Enter) */
                point && map.removeMarker(point.id)
                /*** обновленный массив точек */
                const list = points.filter((p) => p.id !== point.id)
                /*** обновляем зум карты */
                map.autoZoom()
                /*** если массив точек пуст добавляем пустое поле для новой точки */
                    // list.length === 0 && list.push({id: createId(user.id), text: '', point: undefined})
                const newPoints = pointsList.filter((p) => p.id !== point.id)
                setPoints(list)
                onListChange && onListChange(newPoints)
            }
        }
    }

    function handleFocus(e) {
        const elems = document.querySelectorAll('input[data-id]')
        elems.forEach(el => el.classList.remove('input-highlight'))
        document.activeElement.classList.add('input-highlight')
    }

    function handleSearchClick(item) {
        updatePointData(item)
            .catch(defaultHandleError)
    }

    // добавление новой точки ==========================================================================================
    function handleSubmitNewPoint() {
        const newPoint = defaultPoint(travel.id)
        travel.addWaypoint(newPoint)
        navigate(`/travel/${travel.id}/add/waypoint/${newPoint.id}/`)
    }

    function handleBlur(point) {
        document.getElementById(point.id)?.classList.remove('input-highlight')
    }

    return (
        <>
            {
                points.map((p) => (
                    <PointInput
                        key={p.id}
                        point={p}
                        onRemovePoint={handleRemovePoint}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        onSearchClick={handleSearchClick}
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                        onTouchMove={handleTouchMove}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        onKeyDown={handleKeyDown}
                        onInputChange={handleInputChange}
                    />
                ))
            }
            {
                points.length === 0 && (
                    <PointInput
                        key={p.id}
                        point={p}
                        onRemovePoint={handleRemovePoint}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        onSearchClick={handleSearchClick}
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                        onTouchMove={handleTouchMove}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        onKeyDown={handleKeyDown}
                        onInputChange={handleInputChange}
                    />
                )
            }
            <div
                className='link'
                onClick={handleSubmitNewPoint}
            >
                + Добавить точку маршрута
            </div>
        </>
    )
}

/**
 * возвращает полную копию переданного элмента
 * @param {HTMLElement} el
 * @returns {HTMLElement}
 */
function cloneNode(el) {
    if (!el) return null

    const elRect = el.getBoundingClientRect()
    const clone = el.cloneNode(true)
    clone.style.opacity = 0.7
    clone.style.position = 'fixed'
    clone.style.overflow = 'hidden'
    clone.style.zIndex = 1000
    clone.style.width = elRect.width + 'px'
    clone.style.height = elRect.height + 'px'

    return clone
}
