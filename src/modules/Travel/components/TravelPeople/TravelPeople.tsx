import clsx from "clsx";
import React, {HTMLAttributes, useEffect, useState} from "react";

import defaultHandleError from "../../../../utils/error-handlers/defaultHandleError";
import AvatarPlaceHolder from "../../../../components/UserCard/AvatarPlaceholder";
import IconButton from "../../../../components/ui/IconButton/IconButton";
import {MemberService} from "../../../../classes/services/MemberService";
import UserCard from "../../../../components/UserCard/UserCard";
import {Member} from "../../../../classes/StoreEntities/Member";
import {PlusIcon} from "../../../../components/svg";

import './TravelPeople.css'

interface TravelPeoplePropsType extends Omit<HTMLAttributes<HTMLDivElement>, 'onClick'> {
    peopleList: string[]
    compact?: boolean
    onClick?: (member: Member) => unknown
}

/**
 * Компонент принимает массив идентификаторов пользователей и отображает информацию о пользователях
 * @function
 * @name TravelPeople
 * @param {string[]} peopleList массив id участников путешествия
 * @param {boolean} compact default = false, компактное отображение компонента
 * @param {React.HTMLAttributes<HTMLDivElement>} props other props
 * @param {Function} onClick обработка нажатия на каточку пользователя
 * @return {JSX.Element}
 * @category Components
 */
export default function TravelPeople({
                                         peopleList = [],
                                         compact = false,
                                         onClick,
                                         ...props
                                     }: TravelPeoplePropsType) {
    const [members, setMembers] = useState<Member[]>([])

    useEffect(() => {
        if(peopleList.length){
            MemberService.getManyByIds(peopleList)
                .then(setMembers)
                .catch(defaultHandleError)
        }
    }, [peopleList])

    const className = clsx('travel-details-people',
        {
            'compact row': compact,
            'column gap-0.25': !compact
        })

    /** поднятие юзер инфо в вышестоящий компонент */
    function handleUserClick(user: Member) {
        if (user && onClick) onClick(user)
    }

    return (
        <div {...props} className={className}>
            {!members.length && <AvatarPlaceHolder variant={compact ? "horizontal" : "vertical"} />}
            {
                (members.length && compact)
                    ? members.slice(0, 3).map(m => (
                        <UserCard
                            key={m.id}
                            member={m}
                            variant='compact'
                        />
                    ))
                    : members.map(m => (
                        <UserCard
                            key={m.id}
                            member={m}
                            variant='horizontal'
                            onClick={handleUserClick}
                        />
                    ))
            }
            {
                compact && !!members.length && <IconButton
                    className='travel-details-people-add'
                    icon={<PlusIcon/>}
                    bgVariant='secondary'
                    border={false}
                    shadow={false}
                />
            }
        </div>
    )
}
