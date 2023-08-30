import clsx from 'clsx'
import React from 'react'

import isString from "../../../utils/validation/isString";

import './Chip.css'


/**
 * компонент для отображения тегов / пометок
 * @param {'orange' | 'green' | 'grey' | 'light-orange' } color
 * @param {string | JSX.Element} icon - url иконки
 * @param {'left' | 'right'} iconPosition - способ расположения иконки (стиль применяется если задан icon) default = 'left'
 * @param {boolean} rounded - способ скругления краев, default - более прямоугольная форма
 * @param {boolean} pointer default = false
 * @param {JSX.Element | string | number} children
 * @param {string} className
 * @param props
 * @returns {JSX.Element}
 */
export default function Chip({
                                 color = 'orange', // 'orange' | 'green' | 'grey' | 'light-orange'
                                 icon,
                                 iconPosition = 'left',// 'left' | 'right'
                                 children,
                                 rounded,// boolean
                                 pointer = false,
                                 className,
                                 ...props

                             }) {
    const classes = clsx(
        {
            ['chip gap-0.25']: true,
            ['chip-with-icon']: icon,
            ['chip-pointer']: pointer,
            ['chip-orange']: color === 'orange',
            ['chip-green']: color === 'green',
            ['chip-grey']: color === 'grey',
            ['chip-light-orange']: color === 'light-orange',
            ['chip-icon-left']: icon && iconPosition === 'left',
            ['chip-icon-right']: icon && iconPosition === 'right',
            ['chip-rounded']: rounded,
        },
        className
    )

    return <div className={classes} {...props}>
        {icon && (
            <span className='chip-icon'>
                {
                    isString(icon)
                        ? <img src={icon} alt="icon"/>
                        : icon
                }
            </span>
        )}
        <span>{children}</span>
    </div>
}