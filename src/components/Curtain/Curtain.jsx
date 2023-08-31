import {useEffect, useRef, useState} from "react";
import clsx from "clsx";

import useResize from "../../hooks/useResize";

import './Curtain.css'

/**
 *
 * @param children
 * @param {number} minOffset минимальное смещение в пикселях (px) от верхнего положения
 * @param {number} maxScroll максимальное значение в px на которое открывается шторка
 * @param {number} maxOpenPercent 0 - 1
 * @param {number} defaultOffsetPX px
 * @param {number} defaultOffsetPercents 0 - 1
 * @param {number} duration default 300ms
 * @param {number} scrollDiff default 0.1 минимальное смещение (drag events), на которое реагирует шторка
 * @param {Function} onChange callback (шторка открыта / закрыта)
 * @return {JSX.Element}
 * @constructor
 */
export default function Curtain({
                                    children,
                                    minOffset = 0,
                                    maxScroll,
                                    maxOpenPercent,
                                    defaultOffsetPX = 0,
                                    defaultOffsetPercents = 0,
                                    duration = 300,
    scrollDiff = 0.1,
                                    onChange
                                }) {
    /**@type{React.MutableRefObject<HTMLDivElement>}*/
    const cRef = useRef()
    /**@type{React.MutableRefObject<HTMLDivElement>}*/
    const cTopRef = useRef()
    /**@type{React.MutableRefObject<HTMLDivElement>}*/
    const curtainRef = useRef()

    const [topOffset, setTopOffset] = useState(minOffset)

    //флаг для первой отрисовки (убирает скачек из верхнего положения в дефольное )
    const [init, setInit] = useState(false)
    //переменные для drag / touch events
    const [dragStart, setDragStart] = useState(0)
    const [dragEnd, setDragEnd] = useState(0)


    const windowSize = useResize()

    useEffect(() => {
        if (defaultOffsetPX || defaultOffsetPercents) {
            const curtainHeight = cRef.current.getBoundingClientRect().height
            const topButtonHeight = cTopRef.current.getBoundingClientRect().height
            const height = curtainHeight - topButtonHeight

            setTopOffset(Math.max(defaultOffsetPX, defaultOffsetPercents * height))
            setInit(true)
        }
        document.body.style.overscrollBehaviorY = 'none'
        return () => document.body.style.overscrollBehaviorY = 'auto'
    }, [])

    useEffect(() => {
        if (topOffset > minOffset) {
            const t = calcTopOffset()
            setTopOffset(t)
            curtainRef.current.style.top = t + 'px'
        }
    }, [windowSize])

    function calcTopOffset() {
        //высота, которую потнциально может занимать шторка
        const curtainHeight = cRef.current.getBoundingClientRect().height
        //высота кнопки шторки
        const cTopHeight = cTopRef.current.getBoundingClientRect().height
        //высота области, когда шторка максимально открыта (кнопка в нижнкм положении)
        let top = curtainHeight - cTopHeight
        if (maxScroll) {
            top = Math.min(top, maxScroll)
        } else if (maxOpenPercent) {
            top = top * maxOpenPercent
        }
        return top
    }

    function curtainHandler() {
        if (topOffset > minOffset) {
            setTopOffset(minOffset)
            onChange && onChange(false)
            animateTop(curtainRef.current, minOffset, duration)()
        } else {
            const t = calcTopOffset()
            setTopOffset(t)
            onChange && onChange(true)
            animateTop(curtainRef.current, t, duration)()

        }
    }

    /**@type{CSSProperties} */
    const curtainStyle = {
        top: topOffset + 'px',
        maxHeight: `calc(100% - ${topOffset}px - ${minOffset})`
    }

    //================= drag handlers ============================================================================
    function handleTouchStart(e) {
        startPosition(e.touches[0].pageY)
    }

    function handleTouchEnd(e) {
        endPosition(e.touches[0]?.pageY)
    }

    function handleTouchMove(e) {
        movePosition(e.touches[0].pageY)
    }

    //====================================
    function handleDragStart(e) {
        startPosition(e.pageY)
    }

    function handleDragEnd(e) {
        endPosition(e.pageY)
    }

    function handleDrag(e) {
        movePosition(e.pageY)
    }

    //====================================

    function startPosition(y) {
        setDragStart(y)
    }

    function endPosition(y) {
        const curtainHeight = cRef.current.getBoundingClientRect().height
        const diff = dragStart - dragEnd
        if (Math.abs(diff) / curtainHeight > scrollDiff){
            if (diff < 0){
                setTopOffset(calcTopOffset())
                const t = calcTopOffset()
                animateTop(curtainRef.current, t, duration)()
            } else{
                setTopOffset(minOffset || 0)
                const t = minOffset || 0
                animateTop(curtainRef.current, t, duration)()
            }
        } else {
            if (diff > 0 || Math.abs(diff) < scrollDiff){
                setTopOffset(calcTopOffset())
                const t = calcTopOffset()
                animateTop(curtainRef.current, t, duration)()
            } else{
                setTopOffset(minOffset || 0)
                const t = minOffset || 0
                animateTop(curtainRef.current, t, duration)()
            }
        }
    }

    function movePosition(y) {
        setDragEnd(y)
        setTopOffset(y)
    }

    //================= drag handlers end ========================================================================


    return (
        <div ref={cRef} className={clsx('curtain', {'hidden': !init})}>
            <div
                ref={curtainRef}
                className={clsx('curtain-container', {'scrolled': topOffset})}
                style={curtainStyle}
            >
                <div className='wrapper'>
                    <div
                        ref={cTopRef}
                        className='curtain-header center'
                        onClick={(e) => curtainHandler(e)}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        onDrag={handleDrag}
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                        onTouchMove={handleTouchMove}
                    >
                        <button className='curtain-top-btn'/>
                    </div>
                    <div className='content'>
                        {children}
                    </div>
                </div>
            </div>
        </div>

    )
}

/**
 *
 * @param {HTMLElement} el
 * @param {number} topTarget
 * @param {number} duration
 */
function animateTop(el, topTarget, duration) {
    const start = Date.now()
    let elementTop = el.getBoundingClientRect().top
    const delta = (topTarget - elementTop) / duration

    return function calc() {
        const now = Date.now()
        const deltaTime = now - start
        el.style.top = elementTop + delta * deltaTime + 'px'
        if (deltaTime < duration) {
            requestAnimationFrame(calc)
        } else {
            el.style.top = topTarget + 'px'
        }
    }
}
