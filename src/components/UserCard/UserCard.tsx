import clsx from "clsx";

import PhotoComponent from "../PhotoComponents/PhotoComponent";
import {useTravel} from "../../contexts/AppContextProvider";
import {Member} from "../../classes/StoreEntities";

import './UserCard.css'


type UserCardPropsType = {
    className?: string
    member: Member
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
                                     member,
                                     variant = 'horizontal',
                                     onClick,
                                 }: UserCardPropsType) {
    const travel = useTravel()

    function handleUserCardClick() {
        onClick && onClick(member)
    }

    if (!travel) return null

    return (
        <div className={classNames(variant, className)} onClick={handleUserCardClick}>
            <div  className='avatar'>
                <PhotoComponent item={member} className='img-abs' />
            </div>
            {variant !== 'compact' && (
                <>
                    <div className='user-card-info column'>
                        <div className='user-card-name'>
                            {member.first_name}&nbsp;
                            {/*{!!vehicle && <img src={vehicle} alt='vehicle'/>}*/}
                        </div>
                        {/* статус юзера (в поездке / на месте ...)*/}
                        {/*<div className='user-card-status'>{}</div>*/}
                    </div>
                    <div className='user-card-role flex-0'>{travel.getMemberRole(member)}</div>
                </>
            )}
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
