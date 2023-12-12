import clsx from 'clsx'
import React, {useEffect, useRef, useState} from 'react'

import formatTime from "../../../utils/date-utils/formatTime";

import './ChipInput.css'


/**
 * компонент для отображения тегов / пометок
 * @function
 * @param {Date} value
 * @param {string} template DD - day, MM - month, YYYY - year, hh - hour, mm - minutes, ss - seconds
 * @param {(e: InputEvent<HTMLInputElement>) => unknown} onChange
 * @param {(str: string, date: Date) => unknown} onBlur
 * @param {'orange' | 'green' | 'grey' | 'light-orange' } color цвет фона компонента
 * @param {boolean} rounded - способ скругления краев, default - более прямоугольная форма
 * @param {boolean} pointer default = false
 * @param {string} className css class
 * @param props other props
 * @returns {JSX.Element}
 * @category UI-Components
 * @name ChipInput
 */
export default function ChipInput({
                                      value,
                                      template = 'hh:mm',
                                      onChange,
                                      onBlur,
                                      color = 'orange', // 'orange' | 'green' | 'grey' | 'light-orange'
                                      rounded,// boolean
                                      pointer = false,
                                      className,
                                      ...props

                                  }) {
    const [inputValue, setInputValue] = useState(/**@type {Date}*/null)
    const ref = useRef(/**@type{HTMLInputElement} */null)
    const prepared = useRef(false)

    useEffect(() => {
        if (value instanceof Date) setInputValue(value)
    }, [])

    useEffect(() => {
        if (ref.current) {
            function setFocus() {
                if (ref.current && document.activeElement !== ref.current) ref.current.focus()
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

    /** @param {ChangeEvent<HTMLInputElement> | KeyboardEvent<HTMLInputElement>} e */
    function handleChange(e) {
        setInputValue(e.target.valueAsDate)
    }

    function handleBlur() {
        const cb = onBlur ? onBlur : () => {}

        let result = formatTime(template, inputValue)
        cb(result, inputValue)
    }

    if(!inputValue) return null

    return <input
        ref={ref}
        type='time'
        // inputMode='numeric'
        size={1}
        className={classes} {...props}
        value={formatTime('hh:mm', inputValue)}
        onChange={handleChange}
        onKeyDown={handleChange}
        onBlur={handleBlur}
        step={60}
    />
}
