import clsx from "clsx";
import React, {useEffect, useState} from "react";

import IconButton from "../ui/IconButton/IconButton";
import {PlusIcon, MinusIcon} from "../svg";

import './Counter.css'

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
                                    initialValue,
                                    min,
                                    max,
                                    onChange,
    valueClassName
                                }) {
    const [value, setValue] = useState(0)

    /*** инициализация счетчика */
    useEffect(() => {
        if (initialValue) setValue(initialValue)
    }, [initialValue])

    // обработчики =====================================================================================================
    /*** увелличение счетчика */
    function handleIncrement() {
        setValue(value + 1)
        onChange && onChange(value + 1)
    }

    /*** уменьшение счетчика */
    function handleDecrement() {
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