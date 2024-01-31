import clsx from "clsx";
import {useSwipeable} from "react-swipeable";
import React, {PropsWithChildren, useEffect, useState} from "react";

import useOutside from "../../../hooks/useOutside";
import {CheckIcon, TrashIcon} from "../../svg";

import './Swipe.css'

let defaultMargin = 40

interface SwipePropsType extends PropsWithChildren{
    className?: string
    onClick?: Function
    onRemove?: Function
    onConfirm?: Function
    marginMax?: number
    small?: boolean
    leftButton?: boolean
    leftElement?: JSX.Element
    lElemBg?: string
    rightButton?: boolean
    rightElement?: JSX.Element
    rElemBg?: string
    multy?:boolean
}


/**
 * Компонент позволяет обернуть дочерний компонент и добавляет возможность свайпать элемент
 * @kind component
 * @function
 * @param {React.ReactNode} children react child element
 * @param {string} [className] css class
 * @param {function} [onClick] callback, вызывается при нажатии на дочерний элемент
 * @param {function} [onRemove] callback, вызывает при клике по кнопке "удалить"
 * @param {function} [onConfirm] callback, вызывает при клике по кнопке "Подтвердить"
 * @param {number} [marginMax] default = var(--x) * 2 || 40
 * @param {boolean} [small] флаг, добавляет css class "small" (уменьшает размер шрифта)
 * @param {boolean} [leftButton] флаг, добавляет кнопку слева и возможность делать свайп в право
 * @param {JSX.Element} [leftElement] компоненты, которые будут отображаться на месте иконок слева
 * @param {string} [lElemBg] css class для задания фона для кнопки слева
 * @param {boolean} [rightButton] флаг, добавляет кнопку спарава и возможность делать свайп в лево
 * @param {JSX.Element} [rightElement] компоненты, которые будут отображаться на месте иконок справа
 * @param {string} [rElemBg] css class для задания фона для кнопки справа
 * @param {boolean} [multy] default = false, дает возможность свайпа нескольких элементов (по умолчанию,
 * при взаимодействии с другими элементами, компонент возвращается в исходное состаяние)
 * @returns {JSX.Element}
 * @category UI-Components
 * @name Swipe
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
                              }: SwipePropsType) {
    const [marginLeft, setMarginLeft] = useState(0)
    const {ref} = useOutside<HTMLDivElement>(false, setMarginLeft)//.bind(this, 0)!!!!!!!!!!!!!!!!!!!!!!!!!!!

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
        function touchOutside(e: TouchEvent ) {
            if (e.target instanceof Node && ref.current && !ref.current.contains(e.target)) {
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
        setMarginLeft(0)
        onRemove && onRemove()
    }

    function handleClick(e:React.TouchEvent | React.MouseEvent) {
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
                        clsx('swiper-button swiper-button-left center flex-0',
                            lElemBg ? lElemBg : 'success')} onClick={handleConfirm}>
                        <div>
                            {
                                leftElement
                                    ? leftElement
                                    : <div className='checkmark-svg'><CheckIcon/></div>
                            }
                        </div>
                    </div>
                    <div className={
                        clsx(
                        'swiper-button swiper-button-right center flex-0',
                            rElemBg ? rElemBg : 'danger')} onClick={handleRemove}>
                        <div>
                            {
                                rightElement
                                    ? rightElement
                                    : <div className='trash-svg'><TrashIcon/></div>
                            }
                        </div>
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