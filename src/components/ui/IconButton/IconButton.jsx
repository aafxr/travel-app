import clsx from "clsx";

import './IconButton.css'

/**
 * @param {JSX.Element} icon
 * @param {boolean} small
 * @param {boolean} border
 * @param {boolean} shadow
 * @param {'transparent' | 'secondary' | 'primary' | 'bg-default'} bgVariant
 * @param {string} [title]
 * @param {string} className
 * @param {string} iconClass
 * @param  props
 * @returns {JSX.Element}
 * @constructor
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
                                   }) {

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
