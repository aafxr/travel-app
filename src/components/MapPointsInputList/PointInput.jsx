import {Input} from "../ui";
import DragIcon from "../svg/DragIcon";
import Swipe from "../ui/Swipe/Swipe";
import {useEffect, useState} from "react";
import useTravelContext from "../../hooks/useTravelContext";
import defaultPoint from "../../utils/default-values/defaultPoint";

/**
 * @function
 * @name PointInput
 * @param {PointType} [point]
 * @param {(point: PointType) => unknown} [onRemovePoint]
 * @param {(point: PointType) => unknown} [onDragOver]
 * @param {(point: PointType) => unknown} [onDragLeave]
 * @param {(point: PointType) => unknown} [onFocus]
 * @param {(point: PointType) => unknown} [onBlur]
 * @param {(point: PointType) => unknown} [onSearchClick]
 * @param {(event: TouchEvent<HTMLDivElement>,point: PointType) => unknown} [onTouchStart]
 * @param {(event: TouchEvent<HTMLDivElement>,point: PointType) => unknown} [onTouchEnd]
 * @param {(event: TouchEvent<HTMLDivElement>,point: PointType) => unknown} [onTouchMove]
 * @param {(point: PointType) => unknown} [onDragStart]
 * @param {(point: PointType) => unknown} [onDragEnd]
 * @param {(event: InputEvent, point: PointType) => unknown} [onKeyDown]
 * @param {(event: InputEvent, point: PointType) => unknown} [onInputChange]
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
    const {travel} = useTravelContext()
    const [p, setPoint] = useState(/**@type{PointType}*/ null)
    const isFocus = document.activeElement.dataset.id === p?.id

    useEffect(() => {
        if (!travel) return
        if (point)
            setPoint(point)
        else
            setPoint(defaultPoint(travel.id))
    }, [travel, point])

    /**@type {(point: PointType) => unknown} */
    const handleRemovePoint = (point) => onRemovePoint && onRemovePoint(point)

    /**@type {(point: PointType) => unknown} */
    const handleDragOver = (point) => onDragOver && onDragOver(point)

    /**@type {(point: PointType) => unknown} */
    const handleDragLeave = (point) => onDragLeave && onDragLeave(point)

    /**@type {(point: PointType) => unknown} */
    const handleFocus = (point) => onFocus && onFocus(point)

    /**@type {(point:PointType) => unknown} */
    const handleBlur = (point) => onBlur && onBlur(point)

    /**@type {(point: PointType) => unknown} */
    const handleSearchClick = (point) => onSearchClick && onSearchClick(point)

    /**@type {(event: TouchEvent<HTMLDivElement>,point: PointType) => unknown} */
    const handleTouchStart = (event, point) => onTouchStart && onTouchStart(event, point)

    /**@type {(event: TouchEvent<HTMLDivElement>, point: PointType) => unknown} */
    const handleTouchEnd = (event, point) => onTouchEnd && onTouchEnd(event, point)

    /**@type {(event: TouchEvent<HTMLDivElement>, point: PointType) => unknown} */
    const handleTouchMove = (event, point) => onTouchMove && onTouchMove(event, point)

    /**@type {(point: PointType) => unknown} */
    const handleDragStart = (point) => onDragStart && onDragStart(point)

    /**@type {(point: PointType) => unknown} */
    const handleDragEnd = (point) => onDragEnd && onDragEnd(point)

    /**@type {(event: InputEvent, point: PointType) => unknown} */
    const handleKeyDown = (event, point) => onKeyDown && onKeyDown(event, point)

    /**@type {(event: InputEvent, point: PointType) => unknown} */
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
                    className='travel-map-input'
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