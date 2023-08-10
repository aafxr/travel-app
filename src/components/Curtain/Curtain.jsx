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
 * @return {JSX.Element}
 * @constructor
 */
export default function Curtain({
                                    children,
                                    minOffset = 0,
                                    maxScroll,
                                    maxOpenPercent,
                                    defaultOffsetPX = 0,
                                    defaultOffsetPercents = 0
                                }) {
    /**@type{React.MutableRefObject<HTMLDivElement>}*/
    const cRef = useRef()
    /**@type{React.MutableRefObject<HTMLDivElement>}*/
    const cTopRef = useRef()

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
            setTopOffset(calcTopOffset())
        }
    }, [windowSize])

    function calcTopOffset() {
        const curtainHeight = cRef.current.getBoundingClientRect().height
        const cTopHeight = cTopRef.current.getBoundingClientRect().height
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
        } else {
            setTopOffset(calcTopOffset())
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