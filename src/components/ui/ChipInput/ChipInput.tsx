import clsx from 'clsx'
import React, {InputHTMLAttributes, useEffect, useRef, useState} from 'react'

import formatTime from "../../../utils/date-utils/formatTime";

import './ChipInput.css'


interface ChipInputPropsType extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'onBlur'> {
    value: Date
    onChange?: (date: Date) => unknown
    color?: 'orange' | 'green' | 'grey' | 'light-orange' | 'red'
    rounded?: boolean
    pointer?: boolean
    min?: string
    max?: string
}


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
                                      color = 'orange', // 'orange' | 'green' | 'grey' | 'light-orange'
                                      rounded,// boolean
                                      pointer = false,
                                      className,
                                      min = '00:00',
                                      max = '23:59',
                                      ...props

                                  }: ChipInputPropsType) {
    const [inputValue, setInputValue] = useState<Date | null>(null)
    const ref = useRef<HTMLInputElement>(null)


    useEffect(() => {
        setInputValue(value)
    }, [value])


    useEffect(() => {
        function setFocus() {
            if (ref.current && document.activeElement !== ref.current)
                ref.current.focus()
            document.removeEventListener('touchend', setFocus)
        }

        if (ref.current) document.addEventListener('touchend', setFocus)
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


    function handleChange(e: React.ChangeEvent<HTMLInputElement> & React.KeyboardEvent<HTMLInputElement>) {
        if (!inputValue) return

        const [hh, mm] = e.target.value.split(':')
        if (hh) inputValue.setHours(+hh)
        if (mm) inputValue.setMinutes(+mm)
        setInputValue(new Date(inputValue))
    }


    function handleBlur() {
        if(onChange && inputValue) {
            onChange(inputValue)
        }
    }

    if (!inputValue) return null

    return <input
        ref={ref}
        type='time'
        value={formatTime('hh:mm', inputValue)}
        // inputMode='numeric'
        className={classes} {...props}
        size={1}
        min={min}
        max={max}
        step={60}
        onChange={handleChange}
        onKeyDown={handleChange}
        onBlur={handleBlur}
    />
}

