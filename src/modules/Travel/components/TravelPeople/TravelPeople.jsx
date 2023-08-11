import React from "react";
import UserCard from "../UserCard/UserCard";
import clsx from "clsx";

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
            'compact': compact,
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
        </div>
    )
}