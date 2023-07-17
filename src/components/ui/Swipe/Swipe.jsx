import React, {useEffect, useState} from "react";
import {useSwipeable} from "react-swipeable";
import clsx from "clsx";

import useOutside from "../../../hooks/useOutside";

import './Swipe.css'

const defaultMargin = parseInt(getComputedStyle(document.head).getPropertyValue('--x')) * 2 || 40


/**
 *
 * @param children
 * @param {string} [className]
 * @param {function} [onClick]
 * @param {function} [onRemove]
 * @param {function} [onConfirm]
 * @param {number} [marginMax] default = var(--x) * 2 || 40
 * @param {boolean} [small]
 * @param {boolean} [leftButton]
 * @param {boolean} [rightButton]
 * @param {boolean} [multy]
 * @returns {JSX.Element}
 * @constructor
 */
export default function Swipe({
                                  children,
                                  className,
                                  onClick,
                                  onRemove,
                                  onConfirm,
                                  marginMax,
                                  small,
                                  leftButton,
                                  rightButton,
                                  multy = false
                              }) {
    const [marginLeft, setMarginLeft] = useState(0)
    const {ref} = useOutside(false, setMarginLeft.bind(this, 0))
    const handlers = useSwipeable({
        onSwiped() {
            const max = (marginMax || defaultMargin)
            const marginThreshold = max * 8 / 10;

            if (Math.abs(marginLeft) < marginThreshold) {
                setMarginLeft(0)
            } else if (marginLeft > marginThreshold) {
                leftButton && onConfirm()
                setMarginLeft(0)
            }
        },
        onSwiping(e) {
            if (e.dir === 'Left') {
                (rightButton || marginLeft > 0) && setMarginLeft(-Math.min(e.absX, marginMax || defaultMargin))
            } else if (e.dir === 'Right') {
                (leftButton || marginLeft < 0) && setMarginLeft(Math.min(e.absX, marginMax || defaultMargin))
            }
        },
        onTap(e) {
            handleClick(e.event)
            setMarginLeft(0)
        },
        onSwipedLeft(e) {
            const max = (marginMax || defaultMargin)
            const marginThreshold = max * 8 / 10;

            rightButton && setMarginLeft(e.absX > marginThreshold ? -max : 0)
        },
        onSwipedRight(e) {
            const max = (marginMax || defaultMargin)
            const marginThreshold = max * 8 / 10;

            leftButton && setMarginLeft(e.absX > marginThreshold ? max : 0)
        },
    })


    useEffect(() => {
        function touchOutside(e) {
            if (ref.current && !ref.current.contains(e.target)) {
                setMarginLeft(0)
            }
        }

        if (!multy && ref.current) {
            document.addEventListener('touchstart', touchOutside)
        }

        return () => document.removeEventListener('touchstart', touchOutside)
    }, [])


    function handleConfirm() {
        onConfirm && onConfirm()
    }

    function handleRemove() {
        onRemove && onRemove()
    }

    function handleClick(e) {
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
                <div className='swiper-button checkmark center success' onClick={handleConfirm}>
                    <div className='checkmark-svg'/>
                </div>
                <div className='swiper-button  center danger' onClick={handleRemove}>
                    <div className='trash-svg'/>
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