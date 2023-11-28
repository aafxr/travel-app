import React from "react";
import {Link} from "react-router-dom";

import {BusIcon, CarIcon, PlusIcon, WalkIcon} from "../../../../components/svg";
import ChevronRightIcon from "../../../../components/svg/ChevronRightIcon";
import IconButton from "../../../../components/ui/IconButton/IconButton";
import RecommendationCard from "../RecomendationCard/RecommendationCard";
import useTravelContext from "../../../../hooks/useTravelContext";
import MapIcon from "../../../../components/svg/MapIcon";
import Activity from "../../../../classes/Activity";
import {Chip} from "../../../../components/ui";

import './RecommendLocation.css'


/**
 * Компоонент отображает рекомендованные места в периоды между активностями
 * @param {string} to
 * @param {RecommendationItemType[]} items
 * @param {Activity} activity
 * @returns {JSX.Element}
 * @constructor
 */
export default function RecommendLocation({
                                              to,
                                              items,
                                              activity
}) {
    const {travel} = useTravelContext()

    if (!activity) return null

    let icon
    switch (activity.status) {
        case Activity.PUBLIC_TRANSPORT:
            icon = <BusIcon/>
            break
        case Activity.WALK:
            icon = <WalkIcon/>
            break
        default:
            icon = <CarIcon/>
    }

    return (
        <div className='recommend-location'>
            {/*{time_start && <Chip className='location-date-start'>{activity.start.toLocaleTimeString().slice(0, -3)}</Chip>}*/}
            {activity.isEndAtNight() && <Chip className='recommend-activity-end'>{activity.end.toLocaleTimeString().slice(0, -3)}</Chip>}
            <IconButton
                className='recommend-location-add'
                icon={<PlusIcon/>}
                bgVariant='bg-default'
                border={false}
                shadow
            />
            <div className='column gap-0.5'>
                <div className='recommend-movement-time row gap-1'>
                    {icon}
                    <span className='title-semi-bold'>
                        {(activity.distance / 1000).toFixed(2)} км
                        &nbsp;/&nbsp;
                        {activity.toTimeStingFormat()}
                    </span>
                </div>
                <Link className='travel-link' to={`/travel/${travel.id}/map/`}>
                    <div className='icon'>
                        <MapIcon/>
                    </div>
                    Указать на карте <ChevronRightIcon/>
                </Link>
                <RecommendationCard to={to} items={items}/>
            </div>
        </div>
    )
}