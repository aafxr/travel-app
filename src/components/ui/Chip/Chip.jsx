import React from 'react'
import clsx from 'clsx'
import st  from './Chip.module.css'
import isString from "../../../utils/validation/isString";


/**
 * компонент для отображения тегов / пометок
 * @param {'orange' | 'green' | 'gray' | 'light-orange'} color
 * @param {string} icon - url иконки
 * @param {'left' | 'right'} iconPosition - способ расположения иконки (стиль применяется если задан icon) default = 'left'
 * @param {boolean} rounded - способ скругления краев, default - более прямоугольная форма
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
    className,
    ...props

})=>{
    const classes = clsx({
        [st.chip]: true,
        [st.icon]: icon,
        [st.orange]: color === 'orange',
        [st.green]: color === 'green',
        [st['gray']]: color === 'grey',
        [st['light-orange']]: color === 'light-orange',
        [st['icon-left']]: icon && iconPosition === 'left',
        [st['icon-right']]: icon && iconPosition === 'right',
        [st.rounded]: rounded,
        className
    })

    return <div className={classes} {...props}>
        {isString(icon) && <img src={icon} alt="icon"/> }
        {children}
    </div>
}