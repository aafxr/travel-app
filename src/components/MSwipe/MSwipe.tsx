import clsx from "clsx";
import {motion, useMotionValue} from 'framer-motion'
import React, {Children, JSX, PropsWithChildren, useEffect, useRef, useState} from "react";

import useClickOutsideOfElement from "../../hooks/useClickOutsideOfElement";

import './MSwipe.css'



interface MSwipePropsType extends PropsWithChildren {
    shift?: number
}

type MSwiperComponentsType = {
    leftElements: JSX.Element[]
    rightElements: JSX.Element[]
    bodyElements: JSX.Element[]
}


/**
 * Свайпер анимированный на основе фреймворка framer-motion
 *
 *
 * MSwiper должен содержать следующие компоненты:
 * - LeftButton
 * - RightButton
 * - Body
 *
 * @example`
 * <MSwipe shift={80}>
 *      <MSwipe.Body>body element</MSwipe.Body>
 *      <MSwipe.LeftButton>left side element</MSwipe.LeftButton>
 *      <MSwipe.RightButton>right side element</MSwipe.RightButton>
 * </MSwipe>
 * `
 * @param children
 * @param shift - максимальное значение, на которое смещатся MSwiper.Body
 * @constructor
 */
function MSwipe({children, shift}: MSwipePropsType) {
    const [elements, setElements] = useState<MSwiperComponentsType>({
        leftElements: [],
        rightElements: [],
        bodyElements: [],
    })

    const [xStart, setXStart] = useState(0)
    const [swiperRect, setSwiperRect] = useState<DOMRect>()
    const swiperRef = useRef<HTMLDivElement>(null)
    const x = useMotionValue(0)

    const clickOutside = useClickOutsideOfElement(swiperRef)

    useEffect(() => {
        const onWindowResize = () => {
            if (!swiperRef.current) return
            const rect = swiperRef.current.getBoundingClientRect()
            setSwiperRect(rect)
        }
        onWindowResize()
        window.addEventListener('resize', onWindowResize)
        return () => {
            window.removeEventListener('resize', onWindowResize)
        }
    }, [])

    useEffect(() => {
        const leftElements: JSX.Element[] = []
        const rightElements: JSX.Element[] = []
        const bodyElements: JSX.Element[] = []
        Children.forEach<React.ReactNode>(children, c => {
            if (c && typeof c === 'object' && 'type' in c) {
                if ((c as any).type?.name === "LeftButton") leftElements.push(c)
                else if ((c as any).type?.name === "RightButton") rightElements.push(c)
                else if ((c as any).type?.name === "Body") bodyElements.push(c)
            }
        })
        setElements({leftElements, rightElements, bodyElements})
    }, [children])

    useEffect(() => {
        if(clickOutside && x.get() !== 0) x.set(0)
    }, [clickOutside])

    function handleTOuchStart(e: React.TouchEvent<HTMLDivElement>) {
        if (!swiperRect || !swiperRef.current) return
        setSwiperRect(swiperRef.current.getBoundingClientRect())
        setXStart(e.touches[0].clientX)
    }

    function handleTouchMove(e: React.TouchEvent<HTMLDivElement>) {
        if (!swiperRect) return
        x.set(swiperRect.x + e.touches[0].clientX - xStart)
    }


    function handleTouchEnd(e: React.TouchEvent<HTMLDivElement>) {
        if (!swiperRect || !swiperRef.current) return
        setXStart(0)
        if(shift){
            if(-shift * 0.9 > x.get()){
                x.set(-shift)
                return
            }
            if(shift * 0.9 < x.get()){
                x.set(shift)
                return
            }
        }
        x.set(0)
    }

    return (
        <div className={'m-swipe-container'}>
            {!!elements.leftElements.length && <div >{elements.leftElements}</div>}
            {!!elements.rightElements.length && <div >{elements.rightElements}</div>}

            <motion.div
                ref={swiperRef}
                className={'m-swipe-body'}
                onTouchStart={handleTOuchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{x, transition: 'translate 0.3s'}}
            >
                {elements.bodyElements}
            </motion.div>
        </div>
    )
}

function LeftButton({children, ...props}: PropsWithChildren & React.HTMLAttributes<HTMLElement>) {
    return <div {...props} className={clsx('m-swipe-left', props.className)}>{children}</div>
}

function RightButton({children, ...props}: PropsWithChildren & React.HTMLAttributes<HTMLElement>) {
    return <div {...props} className={clsx('m-swipe-right', props.className)}>{children}</div>
}

function Body({children}: PropsWithChildren) {
    return <>{children}</>
}

export default Object.assign(MSwipe, {LeftButton, RightButton, Body})
