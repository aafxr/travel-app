import React from "react";
import clsx from "clsx";

import UserCard from "../../../../components/UserCard/UserCard";
import {PlusIcon} from "../../../../components/svg";
import IconButton from "../../../../components/ui/IconButton/IconButton";

import './TravelPeople.css'

/**
 *
 * @param {boolean} compact
 * @param {React.HTMLAttributes} props
 * @return {JSX.Element}
 * @constructor
 */
export default function TravelPeople({compact = false, ...props}){

    return (
        <div {...props} className={clsx('travel-details-people', {
            'compact row': compact,
            'column gap-0.25': !compact
        })}>
            <UserCard name='Иван' role='админ' status='в поездке'
                      vehicle={process.env.PUBLIC_URL + '/icons/directions_car.svg'}
                      avatarURL={process.env.PUBLIC_URL + '/images/Ellipse 4.png'}
                      compact={compact}
            />
            <UserCard name='Иван' role='админ' status='в поездке'
                      vehicle={process.env.PUBLIC_URL + '/icons/directions_car.svg'}
                      avatarURL={process.env.PUBLIC_URL + '/images/Ellipse 4.png'}
                      compact={compact}
            />
            <UserCard name='Иван' role='админ' status='в поездке'
                      vehicle={process.env.PUBLIC_URL + '/icons/directions_car.svg'}
                      avatarURL={process.env.PUBLIC_URL + '/images/Ellipse 4.png'}
                      compact={compact}
            />
            <UserCard name='Иван' role='админ' status='в поездке'
                      vehicle={process.env.PUBLIC_URL + '/icons/directions_car.svg'}
                      avatarURL={process.env.PUBLIC_URL + '/images/Ellipse 4.png'}
                      compact={compact}
            />
            {
                compact && <IconButton className='travel-details-people-add' icon={<PlusIcon />} bgVariant='secondary' border={false} shadow={false}/>
            }
        </div>
    )
}