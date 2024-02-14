import React from "react";

import {RoadStep} from "../../../../../classes/StoreEntities/route/RoadStep";
import {CarIcon, WalkIcon} from "../../../../../components/svg";

import './ShowSteps.css'


type  RoadStepCardPropsType = {
    road: RoadStep
}

export function RoadStepCard({road}: RoadStepCardPropsType){
    let icon: JSX.Element
    if (road.distance < 1) {
        icon = <WalkIcon className='icon'/>
    } else
        icon = <CarIcon className='icon'/>

    return (
        <div className='road'>
            {road.distance.toFixed(2)}км&nbsp;/&nbsp;{formateTimeFromMinutes(road.duration)}&nbsp;{icon}
        </div>
    )
}

function formateTimeFromMinutes(time: number) {
    const hh = Math.floor(time / 60)
    const mm = time % 60
    return `${hh < 10 ? '0' + hh : hh}:${mm < 10 ? '0' + mm : mm}:00`

}