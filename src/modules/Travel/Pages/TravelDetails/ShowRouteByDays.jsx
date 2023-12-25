import {Link, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";

import RecommendLocation2 from "../../components/RecommendLocation2/RecommendLocation2";
import RecommendLocation from "../../components/RecommendLocation/RecommendLocation";
import defaultHandleError from "../../../../utils/error-handlers/defaultHandleError";
import RestTimeActivity from "../../../../classes/RestTimeActivity";
import Container from "../../../../components/Container/Container";
import useTravelContext from "../../../../hooks/useTravelContext";
import useUserSelector from "../../../../hooks/useUserSelector";
import PlaceCard2 from "../../components/PlaceCard2/PlaceCard2";
import PlaceActivity from "../../../../classes/PlaceActivity";
import PlaceCard from "../../components/PlaceCard/PlaceCard";
import RoadActivity from "../../../../classes/RoadActivity";
import {ENTITY} from "../../../../static/constants";
import {Tab} from "../../../../components/ui";

export default function ShowRouteByDays() {
    // const user = useUserSelector()
    const {dayNumber} = useParams()
    const {travel, travelObj} = useTravelContext()
    // const [activitiesList, setActivitiesList] = useState(/**@type{Activity[]}*/[])
    //
    // useEffect(() => {
    //     const days = travel.routeBuilder.getActivityDays()
    //     setActivitiesList(travel.routeBuilder.getActivitiesAtDay(+dayNumber || days[0] || 1))
    // }, [dayNumber, travel, travelObj.places])

    return (
        <>
            {
                <div className='travel-tab-container flex-stretch flex-nowrap hide-scroll flex-0'>
                    {
                        travel.routeBuilder.getActivityDays()
                            .map((i) => (
                                <Tab to={`/travel/${travelObj.id}/${i}/`} key={i} name={`${i} день`}/>
                            ))
                    }
                </div>
            }
            <Container className='column overflow-x-hidden pt-20 pb-20 gap-1 flex-1'>
                {
                    travelObj.__route.map(r=>
                        r.type === ENTITY.PLACE
                            ? <PlaceCard2 place={r} />
                            : <RecommendLocation2 moving={r} />
                    )
                    // activitiesList
                    //     ? travel.routeBuilder.getActivitiesAtDay(+dayNumber).map((a, idx) => (
                    //         <React.Fragment key={idx}>
                    //             <div>
                    //                 {<ShowActivity activity={a} index={idx} activitiesList={activitiesList}/>}
                    //                 {<ShowAdvice prevActivity={a} nextActivity={activitiesList[idx + 1]}/>}
                    //             </div>
                    //         </React.Fragment>))
                    //     : travelObj.places.length === 0
                    //         ? (
                    //             <div>
                    //                 <Link className='link' to={`/travel/${travelObj.id}/add/place/`}>Добавить место</Link>
                    //             </div>
                    //         )
                    //         : <div>Loading...</div>
                }

            </Container>
        </>
    )
}


/**
 * @param {Activity} activity
 * @return {JSX.Element}
 */
function ShowActivity({activity}) {
    const {travel, travelObj} = useTravelContext()
    const user = useUserSelector()
    const [_activity, setActivity] = useState(/**@type{Activity}*/null)

    useEffect(() => {
        setActivity(activity)
    }, [activity])


    /** @param {PlaceType} place */
    function handleRemovePLace(place) {
        travel.removePlace(place)
        travel.save(user.id)
            .catch(defaultHandleError)
    }

    if (activity instanceof RoadActivity) {
        return (
            <>
                <RecommendLocation
                    to={`/travel/${travelObj.id}/params/`}
                    items={[
                        {id: 1, entityType: 'hotel', entityName: '123'},
                        {id: 2, entityType: 'hotel', entityName: 'name'},
                    ]}
                    activity={activity}
                />
            </>
        )
    } else if (activity instanceof PlaceActivity)
        return <PlaceCard
            placeActivity={activity}
            onDelete={handleRemovePLace}
        />
    else if (activity instanceof RestTimeActivity)
        return null//<RestTimeComponent activity={activity}/>
    // return (
    //     <div>
    //         {/*<div className='row mt-20 gap-1'>*/}
    //         {/*    <Chip >{a.start.toLocaleTimeString()}</Chip>*/}
    //         {/*    <Chip >{a.end.toLocaleTimeString()}</Chip>*/}
    //         {/*</div>*/}
    //         <div className='title-semi-bold'>Свободное время</div>
    //         <dl>
    //             <dt>Время до места</dt>
    //             <dd>{a.durationToSting()}</dd>
    //         </dl>
    //     </div>
    // )
}


