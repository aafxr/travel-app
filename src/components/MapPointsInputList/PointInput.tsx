import {Input} from "../ui";
import {DragIcon, SearchIcon} from "../svg";
import Swipe from "../ui/Swipe/Swipe";
import React, {useEffect, useRef, useState} from "react";
import useTravelContext from "../../hooks/useTravelContext";
import defaultPoint from "../../utils/default-values/defaultPoint";
import {WaypointType} from "../../types/WaypointType";


type PointInputPropsType = {
    point: WaypointType,
    onRemovePoint?: (waypoint:WaypointType) => unknown,
    onDragOver?: (waypoint:WaypointType) => unknown,
    onDragLeave?: (waypoint:WaypointType) => unknown,
    onFocus?: (waypoint:WaypointType) => unknown,
    onBlur?: (waypoint:WaypointType) => unknown,
    onSearchClick?: (waypoint:WaypointType) => unknown,
    onTouchStart?: (e: React.TouchEvent<HTMLDivElement>, waypoint:WaypointType) => unknown,
    onTouchEnd?: (e: React.TouchEvent<HTMLDivElement>, waypoint:WaypointType) => unknown,
    onTouchMove?: (e: React.TouchEvent<HTMLDivElement>, waypoint:WaypointType) => unknown,
    onDragStart?: (waypoint:WaypointType) => unknown,
    onDragEnd?: (waypoint:WaypointType) => unknown,
    onKeyDown?: (e:React.KeyboardEvent<HTMLDivElement>, waypoint:WaypointType) => unknown,
    onInputChange?: (text: string, waypoint:WaypointType) => unknown,
    onHover?: (hoverWaypoint: WaypointType) => unknown
}

/**
 * @function
 * @name PointInput
 * @param {WaypointType} [point]
 * @param {(point: WaypointType) => unknown} [onRemovePoint]
 * @param {(point: WaypointType) => unknown} [onDragOver]
 * @param {(point: WaypointType) => unknown} [onDragLeave]
 * @param {(point: WaypointType) => unknown} [onFocus]
 * @param {(point: WaypointType) => unknown} [onBlur]
 * @param {(point: WaypointType) => unknown} [onSearchClick]
 * @param {(event: TouchEvent<HTMLDivElement>,point: WaypointType) => unknown} [onTouchStart]
 * @param {(event: TouchEvent<HTMLDivElement>,point: WaypointType) => unknown} [onTouchEnd]
 * @param {(event: TouchEvent<HTMLDivElement>,point: WaypointType) => unknown} [onTouchMove]
 * @param {(point: WaypointType) => unknown} [onDragStart]
 * @param {(point: WaypointType) => unknown} [onDragEnd]
 * @param {(event: InputEvent, point: WaypointType) => unknown} [onKeyDown]
 * @param {(event: InputEvent, point: WaypointType) => unknown} [onInputChange]
 * @param {(event: InputEvent, point: WaypointType) => unknown} [onHover]
 * @returns {JSX.Element|null}
 * @category Components
 */
export default function PointInput(
    {
        point,
        onRemovePoint,
        onDragOver,
        onDragLeave,
        onFocus,
        onBlur,
        onSearchClick,
        onTouchStart,
        onTouchEnd,
        onTouchMove,
        onDragStart,
        onDragEnd,
        onKeyDown,
        onInputChange,
        onHover
    }: PointInputPropsType
) {
    const inputRef = useRef<HTMLInputElement>(null)
    const isFocus = inputRef.current === document.activeElement

    const handleRemovePoint = (point:WaypointType) => onRemovePoint && onRemovePoint(point)

    const handleDragOver = (point:WaypointType) => onDragOver && onDragOver(point)

    const handleDragLeave = (point:WaypointType) => onDragLeave && onDragLeave(point)

    const handleFocus = (point:WaypointType) => onFocus && onFocus(point)

    const handleBlur = (point:WaypointType) => onBlur && onBlur(point)

    const handleSearchClick = (point:WaypointType) => onSearchClick && onSearchClick(point)

    const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>, point:WaypointType) => {
        onTouchStart && onTouchStart(event, point)
        onHover && onHover(point)
    }

    const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>, point:WaypointType) => onTouchEnd && onTouchEnd(event, point)

    const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>, point:WaypointType) => onTouchMove && onTouchMove(event, point)

    const handleDragStart = (point:WaypointType) => onDragStart && onDragStart(point)

    const handleDragEnd = (point:WaypointType) => onDragEnd && onDragEnd(point)

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>, point:WaypointType) => onKeyDown && onKeyDown(event, point)

    const handleInputChange = (text:string, point:WaypointType) => {
        if(text !== point.address)
        onInputChange && onInputChange(text, point)
    }

    const handleHover = (point:WaypointType) => onHover && onHover(point)


    return (
        <Swipe
            key={point.id}
            onRemove={() => handleRemovePoint(point)}
            rightButton
        >
            <div
                onClick={() => {
                }}
                className='travel-map-input-container'
                onDragOver={() => handleDragOver(point)}
                onDragLeave={() => handleDragLeave(point)}
                data-id={point.id}
            >
                <Input
                    ref={inputRef}
                    id={point.id}
                    className='input'
                    placeholder={"Найдите регион или город"}
                    value={point.address}
                    onKeyDown={(e) => handleKeyDown(e, point)}
                    onChange={(text) => handleInputChange(text, point)}
                    autoComplete='off'
                    data-id={point.id}
                    onFocus={() => handleFocus(point)}
                    onBlur={() => handleBlur(point)}
                    onMouseOver={() => handleHover(point)}
                    delay={1500}
                />
                {
                    isFocus
                        ? <SearchIcon className='travel-map-search' onClick={() => handleSearchClick(point)}/>
                        : (
                            <div
                                className='travel-map-drag-icon'
                                onClick={() => {
                                }}
                                onTouchStart={(e) => handleTouchStart(e, point)}
                                onTouchEnd={(e) => handleTouchEnd(e, point)}
                                onTouchMove={e => handleTouchMove(e, point)}
                                onDragStart={() => handleDragStart(point)}
                                onDragEnd={() => handleDragEnd(point)}
                                draggable
                            >
                                <DragIcon/>
                            </div>
                        )
                }
            </div>
        </Swipe>
    )
}