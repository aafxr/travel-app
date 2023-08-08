import {useRef, useState} from "react";
import clsx from "clsx";

import './Curtain.css'

/**
 *
 * @param children
 * @param {number} minOffset минимальное смещение в пикселях (px) от верхнего положения
 * @param {number} maxScroll максимальное значение в px на которое открывается шторка
 * @param {number} maxOpenPercent 0 - 1
 * @return {JSX.Element}
 * @constructor
 */
export default function Curtain({children, minOffset = 0, maxScroll, maxOpenPercent}){
    /**@type{React.MutableRefObject<HTMLDivElement>}*/
    const cRef = useRef()
    /**@type{React.MutableRefObject<HTMLDivElement>}*/
    const cTopRef = useRef()

    const [topOffset, setTopOffset] = useState(minOffset)

    function curtainHandler(){
        if (topOffset > minOffset){
            setTopOffset(minOffset)
        }else{
            const curtainHeight = cRef.current.getBoundingClientRect().height
            const cTopHeight = cTopRef.current.getBoundingClientRect().height
            let top = curtainHeight - cTopHeight
            if (maxScroll){
                top = Math.min(top, maxScroll)
            } else if(maxOpenPercent){
                top = top * maxOpenPercent
            }
            setTopOffset(top)
        }
    }

    /**@type{CSSProperties} */
    const curtainStyle = {
        top: topOffset + 'px',
        maxHeight: `calc(100% - ${topOffset}px - ${minOffset})`
    }

    return (
        <div
            ref={cRef}
            className={clsx('curtain wrapper', {'scrolled': topOffset})}
            style={curtainStyle}
        >
            <div ref={cTopRef} className='center' >
                <button className='curtain-top-btn'
                        onClick={(e) => curtainHandler(e)}/>
            </div>
            <div className='content'>
                {children}
            </div>
        </div>
    )
}