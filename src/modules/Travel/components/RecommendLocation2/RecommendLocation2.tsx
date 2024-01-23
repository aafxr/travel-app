import React from "react";

import durationToSting from "../../../../utils/date-utils/durationToString";
import {CarIcon} from "../../../../components/svg";

import '../RecommendLocation/RecommendLocation.css'

type RecommendLocation2PropsType = {
    to?: string
    items?: any
    moving?: number
}

/**
 * Компоонент отображает рекомендованные места в периоды между активностями
 * @param {string} to
 * @param {RecommendationItemType[]} items
 * @param {MovingType} moving
 * @returns {JSX.Element}
 * @constructor
 */
export default function RecommendLocation2({
                                               to,
                                               items,
                                               moving = 10
                                           }: RecommendLocation2PropsType) {

    if (!moving) return null

    let icon = <CarIcon/>

    return (
        <div className='recommend-location'>
            {/*{travel.timeHelper.isEqualToMorning(moving.start) && <Chip className='recommend-activity-start' color='grey'>{moving.start.toLocaleTimeString().slice(0, -3)}</Chip>}*/}
            {/*{(travel.timeHelper.isNight(moving.end) || travel.timeHelper.isEqualToEvening(moving.end))&& <Chip className='recommend-activity-end' color='grey'>{moving.end.toLocaleTimeString().slice(0, -3)}</Chip>}*/}
            <div className='column gap-0.5'>
                <div className='recommend-movement-time row gap-1'>
                    {icon}
                    <span className='title-semi-bold'>
                        {(moving / 1000).toFixed(2)} км
                        &nbsp;/&nbsp;
                        {durationToSting(moving)}
                    </span>
                </div>
            </div>
        </div>
    )
}