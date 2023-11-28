import {useParams} from "react-router-dom";
import React, {useEffect, useLayoutEffect, useRef, useState} from "react";

import RecommendLocation from "../../components/RecommendLocation/RecommendLocation";
import LocationCard from "../../components/LocationCard/LocationCard";
import RestTimeActivity from "../../../../classes/RestTimeActivity";
import Container from "../../../../components/Container/Container";
import useTravelContext from "../../../../hooks/useTravelContext";
import PlaceActivity from "../../../../classes/PlaceActivity";
import {DEFAULT_IMG_URL} from "../../../../static/constants";
import RoadActivity from "../../../../classes/RoadActivity";
import {Tab} from "../../../../components/ui";

export default function ShowRouteByDays() {
    // const {user} = useUserSelector()
    const {dayNumber} = useParams()
    const {travel} = useTravelContext()
    const tabs_ref = useRef(/**@type{HTMLDivElement}*/ null)
    const container_ref = useRef(/**@type{HTMLDivElement}*/ null)

    const [activity, setActivity] = useState(/**@type{Activity}*/ null)

    useEffect(() => {
        const act = travel.routeBuilder.getActivities()
        setActivity(act)
    }, [])

    useLayoutEffect(() => {
        if (tabs_ref.current && container_ref) {
            const rect = tabs_ref.current.getBoundingClientRect()
            container_ref.current.style.height = window.screen.height - rect.bottom + 'px'
        }
    })


    if (activity)

        return (
            <>
                {
                    <div ref={tabs_ref} className='travel-tab-container flex-stretch flex-nowrap hide-scroll'>
                        {
                            activity?.getUniqDaysList()
                                .map((i) => (
                                    <Tab to={`/travel/${travel.id}/${i}/`} key={i} name={`${i} день`}/>
                                ))
                        }
                    </div>
                }
                <Container ref={container_ref} className='column overflow-x-hidden pt-20 pb-20 gap-1'>
                    {
                        activity
                            ? activity.getActivitiesAtDay(+dayNumber).map((a, idx) => (
                                <React.Fragment key={idx}>
                                    {showActivity(a)}
                                </React.Fragment>))
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
            <>
                <RecommendLocation
                    items={[
                        {id: 1, entityType: 'hotel', entityName: '123'},
                        {id: 2, entityType: 'hotel', entityName: 'name'},
                    ]}
                    activity={a}
                />
            </>
        )
    } else if (a instanceof PlaceActivity)
        return (
            <LocationCard
                id={a.place.id}
                title={a.place.name}
                imgURLs={a.place.photos || [DEFAULT_IMG_URL]}
                entityType={a.place.formatted_address}
                item={a.place}
                dateStart={a.start.toISOString()}
                dateEnd={a.end.toISOString()}

            />
        )
    else if (a instanceof RestTimeActivity)
        return (
            <div>
                <div className='title-semi-bold'>Свободное время</div>
                <dl>
                    <dt>Время до месьа</dt>
                    <dd>{a.toTimeStingFormat()}</dd>
                </dl>
            </div>
        )
}