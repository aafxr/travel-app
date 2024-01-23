import clsx from 'clsx'
import React, {HTMLAttributes, PropsWithChildren} from 'react'


import './Chip.css'

interface ChipPropsType extends PropsWithChildren<HTMLAttributes<HTMLDivElement>> {
    color?: 'orange' | 'green' | 'grey' | 'light-orange' | 'red'
    icon?: string | JSX.Element
    iconPosition?: 'left' | 'right'
    rounded?: boolean
    pointer?: boolean
}

/**
 * компонент для отображения тегов / пометок
 * @function
 * @param {'orange' | 'green' | 'grey' | 'light-orange' | 'red' } color цвет фона компонента
 * @param {string | JSX.Element} icon - url иконки
 * @param {'left' | 'right'} iconPosition - способ расположения иконки (стиль применяется если задан icon) default = 'left'
 * @param {boolean} rounded - способ скругления краев, default - более прямоугольная форма
 * @param {boolean} pointer default = false
 * @param {JSX.Element | string | number} children child react element
 * @param {string} className css class
 * @param props other props
 * @returns {JSX.Element}
 * @category UI-Components
 * @name Chip
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

                             }: ChipPropsType) {
    const classes = clsx(
        {
            ['chip gap-0.25']: true,
            ['chip-with-icon']: icon,
            ['chip-pointer']: pointer,
            ['chip-orange']: color === 'orange',
            ['chip-green']: color === 'green',
            ['chip-grey']: color === 'grey',
            ['chip-red']: color === 'red',
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
                    typeof icon === 'string'
                        ? <img src={icon} alt="icon"/>
                        : icon
                }
            </span>
        )}
        <span>{children}</span>
    </div>
}