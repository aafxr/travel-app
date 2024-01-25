import clsx from "clsx";
import {useEffect, useState} from "react";

import defaultHandleError from "../../utils/error-handlers/defaultHandleError";
import {Member} from "../../classes/StoreEntities/Member";
import AvatarPlaceHolder from "./AvatarPlaceholder";
import {StoreName} from "../../types/StoreName";
import Photo from "../Photo/Photo";
import {DB} from "../../classes/db/DB";
import './UserCard.css'


type UserCardPropsType = {
    className?: string
    id: string
    variant?: 'compact' | 'horizontal' | 'vertical'
    onClick?: (member: Member) => unknown
}

/**
 * компонент осуществляет поиск или пытается загрузить инфо о юзере
 * @param className css class
 * @param id - идентификатор пользователя
 * @param variant default = "horizontal"
 * @param onClick - проп-функция (принимает инфо о юзере), генерируется при клике по карточке пользователя
 * @return {JSX.Element}
 * @category Components
 */
export default function UserCard({
                                     className,
                                     id,
                                     variant = 'horizontal',
                                     onClick,
                                 }: UserCardPropsType) {
    const [user, setUser] = useState<Member | null>(null)

    useEffect(() => {
        DB.getOne<Member>(StoreName.USERS, id)
            .then((member) => {
                if (member) setUser(new Member(member))
            })
            .catch((e) => defaultHandleError(e, `Пользователь с id="${id}" не найден`))
    }, [id])

    function handleUserCardClick() {
        if (user) {
            onClick && onClick(user)
        }
    }

    return (
        <div className={classNames(variant, className)} onClick={handleUserCardClick}>
            {
                !user
                    ? <AvatarPlaceHolder variant={variant}/>
                    : (
                        <>
                            <Photo src={user.imageURL} className='avatar'/>
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

const classNames = (variant: UserCardPropsType['variant'], className?: string) => clsx('user-card',
    {
        'flex-stretch gap-0.5': variant === 'horizontal',
        'column gap-0.5': variant === 'vertical',
        'compact': variant === 'compact'
    },
    className
)
