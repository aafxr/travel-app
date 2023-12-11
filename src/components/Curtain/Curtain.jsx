import {useEffect, useRef, useState} from "react";
import clsx from "clsx";

import useResize from "../../hooks/useResize";

import './Curtain.css'

/**
 * компонент обертка, добавляет шторку
 * @function
 * @name Curtain
 * @param children
 * @param {string} direction направвление поездки, если указано, то будет отображаться вместо кнопки в шапке компонента
 * @param {number} minOffset минимальное смещение в пикселях (px) от верхнего положения
 * @param {number} maxScroll максимальное значение в px на которое открывается шторка
 * @param {number} maxOpenPercent 0 - 1 , величина, на которую открывается шторка
 * @param {number} defaultOffsetPX px , начальное состояние шторки (на сколько она открыта)
 * @param {number} defaultOffsetPercents 0 - 1 , начальное состояние шторки (на сколько она открыта)
 * @param {number} duration default 300ms
 * @param {number} scrollDiff default 0.1 минимальное смещение (drag events), на которое реагирует шторка
 * @param {function} onChange callback (шторка открыта / закрыта)
 * @return {JSX.Element}
 * @category Components
 */
export default function Curtain({
                                    children,
                                    direction,
                                    minOffset = 0,
                                    maxScroll,
                                    maxOpenPercent,
                                    defaultOffsetPX = 0,
                                    defaultOffsetPercents = 0,
                                    duration = 300,
                                    scrollDiff = 0.1,
                                    onChange
                                }) {
    /***
     * react ref на основной блок-контейнер шторки
     * @type{React.MutableRefObject<HTMLDivElement>}
     */
    const cRef = useRef()
    /***
     * react ref на верхнюю кнопку
     * @type{React.MutableRefObject<HTMLDivElement>}
     */
    const cTopRef = useRef()
    /***@type{React.MutableRefObject<HTMLDivElement>}*/
    const curtainRef = useRef()

    const [topOffset, setTopOffset] = useState(minOffset)

    //флаг для первой отрисовки (убирает скачек из верхнего положения в дефольное )
    const [init, setInit] = useState(false)
    //переменные для drag / touch events
    const [dragStart, setDragStart] = useState(0)
    const [dragEnd, setDragEnd] = useState(0)


    const windowSize = useResize()

    useEffect(() => {
        if (typeof defaultOffsetPX === 'number' || typeof defaultOffsetPercents === 'number' ) {
            const curtainHeight = cRef.current.getBoundingClientRect().height
            const topButtonHeight = cTopRef.current.getBoundingClientRect().height
            const height = curtainHeight - topButtonHeight

            setTopOffset(Math.max(defaultOffsetPX, defaultOffsetPercents * height))
            setInit(true)
        }
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

    function curtainHandler(e) {
        e.stopPropagation()
        if(e.type === 'mouseup') {
            if (topOffset > minOffset * (1 + scrollDiff)) {
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
    }

    /**@type{CSSProperties} */
    const curtainStyle = {
        top: topOffset + 'px',
        maxHeight: `calc(100% - ${topOffset}px - ${minOffset})`
    }

    //================= drag handlers ============================================================================
    function handleTouchStart(e) {
        e.stopPropagation()
        document.documentElement.classList.add('disable-reload')
        startPosition(e.touches[0].pageY)
    }

    function handleTouchEnd(e) {
        e.stopPropagation()
        document.documentElement.classList.remove('disable-reload')
        endPosition(e.touches[0]?.pageY)
    }

    function handleTouchMove(e) {
        e.stopPropagation()
        movePosition(e.touches[0].pageY)
    }

    //====================================
    function handleDragStart(e) {
        e.stopPropagation()
        startPosition(e.pageY)
    }

    function handleDragEnd(e) {
        e.stopPropagation()
        endPosition(e.pageY)
    }

    function handleDrag(e) {
        e.stopPropagation()
        movePosition(e.pageY)
    }

    //====================================

    function startPosition(y) {
        setDragStart(y)
    }

    function endPosition(y) {
        const diff = dragStart - dragEnd
        //минимальное смещение в пикселях, на которое не реагирует шторка
        const scrollDiffHeight = calcTopOffset() * scrollDiff
        if (Math.abs(diff) > scrollDiffHeight) {
            if (diff < 0) {
                setTopOffset(calcTopOffset())
                const t = calcTopOffset()
                animateTop(curtainRef.current, t, duration)()
                onChange && onChange(false)
            } else {
                setTopOffset(minOffset || 0)
                const t = minOffset || 0
                animateTop(curtainRef.current, t, duration)()
                onChange && onChange(true)
            }
        } else {
            if (Math.abs(minOffset - dragEnd) < scrollDiffHeight) {
                setTopOffset(minOffset || 0)
                const t = minOffset || 0
                animateTop(curtainRef.current, t, duration)()
                onChange && onChange(true)
            } else {
                setTopOffset(calcTopOffset())
                const t = calcTopOffset()
                animateTop(curtainRef.current, t, duration)()
                onChange && onChange(false)
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
                        className='curtain-header'
                        onMouseUp={(e) => curtainHandler(e)}
                        onMouseDown={(e) => curtainHandler(e)}
                        onClick={(e) => curtainHandler(e)}
                        onDoubleClick={(e) => curtainHandler(e)}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        onDrag={handleDrag}
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                        onTouchMove={handleTouchMove}
                        draggable
                    >
                        {
                            (typeof direction === 'string' && direction.length > 0)
                            ? <div className='title-semi-bold center' style={{height: "1.8rem",textAlign: 'center'}}>{direction}</div>
                            : <button className='curtain-top-btn'/>
                        }
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
