import clsx from "clsx";

import './IconButton.css'

/**
 * @param {JSX.Element} icon
 * @param {boolean} small
 * @param {boolean} border
 * @param {boolean} shadow
 * @param {'transparent' | 'secondary' | 'primary'} bgVariant
 * @param {string} [title]
 * @param {string} className
 * @param props
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
            'shadow': shadow,
        },
        className)

    return (
        <button {...props} className={classes}>
            <div className='flex-stretch gap-0.25'>
                {!!icon && (
                    <div className='icon flex-0'>{icon}</div>
                )}
                {title}
            </div>

        </button>
    )


}