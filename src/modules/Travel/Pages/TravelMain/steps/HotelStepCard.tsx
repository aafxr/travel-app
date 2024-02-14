import React, {useEffect, useState} from "react";

import {HotelStep} from "../../../../../classes/StoreEntities/route/HotelStep";
import {useTravel} from "../../../../../contexts/AppContextProvider";
import {MS_IN_DAY} from "../../../../../static/constants";
import {StarIcon} from "../../../../../components/svg";
import {Chip} from "../../../../../components/ui";

import './ShowSteps.css'

type HotelStepCardPropsType = {
    hotel: HotelStep
}

export function HotelStepCard({hotel}: HotelStepCardPropsType){
    const travel = useTravel()
    const [start, setStart] = useState<Date>()
    const [end, setEnd] = useState<Date>()

    useEffect(() => {
        if(!travel) return

        const start = new Date(travel.date_start.getTime() + MS_IN_DAY * (hotel.day - 1) + hotel.timeStart.getTime())
        const end = new Date(start.getTime() + (hotel.timeEnd.getTime() - hotel.timeStart.getTime()))

        setStart(start)
        setEnd(end)
    }, [travel])

    return (
        <div className='step'>
            {hotel.place.photo &&
                <div className='image'>
                    <img className='img-abs' src={hotel.place.photo} alt={hotel.type}/>
                </div>
            }
            <div className='inner'>
                <div className='name'>{hotel.place.name}</div>
                <div className='stats'>
                    <div className='rate'>{hotel.place.rate || ''} <StarIcon className='icon'/></div>
                    <div className='price'>{hotel.place.price || ''}&nbsp;Р</div>
                </div>
            </div>
            {start && <Chip className='start' color={'orange'}>{start.toLocaleDateString()}</Chip>}
            {end && <Chip className='end' color={'orange'}>{end.toLocaleDateString()}</Chip>}
        </div>
    )
}