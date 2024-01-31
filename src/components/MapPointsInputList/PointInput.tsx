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
    }: PointInputPropsType
) {
    const [p, setPoint] = useState<WaypointType>()
    const inputRef = useRef<HTMLInputElement>(null)
    const isFocus = inputRef.current === document.activeElement

    useEffect(() => {
        if (point) setPoint(point)
    }, [point])

    const handleRemovePoint = (point:WaypointType) => onRemovePoint && onRemovePoint(point)

    const handleDragOver = (point:WaypointType) => onDragOver && onDragOver(point)

    const handleDragLeave = (point:WaypointType) => onDragLeave && onDragLeave(point)

    const handleFocus = (point:WaypointType) => onFocus && onFocus(point)

    const handleBlur = (point:WaypointType) => onBlur && onBlur(point)

    const handleSearchClick = (point:WaypointType) => onSearchClick && onSearchClick(point)

    const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>, point:WaypointType) => onTouchStart && onTouchStart(event, point)

    const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>, point:WaypointType) => onTouchEnd && onTouchEnd(event, point)

    const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>, point:WaypointType) => onTouchMove && onTouchMove(event, point)

    const handleDragStart = (point:WaypointType) => onDragStart && onDragStart(point)

    const handleDragEnd = (point:WaypointType) => onDragEnd && onDragEnd(point)

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>, point:WaypointType) => onKeyDown && onKeyDown(event, point)

    const handleInputChange = (text:string, point:WaypointType) => onInputChange && onInputChange(text, point)


    if (!p) return null

    return (
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
                    ref={inputRef}
                    id={p.id}
                    className='input'
                    placeholder={"Найдите регион или город"}
                    value={p.address}
                    onKeyDown={(e) => handleKeyDown(e, p)}
                    onChange={(text) => handleInputChange(text, p)}
                    autoComplete='off'
                    data-id={p.id}
                    onFocus={() => handleFocus(p)}
                    onBlur={() => handleBlur(p)}
                    delay={1500}
                    //() => sleep(200).then(() => setFocusInputId(null))
                    // onBlur={(e) => handleBlur(e, p)}
                />
                {
                    isFocus
                        ? <SearchIcon className='travel-map-search' onClick={() => handleSearchClick(p)}/>
                        : (
                            <div
                                className='travel-map-drag-icon'
                                onClick={() => {
                                }}
                                onTouchStart={(e) => handleTouchStart(e, p)}
                                onTouchEnd={(e) => handleTouchEnd(e, p)}
                                onTouchMove={e => handleTouchMove(e, p)}
                                onDragStart={() => handleDragStart(p)}
                                onDragEnd={() => handleDragEnd(p)}
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