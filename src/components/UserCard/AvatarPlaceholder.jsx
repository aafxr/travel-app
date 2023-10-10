import clsx from "clsx";
import './AvatarPlaceholder.css'

/**
 *
 * @param {string} className default = "horizontal"
 * @param {'compact' | 'horizontal' | 'vertical'} variant default = "horizontal"
 * @returns {JSX.Element}
 * @category Components
 */
export default function AvatarPlaceHolder({className, variant = "horizontal"}) {
    const classNames = clsx(
        'avatar-placeholder gap-0.25',
        {
            'flex-stretch': variant === 'horizontal',
            'column center': variant === 'vertical',
            'row': variant === 'compact'
        },
        className
    )


    return (
        <div className={classNames}>
            <div className='avatar-placeholder-circle flex-0'/>
            {
                variant !== "compact" && (
                    <div className='flex-1 w-full'>
                        <div className='avatar-placeholder-line'/>
                        <div className='avatar-placeholder-line avatar-placeholder-line-2'/>
                    </div>
                )
            }
        </div>
    )
}
