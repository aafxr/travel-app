import React from "react";

import {PlaceStep} from "../../../../../classes/StoreEntities/route/PlaceStep";
import {Chip} from "../../../../../components/ui";

import './ShowSteps.css'


type PlaceStepCardPropsType = {
    place: PlaceStep
    timeLabels?: boolean
}
export function PlaceStepCard({place, timeLabels = true}: PlaceStepCardPropsType){
    return (
        <div className='step'>
            {place.place.photo &&
                <div className='image'>
                    <img className='img-abs' src={place.place.photo} alt={place.type}/>
                </div>
            }
            <div className='inner'>
                <div className='name'>{place.place.name}</div>
                <div className='stats'>
                    <div className='price'>{place.price || ''}</div>
                    <div className='duration'>{place.duration}<span>мин</span></div>
                </div>
            </div>
            {timeLabels && <Chip className='start' color={'orange'}>{place.timeStart.toLocaleTimeString().slice(0, 5)}</Chip>}
            {timeLabels && <Chip className='end' color={'orange'}>{place.timeEnd.toLocaleTimeString().slice(0, 5)}</Chip>}
        </div>
    )
}