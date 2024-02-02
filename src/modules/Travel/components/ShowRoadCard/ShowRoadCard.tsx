import {JSX} from "react";

import {AirplaneIcon, BusIcon, CarIcon, WalkIcon} from "../../../../components/svg";
import durationToSting from "../../../../utils/date-utils/durationToString";
import {MovementType} from "../../../../types/MovementType";
import {Road} from "../../../../classes/StoreEntities";

import './ShowRoadCard.css'

type ShowRoadCardPropsType = {
    road: Road
}

const formatter = Intl.NumberFormat('RU-ru', {maximumFractionDigits: 3,})

export default function ShowRoadCard({road}: ShowRoadCardPropsType) {
    let icon: JSX.Element
    switch (road.movementType) {
        case MovementType.WALK :
            icon = <WalkIcon className='icon'/>
            break
        case MovementType.CAR :
            icon = <CarIcon className='icon'/>
            break
        case MovementType.TAXI :
            icon = <BusIcon className='icon'/>
            break
        case MovementType.PUBLIC_TRANSPORT :
            icon = <BusIcon className='icon'/>
            break
        case MovementType.FLIGHT :
            icon = <AirplaneIcon className='icon'/>
            break
        default:
            icon = <CarIcon className='icon'/>
    }


    return (
        <div className='road-card'>
            <div className='title-semi-bold center distance'>
                {formatter.format(road.distance)}&nbsp;км&nbsp;/&nbsp;
                {durationToSting(road.time_end.getTime() - road.time_start.getTime())}&nbsp;
                {icon}
            </div>

        </div>

    )
}