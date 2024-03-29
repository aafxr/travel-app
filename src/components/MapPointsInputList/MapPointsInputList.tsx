import React, { useRef} from "react";

import {Waypoint} from "../../classes/StoreEntities";
import PointInput from "./PointInput";

import './MapPointsInoutList.css'


type MapPointsInputListPropsType = {
    waypoints: Waypoint[],
    onFocus: (currentWaypoint:Waypoint) => unknown
    onBlur: (blurtWaypoint:Waypoint) => unknown
    onSubmit: (submitWaypoint:Waypoint) => unknown
    onShuffle: (waypointsSequence: Waypoint[]) => unknown
    onRemove: (removeWaypoint: Waypoint) => unknown
    onChange: (changedWaypoint: Waypoint) => unknown
    onHover?: (hoverWaypoint: Waypoint) => unknown
}


/**
 * Компонент отображает список HTMLInputElement-ов (полей ввода желаемых мест для посещения)
 *
 * отображает список перетаскиваемых input элементов
 *
 * @param {Waypoint[]} [waypoints] список предпологаемых мест для посещения
 * @param onChange обработчик на изменение порядка или введенной локации
 * @param min минимальное чило отображаемых полей
 * @returns {JSX.Element}
 * @category Components
 */
export default function MapPointsInputList({waypoints, onChange, onFocus, onSubmit, onShuffle, onRemove, onBlur, onHover}: MapPointsInputListPropsType) {

    /*** переменная для хранения информации о draggingPoint и dragOverPoint */
    const drag = useRef<{ draggingPoint?: Waypoint, draggOverPoint?: Waypoint }>({})

    /*** clone - react ref  на HTMLElement, который планируем перетаскивать */
    const clone = useRef<HTMLDivElement>()

    /*** react ref, содержит поля top, right (смещение относительно верхнего правого угда элемента)*/
    const offset = useRef<{ top: number, right: number } | null>(null)


// обработка ввода input ===========================================================================================
    /***
     * при нажатии Enter (keyCode = 13) добавляет точку на карту
     * @param {KeyboardEvent<HTMLInputElement>} e
     * @param item - элемент из массива points
     * @returns {Promise<void>}
     */
    async function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>, item: Waypoint) {
        if (e.key === 'Enter') {
            onSubmit && onSubmit(item)
        }
    }


    function handleInputChange(text:string, item: Waypoint) {
        text = text.trim()
        if(text) {
            item.address = text
           onChange && onChange(item)
        }
    }


// обработка перетаскивания ========================================================================================
    function handleDragStart(item: Waypoint) {
        drag.current.draggingPoint = item
    }

    /**
     * @param {Waypoint} item - точка, которую перетаскивали
     */
    function handleDragEnd(item: Waypoint) {
        const draggingIDX = waypoints.findIndex(p => !!drag.current.draggingPoint && p.id === drag.current.draggingPoint.id)
        /** индекс элемента, на который навели */
        const overIDX = waypoints.findIndex(p => !!drag.current.draggOverPoint && p.id === drag.current.draggOverPoint.id)
        /***  если оба индекса существуют ( индексы !== -1), то меняем элементы местами */
        if (~draggingIDX && ~overIDX) {
            /**@type{Waypoint[]}*/
            const newPoints = waypoints.map((p, i, arr) => {
                if (i === draggingIDX) return arr[overIDX]
                if (i === overIDX) return arr[draggingIDX]
                return p
            })
            drag.current = {}
            onShuffle(newPoints)
        }
    }


    function handleDragOver(item: Waypoint) {
        drag.current.draggOverPoint = item
    }

    function handleDragLeave(item: Waypoint) {
    }


    function handleTouchStart(e: React.TouchEvent<HTMLDivElement>, item: Waypoint) {
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


    function handleTouchEnd(e: React.TouchEvent<HTMLDivElement>, p: Waypoint) {
        if (clone.current) clone.current.remove()

        document.documentElement.classList.remove('disable-reload')
        const {clientX, clientY} = e.changedTouches[0]
        /*** поиск обертки input элемента  */
        const container = document.elementFromPoint(clientX, clientY)?.closest('.travel-map-input-container') as HTMLDivElement
        if (container) {
            /*** достаем id  из data-атрибута id */
            const pointID = container.dataset.id
            const point = waypoints.find(p => p.id === pointID)
            if (point) {
                drag.current.draggOverPoint = point
                handleDragEnd(point)
            }
        }
    }

    /** удаление точки с карты */
    function handleRemovePoint(item: Waypoint) {
        onRemove(item)
    }

    function handleFocus(item: Waypoint) {
        const elems = document.querySelectorAll('input[data-id]')
        elems.forEach(el => el.classList.remove('input-highlight'))
        document.activeElement?.classList.add('input-highlight')
        onFocus(item)
    }

    function handleBlur(item: Waypoint) {
        const elems = document.querySelectorAll('input[data-id]')
        elems.forEach(el => el.classList.remove('input-highlight'))
        onBlur(item)
    }

    function handleSearchClick(item: Waypoint) {
        onSubmit(item)
    }

    function handleHover(item:Waypoint){
        onHover && onHover(item)
    }


    return (
        <>
            {
                waypoints.map((p) => (
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
                        onHover={handleHover}
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


