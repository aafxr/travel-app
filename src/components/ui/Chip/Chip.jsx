import React from 'react'
import clsx from 'clsx'
import isString from "../../../utils/validation/isString";

import  './Chip.css'


/**
 * компонент для отображения тегов / пометок
 * @param {'orange' | 'green' | 'gray' | 'light-orange' } color
 * @param {string} icon - url иконки
 * @param {'left' | 'right'} iconPosition - способ расположения иконки (стиль применяется если задан icon) default = 'left'
 * @param {boolean} rounded - способ скругления краев, default - более прямоугольная форма
 * @param {boolean} pointer default = false
 * @param {JSX.Element | string | number} children
 * @param {string} className
 * @param props
 * @returns {JSX.Element}
 */
export default ({
                    color = 'orange', // 'orange' | 'green' | 'gray' | 'light-orange'
                    icon,
                    iconPosition = 'left',// 'left' | 'right'
                    children,
                    rounded,// boolean
                    pointer = false,
                    className,
                    ...props

                }) => {
    const classes = clsx(
        {
            ['chip']: true,
            ['chip-icon']: icon,
            ['chip-pointer']: pointer,
            ['chip-orange']: color === 'orange',
            ['chip-green']: color === 'green',
            ['chip-gray']: color === 'grey',
            ['chip-light-orange']: color === 'light-orange',
            ['chip-icon-left']: icon && iconPosition === 'left',
            ['chip-icon-right']: icon && iconPosition === 'right',
            ['chip-rounded']: rounded,
        },
        className
    )

    return <div className={classes} {...props}>
        {isString(icon) && <img src={icon} alt="icon"/>}
        <span>{children}</span>
    </div>
}