import React, {useEffect, useRef, useState} from "react";

import defaultHandleError from "../../utils/error-handlers/defaultHandleError";
import {WaypointType} from "../../types/WaypointType";
import {Waypoint} from "../../classes/StoreEntities";
import {findByAddress} from "../YandexMap";
import PointInput from "./PointInput";

import './MapPointsInoutList.css'


type MapPointsInputListPropsType = {
    waypoints?: WaypointType[],
    onChange: (waypoints: WaypointType[]) => unknown
    min?: number
}

const dwp = [
    new Waypoint({}).dto(),
    new Waypoint({}).dto(),
    new Waypoint({}).dto(),
    new Waypoint({}).dto()
]

/**
 * Компонент отображает список HTMLInputElement-ов (полей ввода желаемых мест для посещения)
 * @param {WaypointType[]} [waypoints] список предпологаемых мест для посещения
 * @param onChange обработчик на изменение порядка или введенной локации
 * @param min минимальное чило отображаемых полей
 * @returns {JSX.Element}
 * @category Components
 */
export default function MapPointsInputList({waypoints = dwp, onChange, min = 2}: MapPointsInputListPropsType) {

// const user = useUserSelector()
// const {travel, travelObj} = useTravelContext()
// const travelState = useTravelStateSelector()

    const [points, setPoints] = useState<WaypointType[]>([])

    /*** переменная для хранения информации о draggingPoint и dragOverPoint */
    const drag = useRef<{ draggingPoint?: WaypointType, draggOverPoint?: WaypointType }>({})

    /*** clone - react ref  на HTMLElement, который планируем перетаскивать */
    const clone = useRef<HTMLDivElement>()

    /*** react ref, содержит поля top, right (смещение относительно верхнего правого угда элемента)*/
    const offset = useRef<{ top: number, right: number } | null>(null)

    useEffect(() => {
        setPoints(waypoints)
    }, [waypoints])


// обработка ввода input ===========================================================================================
    /***
     * при нажатии Enter (keyCode = 13) добавляет точку на карту
     * @param {KeyboardEvent<HTMLInputElement>} e
     * @param {PointsListChangeType} item - элемент из массива points
     * @returns {Promise<void>}
     */
    async function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>, item: WaypointType) {
        if (e.key === 'Enter') {
            updatePointData(item)
                .catch(defaultHandleError)
        }
    }


    async function updatePointData(item: WaypointType) {
        const {address} = item
        const pointsProperty = await findByAddress(address)
        if('address' in pointsProperty){
            item.address = pointsProperty.address
            item.coords = pointsProperty.boundedBy[0]
            setPoints([...points])
        }
    }


    function handleInputChange(text:string, item: WaypointType) {
        text = text.trim()
        if(text) {
            item.address = text
            findByAddress(text)
                .then(response => {
                    if('address' in response) {
                        item.address = response.address
                        item.coords = response.boundedBy[0]
                        setPoints(prev => ([...prev]))
                    }
                })
                .catch(defaultHandleError)
            setPoints([...points])
        }
    }

    console.log(points)

// обработка перетаскивания ========================================================================================
    function handleDragStart(item: WaypointType) {
        drag.current.draggingPoint = item
    }

    /**
     * @param {WaypointType} item - точка, которую перетаскивали
     */
    function handleDragEnd(item: WaypointType) {
        const draggingIDX = points.findIndex(p => !!drag.current.draggingPoint && p.id === drag.current.draggingPoint.id)
        /** индекс элемента, на который навели */
        const overIDX = points.findIndex(p => !!drag.current.draggOverPoint && p.id === drag.current.draggOverPoint.id)
        /***  если оба индекса существуют ( индексы !== -1), то меняем элементы местами */
        if (~draggingIDX && ~overIDX) {
            /**@type{WaypointType[]}*/
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
            onChange(newPoints)
        }
    }


    function handleDragOver(item: WaypointType) {
        drag.current.draggOverPoint = item
    }

    function handleDragLeave(item: WaypointType) {
    }


    function handleTouchStart(e: React.TouchEvent<HTMLDivElement>, item: WaypointType) {
        document.documentElement.classList.add('disable-reload')
        const $input = e.target as HTMLInputElement
        const el = $input.closest<HTMLDivElement>('.travel-map-input-container')
        if (el) {
            const elRect = el.getBoundingClientRect()
            /*** создаем копию элемента */
            clone.current = cloneNode(el as unknown as HTMLStyleElement) as unknown as HTMLDivElement
            document.body.appendChild(clone.current!)

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
    function handleTouchMove(e: React.TouchEvent<HTMLDivElement>) {
        if (clone.current) {
            const {clientX, clientY} = e.changedTouches[0]
            clone.current.style.right = window.innerWidth - clientX + (offset.current?.right || 0) + 'px'
            clone.current.style.top = clientY + (offset.current?.top || 0) + 'px'
        }
    }

    function handleTouchEnd(e: React.TouchEvent<HTMLDivElement>, p: WaypointType) {
        if (clone.current) clone.current.remove()

        document.documentElement.classList.remove('disable-reload')
        const {clientX, clientY} = e.changedTouches[0]
        /*** поиск обертки input элемента  */
        const container = document.elementFromPoint(clientX, clientY)?.closest('.travel-map-input-container') as HTMLDivElement
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
     * @param {WaypointType} item
     */
    function handleRemovePoint(item: WaypointType) {
        /***
         * индекс удаляемой точки
         */
        const pointIdx = waypoints.findIndex(p => p.id === item.id)
        /*** проверка на  pointIdx !== -1 */
        if (~pointIdx) {
            /*** удаляемая точка с карты */
            const point = waypoints[pointIdx]
            /*** обновленный массив точек */
            const list = points.filter((p) => p.id !== point.id)
            /*** если массив точек пуст добавляем пустое поле для новой точки */
                // list.length === 0 && list.push({id: createId(user.id), text: '', point: undefined})
            const newPoints = waypoints.filter((p) => p.id !== point.id)
            setPoints(list)
            onChange(newPoints)
        }
    }

    function handleFocus(item: WaypointType) {
        const elems = document.querySelectorAll('input[data-id]')
        elems.forEach(el => el.classList.remove('input-highlight'))
        document.activeElement?.classList.add('input-highlight')
    }

    function handleBlur(item: WaypointType) {
        const elems = document.querySelectorAll('input[data-id]')
        elems.forEach(el => el.classList.remove('input-highlight'))
    }

    function handleSearchClick(item: WaypointType) {
        updatePointData(item)
            .catch(defaultHandleError)
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
                        onInputChange={(text => handleInputChange(text, p))}
                    />
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
function cloneNode<T extends HTMLStyleElement>(el: T) {
    if (!el) return null

    const elRect = el.getBoundingClientRect()
    const clone = el.cloneNode(true) as T
    clone.style.opacity = '0.7'
    clone.style.position = 'fixed'
    clone.style.overflow = 'hidden'
    clone.style.zIndex = '1000'
    clone.style.width = elRect.width + 'px'
    clone.style.height = elRect.height + 'px'

    return clone
}


