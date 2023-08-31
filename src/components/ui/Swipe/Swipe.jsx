import clsx from "clsx";
import {useSwipeable} from "react-swipeable";
import React, {useEffect, useState} from "react";

import useOutside from "../../../hooks/useOutside";
import TrashIcon from "../../svg/TrashIcon";
import CheckIcon from "../../svg/CheckIcon";

import './Swipe.css'

let defaultMargin = 40


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
 * @param {JSX.Element} [leftElement]
 * @param {string} [lElemBg]
 * @param {boolean} [rightButton]
 * @param {JSX.Element} [rightElement]
 * @param {string} [rElemBg]
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
                                  leftElement,
                                  lElemBg,
                                  rightButton,
                                  rightElement,
                                  rElemBg,

                                  multy = false
                              }) {
    const [marginLeft, setMarginLeft] = useState(0)
    const {ref} = useOutside(false, setMarginLeft.bind(this, 0))

    useEffect(() => {
        defaultMargin = parseInt(getComputedStyle(document.head).getPropertyValue('--x')) * 2 || 40
    }, [])


    const max = (marginMax || defaultMargin)
    const marginThreshold = max * 8 / 10;

    const handlers = useSwipeable({
        onSwiped() {
            if (Math.abs(marginLeft) < marginThreshold) {
                setMarginLeft(0)
            } else if (marginLeft > marginThreshold) {
                leftButton && onConfirm && onConfirm()
                setMarginLeft(0)
            }
        },
        onSwiping(e) {
            if (e.dir === 'Left') {
                rightButton && setMarginLeft(-Math.min(e.absX, marginMax || defaultMargin))
                marginLeft > 0 && max - e.absX > 0 && setMarginLeft(0)
            } else if (e.dir === 'Right') {
                leftButton && setMarginLeft(Math.min(e.absX, marginMax || defaultMargin))
                marginLeft < 0 && max - e.absX > 0 && setMarginLeft(0)
            }
        },
        onSwipedLeft(e) {
            rightButton && setMarginLeft(e.absX > marginThreshold ? -max : 0)
        },
        onSwipedRight(e) {
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
    }, [multy])


    function handleConfirm() {
        onConfirm && onConfirm()
    }

    function handleRemove() {
        onRemove && onRemove()
    }

    function handleClick(e) {
        if (e.eventPhase === Event.BUBBLING_PHASE) {
            e.stopPropagation()
            onClick && onClick()
        }
    }


    const styles = clsx(
        'swiper-container',
        {
            'small': small,
        },
        className
    )


    const classNames = clsx(
        'swiper-controls ',
        {
            [lElemBg ? lElemBg : 'success']: leftButton && marginLeft > 0,
            [rElemBg ? rElemBg : 'danger']: rightButton && marginLeft < 0
        }
    )


    return (
        <div ref={ref} className={styles}>
            <div className={classNames}>
                <div className='flex-between h-full'>
                    <div className={
                        clsx('swiper-button swiper-button-left center flex-1',
                            lElemBg ? lElemBg : 'success')} onClick={handleConfirm}>
                        {
                            leftElement
                                ? leftElement
                                : <div className='checkmark-svg'><CheckIcon/></div>
                        }
                    </div>
                    <div className={
                        clsx(
                        'swiper-button swiper-button-right center flex-1',
                            rElemBg ? rElemBg : 'danger')} onClick={handleRemove}>
                        {
                            rightElement
                                ? rightElement
                                : <div className='trash-svg'><TrashIcon/></div>
                        }
                    </div>
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