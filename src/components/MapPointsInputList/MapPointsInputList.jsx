import {useSelector} from "react-redux";
import {useEffect, useRef, useState} from "react";

import {pushAlertMessage} from "../Alerts/Alerts";
import constants from "../../static/constants";
import createId from "../../utils/createId";
import DragIcon from "../svg/DragIcon";
import Swipe from "../ui/Swipe/Swipe";
import {Input} from "../ui";

/**
 * @typedef {Function} PointsListChangeFunction
 * @param {InputPoint[]} points
 */

/**
 * Компонент отображает список HTMLInputElement-ов
 * @param {IMap} map
 * @param {InputPoint[]} pointsList
 * @param {PointsListChangeFunction} onListChange
 * @returns {JSX.Element}
 * @constructor
 */
export default function MapPointsInputList({map, pointsList, onListChange}) {
    const {user} = useSelector(state => state[constants.redux.USER])
    const [points, setPoints] = useState(/**@type{InputPoint[]} */ [])

    /** переменная для хранения информации о draggingPoint и dragOverPoint */
    const drag = useRef({})

    /** clone - react ref  на HTMLElement, который планируем перетаскивать */
    const clone = useRef(null)

    /** react ref, содержит поля top, right (смещение относительно верхнего правого угда элемента)*/
    const offset = useRef(null)

    useEffect(() => {
        if (pointsList && pointsList.length) setPoints(pointsList)
    }, [pointsList])


    // обработка ввода input ===========================================================================================
    /**
     * при нажатии Enter (keyCode = 13) добавляет точку на карту
     * @param {KeyboardEvent<HTMLInputElement>} e
     * @param item - элемент из массива points
     * @returns {Promise<void>}
     */
    async function handleKeyDown(e, item) {
        if (e.keyCode === 13) {
            const marker = await map.addMarkerByAddress(item.text, item.id)
            if (marker) {
                /** обновляем адресс в массиве points по полученным данным от api карты */
                const newPoints = points.map(p => {
                    if (p === item) {
                        return {...item, text: marker.textAddress, point: marker}
                    }
                    return p
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
            if (p === item) return {...item, text: e.target.value}
            return p
        })
        setPoints(newPoints)
    }


    // обработка перетаскивания ========================================================================================
    function handleDragStart(item) {
        drag.current.draggingPoint = item
    }

    /**
     * @param item - точка, которую перетаскивали
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
        /**  если оба индекса существуют ( индексы !== -1), то меняем элементы местами */
        if (~draggingIDX && ~overIDX) {
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
            /** создаем копию элемента */
            clone.current = cloneNode(el)
            document.body.appendChild(clone.current)

            const {clientX, clientY} = e.changedTouches[0]
            /** смещение относительно правого верхнего угла блока-контейнерв */
            const top = clientY - elRect.top - elRect.height
            /** смещение относительно правого верхнего угла блока-контейнерв */
            const right = clientX - elRect.left - elRect.width
            offset.current = {top, right}
        }
        handleDragStart(item)
    }

    /**
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
        /** поиск обертки input элемента  */
        const container = document.elementFromPoint(clientX, clientY)?.closest('.travel-map-input-container')
        if (container) {
            /** достаем id  из data-атрибута id */
            const pointID = container.dataset.id
            const point = points.find(p => p.id === pointID)
            if (point) {
                drag.current.draggOverPoint = point
                handleDragEnd(point)
            }
        }
    }

    /**
     * удаление точки с карты
     * @param {InputPoint} item
     */
    function handleRemovePoint(item) {
        if (map) {
            /**
             * индекс удаляемой точки
             * @type{number}
             */
            const pointIdx = points.findIndex(p => p === item)
            /** проверка на  pointIdx !== -1 */
            if (~pointIdx) {
                /** удаляемая точка с карты */
                const point = points[pointIdx].point
                /** point может не существовать (если не нажата кнопка Enter) */
                point && map.removeMarker(point)
                /** обновленный массив точек */
                const newPoints = points.filter((p, idx) => idx !== pointIdx)
                /** обновляем зум карты */
                map.autoZoom()
                /** если массив точек пуст добавляем пустое поле для новой точки */
                newPoints.length === 0 && newPoints.push({id: createId(user.id), text: '', point: undefined})
                setPoints(newPoints)
                onListChange && onListChange(newPoints)
            }
        }
    }

    return (
        <>
            {
                points.map(p => (
                    <Swipe
                        key={p.id}
                        onRemove={() => handleRemovePoint(p)}
                        rightButton
                    >
                        <div
                            onClick={() => {
                            }}
                            className='travel-map-input-container relative'
                            onDragOver={() => handleDragOver(p)}
                            onDragLeave={() => handleDragLeave(p)}
                            data-id={p.id}
                        >
                            <Input
                                id={p.id}
                                className='travel-map-input'
                                placeholder='Куда едем?'
                                value={p.text}
                                onKeyDown={(e) => handleKeyDown(e, p)}
                                onChange={(e) => handleInputChange(e, p)}
                                autoComplete='off'
                                // onFocus={(e) => handleFocus(e, p)}
                                // onBlur={(e) => handleBlur(e, p)}
                            />
                            <div
                                className='travel-map-drag-icon'
                                onClick={() => {
                                }}
                                onTouchStart={(e) => handleTouchStart(e, p)}
                                onTouchEnd={(e) => handleTouchEnd(e, p)}
                                onTouchMove={handleTouchMove}
                                onDragStart={() => handleDragStart(p)}
                                onDragEnd={() => handleDragEnd(p)}
                                draggable
                            >
                                <DragIcon/>
                            </div>
                        </div>
                    </Swipe>
                ))
            }
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
