import {Input} from "../ui";
import {DragIcon} from "../svg";
import Swipe from "../ui/Swipe/Swipe";
import {useEffect, useState} from "react";
import useTravelContext from "../../hooks/useTravelContext";
import defaultPoint from "../../utils/default-values/defaultPoint";

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
    }
) {
    const {travel, travelObj} = useTravelContext()
    const [p, setPoint] = useState(/**@type{WaypointType}*/ null)
    const isFocus = document.activeElement.dataset.id === p?.id

    useEffect(() => {
        if (!travel) return
        if (point)
            setPoint(point)
        else
            setPoint(defaultPoint(travelObj.id))
    }, [travel, point])

    /**@type {(point: WaypointType) => unknown} */
    const handleRemovePoint = (point) => onRemovePoint && onRemovePoint(point)

    /**@type {(point: WaypointType) => unknown} */
    const handleDragOver = (point) => onDragOver && onDragOver(point)

    /**@type {(point: WaypointType) => unknown} */
    const handleDragLeave = (point) => onDragLeave && onDragLeave(point)

    /**@type {(point: WaypointType) => unknown} */
    const handleFocus = (point) => onFocus && onFocus(point)

    /**@type {(point:WaypointType) => unknown} */
    const handleBlur = (point) => onBlur && onBlur(point)

    /**@type {(point: WaypointType) => unknown} */
    const handleSearchClick = (point) => onSearchClick && onSearchClick(point)

    /**@type {(event: TouchEvent<HTMLDivElement>,point: WaypointType) => unknown} */
    const handleTouchStart = (event, point) => onTouchStart && onTouchStart(event, point)

    /**@type {(event: TouchEvent<HTMLDivElement>, point: WaypointType) => unknown} */
    const handleTouchEnd = (event, point) => onTouchEnd && onTouchEnd(event, point)

    /**@type {(event: TouchEvent<HTMLDivElement>, point: WaypointType) => unknown} */
    const handleTouchMove = (event, point) => onTouchMove && onTouchMove(event, point)

    /**@type {(point: WaypointType) => unknown} */
    const handleDragStart = (point) => onDragStart && onDragStart(point)

    /**@type {(point: WaypointType) => unknown} */
    const handleDragEnd = (point) => onDragEnd && onDragEnd(point)

    /**@type {(event: InputEvent, point: WaypointType) => unknown} */
    const handleKeyDown = (event, point) => onKeyDown && onKeyDown(event, point)

    /**@type {(event: InputEvent, point: WaypointType) => unknown} */
    const handleInputChange = (event, point) => onInputChange && onInputChange(event, point)


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
                    id={p.id}
                    className='input'
                    placeholder={"Найдите регион или город"}
                    value={p.address}
                    onKeyDown={(e) => handleKeyDown(e, p)}
                    onChange={(e) => handleInputChange(e, p)}
                    autoComplete='off'
                    data-id={p.id}
                    onFocus={handleFocus}
                    onBlur={() => handleBlur(p)}
                    //() => sleep(200).then(() => setFocusInputId(null))
                    // onBlur={(e) => handleBlur(e, p)}
                />
                {
                    isFocus
                        ? <img
                            className='travel-map-search'
                            onClick={() => handleSearchClick(p)}
                            src={process.env.PUBLIC_URL + '/icons/search.svg'}
                            alt="search"
                        />
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