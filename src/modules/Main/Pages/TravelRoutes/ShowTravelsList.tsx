import React from "react";
import {useNavigate} from "react-router-dom";

import TravelCard from "../../../Travel/components/TravelCard/TravelCard";
import IconButton from "../../../../components/ui/IconButton/IconButton";
import {useUser} from "../../../../contexts/AppContextProvider";
import {Travel} from "../../../../classes/StoreEntities";

type ShowTravelsListPropsType = {
    travels: Travel[]
    onRemove?: (travel: Travel) => unknown
}

export function ShowTravelsList({travels, onRemove}: ShowTravelsListPropsType) {
    const user = useUser()
    const navigate = useNavigate()


    if (user)
        return (
            <ul className='column gap-1'>
                {
                    travels.map(t => (
                        <li key={t.id}>
                            <TravelCard
                                travel={t}
                                onRemove={() => onRemove && onRemove(t)}
                            />
                        </li>
                    ))
                }
            </ul>
        )

    return (
        <IconButton
            border={false}
            title='Авторизоваться'
            className='link'
            onClick={() => navigate('/login/')}
        />
    )
}