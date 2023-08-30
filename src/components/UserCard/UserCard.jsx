import clsx from "clsx";
import {useEffect, useState} from "react";

import AvatarPlaceHolder from "./AvatarPlaceholder";
import storeDB from "../../db/storeDB/storeDB";
import constants from "../../static/constants";
import Photo from "../Poto/Photo";

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
    const [user, setUser] = useState(null)

    useEffect(() => {
        if(id){
            storeDB.getOne(constants.store.USERS, id)
                .then(u =>  u && setUser(u))
        }
    }, [id])

    return (
        <div className={classNames(variant, className)}>
            {
                !user
                    ? <AvatarPlaceHolder variant={variant}/>
                    : (
                        <>
                            <Photo id={user.photo} className='avatar' />
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
