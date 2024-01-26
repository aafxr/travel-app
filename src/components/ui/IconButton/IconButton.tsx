import clsx from "clsx";

import './IconButton.css'
import {ButtonHTMLAttributes, HTMLAttributes, PropsWithChildren} from "react";

interface IconButtonPropsType extends PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>{
    icon?:JSX.Element
    small?:boolean
    border?: boolean
    shadow?: boolean
    bgVariant?: 'transparent' | 'secondary' | 'primary' | 'bg-default'
    title?:string
    iconClass?:string
}


/**
 * Компонент-кнопка с иконкой
 * @kind component
 * @function
 * @param {JSX.Element} icon иконка кнопки
 * @param {boolean} small варриант кнопки (true - более компактная)
 * @param {boolean} border default = true, флаг добавляет border
 * @param {boolean} shadow default = false, флаг добавляет тень кнопке
 * @param {'transparent' | 'secondary' | 'primary' | 'bg-default'} bgVariant вариант заднего фона
 * @param {string} [title] надпись на кнопке
 * @param {string} className css class css-класс для стилей кнопки
 * @param {string} iconClass css-класс для стилей иконки
 * @param  props other props
 * @returns {JSX.Element}
 * @category UI-Components
 * @name IconButton
 */

export default function IconButton({
                                       icon,
                                       small,
                                       border = true,
                                       shadow = false,
                                       bgVariant = 'transparent',
                                       title = '',
                                       className,
                                       iconClass,
                                       ...props
                                   }: IconButtonPropsType) {

    const classes = clsx('icon-button',
        {
            'center': !title,
            'small': small,
            'border': border,
            'bg-transparent': bgVariant === 'transparent',
            'bg-secondary': bgVariant === 'secondary',
            'bg-primary': bgVariant === 'primary',
            'bg-default': bgVariant === 'bg-default',
            'shadow': shadow,
        },
        className)

    return (
        <button {...props} className={classes}>
            <div className='flex-stretch gap-0.25'>
                {!!icon && (
                    <div className={clsx('icon flex-0', iconClass)}>{icon}</div>
                )}
                {title}
            </div>
        </button>
    )
}
