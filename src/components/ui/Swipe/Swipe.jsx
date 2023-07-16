import React, {useState} from "react";
import {useSwipeable} from "react-swipeable";
import clsx from "clsx";

import useOutside from "../../../hooks/useOutside";

import './Swipe.css'

const defaultMargin = parseInt(getComputedStyle(document.head).getPropertyValue('--x')) * 2 || 40


export default function Swipe({children, className, onClick, onRemove, onConfirm, marginMax, small, ...props}) {
    const [marginLeft, setMarginLeft] = useState(0)
    const {ref} = useOutside(false, setMarginLeft.bind(this, 0))
    const handlers = useSwipeable({
        onSwiping(e) {
            if (e.dir === 'Left') {
                setMarginLeft(-Math.min(e.absX, marginMax || defaultMargin))
            } else if (e.dir === 'Right') {
                setMarginLeft(Math.min(e.absX, marginMax || defaultMargin))
            }
        },
        onTap(e) {
            handleClick(e.event)
            setMarginLeft(0)
        },
        onSwipedLeft(e) {
            const max = (marginMax || defaultMargin)
            const marginThreshold = max * 8 / 10

            setMarginLeft(e.absX > marginThreshold ? -max : 0)
        },
        onSwipedRight(e) {
            const max = (marginMax || defaultMargin)
            const marginThreshold = max * 8 / 10

            setMarginLeft(e.absX > marginThreshold ? max : 0)
        },
    })


    function handleConfirm() {
        onConfirm && onConfirm()
    }

    function handleRemove() {
        onRemove && onRemove()
    }

    function handleClick(e) {
        e.stopPropagation()
        onClick && onClick()
    }


    const styles = clsx(
        'swiper-container',
        {
            'small': small,
        },
        className
    )


    return (
        <div ref={ref} className={styles}>
            <div className='swiper-controls flex-between'>
                <div className='swiper-button center' onClick={handleConfirm}>
                    <img src={process.env.PUBLIC_URL + '/icons/check.svg'} alt="check"/>
                </div>
                <div className='swiper-button center' onClick={handleRemove}>
                    <img src={process.env.PUBLIC_URL + '/icons/trash.svg'} alt="trash"/>
                </div>
            </div>
            <div
                className='swipe-item'
                {...handlers}
                onClick={handleClick}
                style={{
                    transform: `translateX(${marginLeft}px)`,
                }}
            >
                {children}
            </div>
        </div>
    )

}