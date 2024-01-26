import clsx from "clsx";
import React, {useEffect, useState} from "react";

import IconButton from "../ui/IconButton/IconButton";
import {PlusIcon, MinusIcon} from "../svg";

import './Counter.css'

type CounterPropsType = {
    init?: number,
    min?:number,
    max?:number,
    onChange?: (value: number) => unknown ,
    valueClassName?: string
}

/**
 * Компонент-Счетчик,
 * @param {number} initialValue - начальное значение
 * @param {number} min - минимум
 * @param {number} max - максимум
 * @param {string} valueClassName
 * @param {Function} onChange - принимает текущее значение счетчика
 * @category Components
 */
export default function Counter({
                                    init,
                                    min,
                                    max,
                                    onChange,
                                    valueClassName
                                }: CounterPropsType) {
    const [value, setValue] = useState(0)

    /*** инициализация счетчика */
    useEffect(() => {
        if (init) setValue(init)
    }, [])

    /*** увелличение счетчика */
    function handleIncrement() {
        if (max && max <= value) return
        setValue(value + 1)
        onChange && onChange(value + 1)
    }

    /*** уменьшение счетчика */
    function handleDecrement() {
        if (min && min >= value) return
        setValue(value - 1)
        if (onChange) onChange(value - 1)
    }


    return (
        <span className='flex-between center'>
            <IconButton
                className='counter-button'
                iconClass='counter-button-icon'
                icon={<MinusIcon/>}
                small
                border={false}
                shadow={true}
                onClick={handleDecrement}
                disabled={typeof min === 'number' ? value <= min : false}
            />
            <span className={clsx('counter-value', valueClassName)}>
            {value}
            </span>
            <IconButton
                className='counter-button'
                iconClass='counter-button-icon'
                icon={<PlusIcon/>}
                small
                border={false}
                shadow={true}
                onClick={handleIncrement}
                disabled={typeof max === 'number' ? value >= max : false}
            />
        </span>
    )
}