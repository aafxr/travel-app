import clsx from "clsx";

import AvatarPlaceHolder from "./AvatarPlaceholder";
import Avatar from "../Avatar/Avatar";

import useUserInfo from "../../hooks/useUserInfo";
import {DEFAULT_IMG_URL} from "../../static/constants";
import './UserCard.css'


/**
 *
 * @param {string} className
 * @param {string} id
 * @param {'compact' | 'horizontal' | 'vertical'} variant default = "horizontal"
 * @return {JSX.Element}
 * @constructor
 */
export default function UserCard({className, id, variant = 'horizontal'}) {
    const {user, photo, loading} = useUserInfo(id)

    return (
        <div className={classNames(variant, className)}>
            {
                loading
                    ? <AvatarPlaceHolder variant={variant}/>
                    : (
                        <>
                            <Avatar className='flex-0' src={photo ? photo.src || photo.blob : DEFAULT_IMG_URL}
                                    alt='avatar'/>
                            {variant !== 'compact' && (
                                <>
                                    <div className='user-card-info column'>
                                        <div className='user-card-name'>
                                            {user.first_name}&nbsp;
                                            {/*{!!vehicle && <img src={vehicle} alt='vehicle'/>}*/}
                                        </div>
                                        {/* статус юзера (в поездке / на месте ...)*/}
                                        {/*{!!status && <div className='user-card-status'>{status}</div>}*/}
                                    </div>
                                    {/*{!!role && <div className='user-card-role flex-0'>{role}</div>}*/}
                                </>
                            )}
                        </>
                    )
            }
        </div>
    )
}

const classNames = (variant, className) => clsx('user-card',
    {
        'flex-stretch gap-0.5': variant === 'horizontal',
        'column gap-0.5': variant === 'vertical',
        'compact': variant === 'compact'
    },
    className
)
