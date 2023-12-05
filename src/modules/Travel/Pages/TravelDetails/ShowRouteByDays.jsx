import {Link, useParams} from "react-router-dom";
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
import {type} from "@testing-library/user-event/dist/type";
import PlaceCard from "../../components/PlaceCard/PlaceCard";

export default function ShowRouteByDays() {
    // const {user} = useUserSelector()
    const {dayNumber} = useParams()
    const {travel} = useTravelContext()
    const tabs_ref = useRef(/**@type{HTMLDivElement}*/ null)
    const container_ref = useRef(/**@type{HTMLDivElement}*/ null)

    const activity= travel.routeBuilder.getActivities()

    // useEffect(() => {
    //     console.log('update actions')
    //     const act =
    //     setActivity(act)
    // }, [travel])

    useLayoutEffect(() => {
        if (tabs_ref.current && container_ref) {
            const rect = tabs_ref.current.getBoundingClientRect()
            container_ref.current.style.height = window.screen.height - rect.bottom + 'px'
        }
    })


    // useEffect(() => {
    //     if (activity)
    //         activity.log()
    //
    // }, [activity])
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
                                {showActivity(travel, a)}
                            </React.Fragment>))
                        : travel.places.length === 0
                            ? (
                                <div>
                                    <Link className='link' to={`/travel/${travel.id}/add/place/`} >Добавить место</Link>
                                </div>
                            )
                            : <div>Loading...</div>
                }

            </Container>
        </>
    )
}


/**
 * @param {Travel} travel
 * @param {Activity} a
 * @return {JSX.Element}
 */
function showActivity(travel, a) {
    if (a instanceof RoadActivity) {
        return (
            <>
                <RecommendLocation
                    to={`/travel/${travel.id}/params/`}
                    items={[
                        {id: 1, entityType: 'hotel', entityName: '123'},
                        {id: 2, entityType: 'hotel', entityName: 'name'},
                    ]}
                    activity={a}
                />
            </>
        )
    } else if (a instanceof PlaceActivity)
        return <PlaceCard placeActivity={a} />
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
