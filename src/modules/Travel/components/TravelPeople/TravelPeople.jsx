import React from "react";
import clsx from "clsx";

import UserCard from "../../../../components/UserCard/UserCard";
import {PlusIcon} from "../../../../components/svg";
import IconButton from "../../../../components/ui/IconButton/IconButton";

import './TravelPeople.css'

/**
 * Компонент принимает массив идентификаторов пользователей и отображает информацию о пользователях
 * @param {string[]} peopleList массив id участников путешествия
 * @param {boolean} compact
 * @param {React.HTMLAttributes<HTMLDivElement>} props
 * @param {Function} onClick -
 * @return {JSX.Element}
 * @constructor
 */
export default function TravelPeople({
                                         peopleList = [],
                                         compact = false,
                                         onClick,
                                         ...props
                                     }) {
    /**
     * поднятие юзер инфо в вышестоящий компонент
     * @param {UserAppType} user
     */
    function handleUserClick(user) {
        if (user && onClick) onClick(user)
    }

    return (
        <div {...props} className={clsx('travel-details-people', {
            'compact row': compact,
            'column gap-0.25': !compact
        })}>
            {
                (peopleList && peopleList.length) && compact
                    ? peopleList.slice(0, 3).map(p => (
                        <UserCard
                            key={p}
                            id={p}
                            variant='compact'
                        />
                    ))
                    : peopleList.map(p => (
                        <UserCard
                            key={p}
                            id={p}
                            variant='horizontal'
                            onClick={handleUserClick}
                        />
                    ))
            }
            {
                compact && !!peopleList.length && <IconButton
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
