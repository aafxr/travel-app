import clsx from 'clsx'
import React, {useEffect, useRef, useState} from 'react'

import formatTime from "../../../utils/date-utils/formatTime";

import './ChipInput.css'


/**
 * компонент для отображения тегов / пометок
 * @function
 * @param {Date} value
 * @param {(e: InputEvent<HTMLInputElement>) => unknown} onChange
 * @param {(str: string, date: Date) => unknown} onBlur
 * @param {'orange' | 'green' | 'grey' | 'light-orange' } color цвет фона компонента
 * @param {boolean} rounded - способ скругления краев, default - более прямоугольная форма
 * @param {boolean} pointer default = false
 * @param {string} className css class
 * @param {string} min 00:00
 * @param {string} max 23:59
 * @param props other props
 * @returns {JSX.Element}
 * @category UI-Components
 * @name ChipInput
 */
export default function ChipInput({
                                      value,
                                      onChange,
                                      onBlur,
                                      color = 'orange', // 'orange' | 'green' | 'grey' | 'light-orange'
                                      rounded,// boolean
                                      pointer = false,
                                      className,
                                      min = '00:00',
                                      max = '23:59',
                                      ...props

                                  }) {
    const [inputValue, setInputValue] = useState(/**@type {Date}*/null)
    const ref = useRef(/**@type{HTMLInputElement} */null)
    const prepared = useRef(false)

    useEffect(() => {
        if (value instanceof Date) setInputValue(value)
    }, [value])

    useEffect(() => {
        if (ref.current) {
            function setFocus() {
                if (ref.current && document.activeElement !== ref.current)
                    ref.current.focus()
                document.removeEventListener('touchend', setFocus)
            }

            document.addEventListener('touchend', setFocus)
        }
    }, [ref.current])


    const classes = clsx(
        {
            ['chip-input gap-0.25']: true,
            ['chip-input-pointer']: pointer,
            ['chip-input-orange']: color === 'orange',
            ['chip-input-green']: color === 'green',
            ['chip-input-grey']: color === 'grey',
            ['chip-input-light-orange']: color === 'light-orange',
            ['chip-input-rounded']: rounded,
        },
        className
    )

    /** @param {ChangeEvent<HTMLInputElement>} e */
    function handleChange(e) {
        const [hh, mm] = e.target.value.split(':')
        if (hh) inputValue.setHours(+hh)
        if (mm) inputValue.setMinutes(+mm)
        setInputValue(new Date(inputValue))
    }

    function handleBlur() {
        const cb = onBlur ? onBlur : () => {
        }

        let result = formatTime('hh:mm', inputValue)
        cb(result, inputValue)
    }

    if (!inputValue) return null

    return <input
        ref={ref}
        type='time'
        // inputMode='numeric'
        size={1}
        className={classes} {...props}
        min={min}
        max={max}
        value={formatTime('hh:mm', inputValue)}
        onChange={handleChange}
        onKeyDown={handleChange}
        onBlur={handleBlur}
        step={60}
    />
}

