import {useEffect, useRef, useState} from "react";
import clsx from "clsx";

import './Curtain.css'
import useResize from "../../hooks/useResize";

/**
 *
 * @param children
 * @param {number} minOffset минимальное смещение в пикселях (px) от верхнего положения
 * @param {number} maxScroll максимальное значение в px на которое открывается шторка
 * @param {number} maxOpenPercent 0 - 1
 * @param {number} defaultOffsetPX px
 * @param {number} defaultOffsetPercents 0 - 1
 * @param {number} duration default 300ms
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
                                    duration = 300
                                }) {
    /**@type{React.MutableRefObject<HTMLDivElement>}*/
    const cRef = useRef()
    /**@type{React.MutableRefObject<HTMLDivElement>}*/
    const cTopRef = useRef()
    /**@type{React.MutableRefObject<HTMLDivElement>}*/
    const curtainRef = useRef()

    const [topOffset, setTopOffset] = useState(minOffset)

    const windowSize = useResize()

    useEffect(() => {
        if (defaultOffsetPX || defaultOffsetPercents) {
            const curtainHeight = cRef.current.getBoundingClientRect().height
            setTopOffset(Math.max(defaultOffsetPX, defaultOffsetPercents * curtainHeight))
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
        //смещение относительно верха при полностью открытой шторки
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
            animateTop(curtainRef.current, minOffset, duration)()
        } else {
            const t = calcTopOffset()
            setTopOffset(t)
            animateTop(curtainRef.current, t, duration)()

        }
    }

    /**@type{CSSProperties} */
    const curtainStyle = {
        top: topOffset + 'px',
        maxHeight: `calc(100% - ${topOffset}px - ${minOffset})`
    }

    return (
        <div ref={cRef} className='curtain'>
            <div
                ref={curtainRef}
                className={clsx('curtain-container', {'scrolled': topOffset})}
                style={curtainStyle}
            >
                <div className='wrapper'>
                    <div ref={cTopRef} className='center'>
                        <button className='curtain-top-btn'
                                onClick={(e) => curtainHandler(e)}/>
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
