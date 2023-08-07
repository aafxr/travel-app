import {useRef, useState} from "react";
import clsx from "clsx";

import './Curtain.css'

/**
 *
 * @param children
 * @param {number} maxScroll максимальное значение в px на которое открывается шторка
 * @param {number} maxOpenPercent 0 - 1
 * @return {JSX.Element}
 * @constructor
 */
export default function Curtain({children, maxScroll, maxOpenPercent}){
    /**@type{React.MutableRefObject<HTMLDivElement>}*/
    const cRef = useRef()
    /**@type{React.MutableRefObject<HTMLDivElement>}*/
    const cTopRef = useRef()

    const [topOffset, setTopOffset] = useState(0)

    function curtainHandler(){
        if (topOffset){
            setTopOffset(0)
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

    return (
        <div
            ref={cRef}
            className={clsx('curtain wrapper', {'scrolled': topOffset})}
            style={{top: topOffset + 'px'}}
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