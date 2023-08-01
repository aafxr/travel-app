import './IconButton.css'

/**
 * @param {JSX.Element} icon
 * @param {boolean} small
 * @param {string} [title]
 * @param {string} className
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
import clsx from "clsx";

export default function IconButton({icon, small, title = '', className, ...props}) {

    const classes = clsx('icon-button',
        {
            'center': !title,
            'small': small
        },
        className)

    return (
        <button {...props} className={classes}>
            <div className='flex-stretch gap-0.5'>
                {!!icon && (
                    <div className='icon no-resize'>{icon}</div>
                )}
                {title}
            </div>

        </button>
    )


}