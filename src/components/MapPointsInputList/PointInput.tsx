import {Input} from "../ui";
import {DragIcon, SearchIcon} from "../svg";
import Swipe from "../ui/Swipe/Swipe";
import React, {useRef} from "react";
import {Waypoint} from "../../classes/StoreEntities";


type PointInputPropsType = {
    point: Waypoint,
    onRemovePoint?: (waypoint: Waypoint) => unknown,
    onDragOver?: (waypoint: Waypoint) => unknown,
    onDragLeave?: (waypoint: Waypoint) => unknown,
    onFocus?: (waypoint: Waypoint) => unknown,
    onBlur?: (waypoint: Waypoint) => unknown,
    onSearchClick?: (waypoint: Waypoint) => unknown,
    onTouchStart?: (e: React.TouchEvent<HTMLDivElement>, waypoint: Waypoint) => unknown,
    onTouchEnd?: (e: React.TouchEvent<HTMLDivElement>, waypoint: Waypoint) => unknown,
    onTouchMove?: (e: React.TouchEvent<HTMLDivElement>, waypoint: Waypoint) => unknown,
    onDragStart?: (waypoint: Waypoint) => unknown,
    onDragEnd?: (waypoint: Waypoint) => unknown,
    onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>, waypoint: Waypoint) => unknown,
    onInputChange?: (text: string, waypoint: Waypoint) => unknown,
    onHover?: (hoverWaypoint: Waypoint) => unknown
}

/**
 * @function
 * @name PointInput
 * @param {Waypoint} [point]
 * @param {(point: Waypoint) => unknown} [onRemovePoint]
 * @param {(point: Waypoint) => unknown} [onDragOver]
 * @param {(point: Waypoint) => unknown} [onDragLeave]
 * @param {(point: Waypoint) => unknown} [onFocus]
 * @param {(point: Waypoint) => unknown} [onBlur]
 * @param {(point: Waypoint) => unknown} [onSearchClick]
 * @param {(event: TouchEvent<HTMLDivElement>,point: Waypoint) => unknown} [onTouchStart]
 * @param {(event: TouchEvent<HTMLDivElement>,point: Waypoint) => unknown} [onTouchEnd]
 * @param {(event: TouchEvent<HTMLDivElement>,point: Waypoint) => unknown} [onTouchMove]
 * @param {(point: Waypoint) => unknown} [onDragStart]
 * @param {(point: Waypoint) => unknown} [onDragEnd]
 * @param {(event: InputEvent, point: Waypoint) => unknown} [onKeyDown]
 * @param {(event: InputEvent, point: Waypoint) => unknown} [onInputChange]
 * @param {(event: InputEvent, point: Waypoint) => unknown} [onHover]
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

    const handleRemovePoint = (point: Waypoint) => onRemovePoint && onRemovePoint(point)

    const handleDragOver = (point: Waypoint) => onDragOver && onDragOver(point)

    const handleDragLeave = (point: Waypoint) => onDragLeave && onDragLeave(point)

    const handleFocus = (point: Waypoint) => onFocus && onFocus(point)

    const handleBlur = (point: Waypoint) => onBlur && onBlur(point)

    const handleSearchClick = (point: Waypoint) => onSearchClick && onSearchClick(point)

    const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>, point: Waypoint) => {
        onTouchStart && onTouchStart(event, point)
        onHover && onHover(point)
    }

    const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>, point: Waypoint) => onTouchEnd && onTouchEnd(event, point)

    const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>, point: Waypoint) => onTouchMove && onTouchMove(event, point)

    const handleDragStart = (point: Waypoint) => onDragStart && onDragStart(point)

    const handleDragEnd = (point: Waypoint) => onDragEnd && onDragEnd(point)

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>, point: Waypoint) => onKeyDown && onKeyDown(event, point)

    const handleInputChange = (text: string, point: Waypoint) => {
        if (text !== point.address)
            onInputChange && onInputChange(text, point)
    }

    const handleHover = (point: Waypoint) => onHover && onHover(point)


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