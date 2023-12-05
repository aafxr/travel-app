import clsx from 'clsx'
import React, {useEffect, useRef, useState} from 'react'

import './ChipInput.css'


/**
 * компонент для отображения тегов / пометок
 * @function
 * @param {string} value
 * @param {(e: InputEvent<HTMLInputElement>) => unknown} onChange
 * @param {(str: string) => unknown} onBlur
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
                                      onChange,
                                      onBlur,
                                      color = 'orange', // 'orange' | 'green' | 'grey' | 'light-orange'
                                      rounded,// boolean
                                      pointer = false,
                                      className,
                                      ...props

                                  }) {
    const [inputValue, setInputValue] = useState('')
    const ref = useRef(/**@type{HTMLInputElement} */null)
    const preparede = useRef(false)

    useEffect(() => {
        if (ref.current) {
            function setFocus() {
                if (ref.current && document.activeElement !== ref.current) ref.current.focus()
                document.removeEventListener('touchend', setFocus)
            }

            if (value) setInputValue(value)
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

    /** @param {InputEvent | KeyboardEvent<HTMLInputElement>} e */
    function handleChange(e) {
        const {type} = e
        if(type === 'keydown' && e.code === 'Backspace'){
            setInputValue(inputValue.slice(0, -1))
            preparede.current = true
        } else if(!preparede.current && type === 'change') {
            const result = e.target.value.length < 2 && /^[3-9]|[0-2][0-9]/.test(e.target.value)
                ? e.target.value + ':'
                : e.target.value
            setInputValue(result)
        } else{
            preparede.current = false
        }
    }

    function handleBlur() {
        const cb = onBlur ? onBlur : () => {
        }
        let result = inputValue
            .trim()
            .replace(/(?<=[0-9]|[0-2][0-9])[- :]+/, ':')
            .split(':')
            .map(s => s.length === 1 ? '0' + s : s)
            .join(':')

        const reg = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
        if (reg.test(result))
            cb(result)
        else
            cb(value)
    }

    return <input
        ref={ref}
        type='text'
        inputMode='numeric'
        size={1}
        className={classes} {...props}
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleChange}
        onBlur={handleBlur}
    />
}