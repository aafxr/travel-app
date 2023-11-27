import {useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";

import LocationCard from "../../components/LocationCard/LocationCard";
import RestTimeActivity from "../../../../classes/RestTimeActivity";
import Container from "../../../../components/Container/Container";
import useTravelContext from "../../../../hooks/useTravelContext";
import useUserSelector from "../../../../hooks/useUserSelector";
import PlaceActivity from "../../../../classes/PlaceActivity";
import {DEFAULT_IMG_URL} from "../../../../static/constants";
import RoadActivity from "../../../../classes/RoadActivity";
import {Tab} from "../../../../components/ui";

export default function ShowRouteByDays() {
    // const {user} = useUserSelector()
    const {dayNumber} = useParams()
    const {travel} = useTravelContext()

    const [activity, setActivity] = useState(/**@type{Activity}*/ null)

    useEffect(() => {
        const act = travel.routeBuilder.getActivities()
        setActivity(act)
    }, [])

    if (activity)

    return (
        <>
            {
                <div className='travel-tab-container flex-stretch flex-nowrap hide-scroll'>
                    {
                        activity?.getUniqDaysList()
                            .map((i) => (
                                <Tab to={`/travel/${travel.id}/${i}/`} key={i} name={`${i} день`}/>
                            ))
                    }
                </div>
            }
            <Container className='column overflow-x-hidden pt-20 pb-20 gap-1'>
                {
                    activity
                        ? activity.getActivitiesAtDay(+dayNumber).map(showActivity)
                        : <div>Loading...</div>
                }

            </Container>
        </>
    )
}


/**
 * @param {Activity} a
 * @return {JSX.Element}
 */
function showActivity(a) {
    if (a instanceof RoadActivity) {
        return (
            <div key={a.start.getTime()}>
                <dl>
                    <dt>Переезд</dt>
                    <dd>{(a.distance / 1000).toFixed(2)} km</dd>
                    <dt>Время до места</dt>
                    <dd>{a.toTimeStingFormat()}</dd>
                </dl>
            </div>
        )
    }
    else if (a instanceof PlaceActivity)
        return (
            <LocationCard
                key={a.place.id}
                id={a.place.id}
                title={a.place.name}
                imgURLs={a.place.photos || [DEFAULT_IMG_URL]}
                entityType={a.place.formatted_address}
                item={a.place}

            />
        )
    else if (a instanceof RestTimeActivity)
        return (
            <div key={a.start.getTime()}>
                <div className='title-semi-bold'>Свободное время</div>
                <dl>
                    <dt>Время до месьа</dt>
                    <dd>{a.toTimeStingFormat()}</dd>
                </dl>
            </div>
        )
}