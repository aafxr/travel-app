import {Link, useParams} from "react-router-dom";
import React, {useContext, useEffect, useState} from "react";

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
import {ENTITY, MS_IN_DAY} from "../../../../static/constants";
import {Tab} from "../../../../components/ui";
import {PlusIcon} from "../../../../components/svg";
import {UserContext} from "../../../../contexts/UserContextProvider";
import durationToSting from "../../../../utils/date-utils/durationToString";

export default function ShowRouteByDays() {
    const {user} = useContext(UserContext)
    const {dayNumber} = useParams()
    const {travel, travelObj} = useTravelContext()
    const [dayPlane, setDayPlane] = useState(/**@type{Array<PlaceType | MovingType>}*/[])
    // const [activitiesList, setActivitiesList] = useState(/**@type{Activity[]}*/[])
    //
    // useEffect(() => {
    //     const days = travel.routeBuilder.getActivityDays()
    //     setActivitiesList(travel.routeBuilder.getActivitiesAtDay(+dayNumber || days[0] || 1))
    // }, [dayNumber, travel, travelObj.places])

    const timeRange_start = travelObj.date_start.getTime() + MS_IN_DAY * (+dayNumber - 1)
    const timeRange_end = timeRange_start + MS_IN_DAY



    useEffect(() => {
        function updatePlane(__route = []) {
            const dp = __route
                .filter(r => {
                    switch (r.type) {
                        case ENTITY.PLACE:
                            return r.time_start.getTime() >= timeRange_start && r.time_start.getTime() <= timeRange_end
                        case  ENTITY.MOVING:
                            return r.start.getTime() >= timeRange_start && r.start.getTime() <= timeRange_end
                        default:
                            return false
                    }
                })
            setDayPlane(dp)
        }

        updatePlane(travelObj.__route)
        const unsubscrireb = travel.subscribe('route', updatePlane)
        return () => unsubscrireb()
    }, [dayNumber, travelObj])

    let showHotel = false
    const lastPlannedActivity = dayPlane[dayPlane.length - 1]
    if (lastPlannedActivity) {
        const freeTime = timeRange_end - (lastPlannedActivity.time_end || lastPlannedActivity.end) > travelObj.preferences.density
        if (freeTime)
            showHotel = true
    }

    const lastPlace = dayPlane.findLast(el => el.type === 2001)

    /** @param {PlaceType} place */
    function handleRemovePlace(place){
        travel.removePlace(place)
            .save(user.id)
            .catch(defaultHandleError)
    }

    return (
        <>
            {
                <div className='travel-tab-container flex-stretch flex-nowrap hide-scroll flex-0'>
                    {
                        Array.from({length: travelObj.__days})
                            .map((_, i) => (
                                <Tab to={`/travel/${travelObj.id}/${i + 1}/`} key={i + 1} name={`${i + 1} день`}/>
                            ))
                    }
                </div>
            }
            <Container className='column overflow-x-hidden pt-20 pb-20 gap-1 flex-1'>
                {
                    dayPlane.length
                        ? dayPlane.map(r =>
                            r.type === ENTITY.PLACE
                                ? <PlaceCard2 key={r._id} place={r} onDelete={() => handleRemovePlace(r)}/>
                                : <RecommendLocation2 key={r.id} moving={r}/>
                        )
                        : <Link className='link align-center gap-1'
                                to={`/travel/${travelObj.id}/add/place/${dayNumber}/`}><PlusIcon
                            className='icon'/>&nbsp;Добавить локацию</Link>
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
                    //         : <div>PageContainer...</div>
                }
                {showHotel &&
                    <Link
                        className='link align-center gap-1'
                        to={`/travel/${travelObj.id}/add/place/${dayNumber}/?place=${lastPlace?._id}`}>
                        <PlusIcon className='icon'/>&nbsp;Добавить отель
                    </Link>}

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


