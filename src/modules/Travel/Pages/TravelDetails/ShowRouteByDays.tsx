import {Link, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";

import defaultHandleError from "../../../../utils/error-handlers/defaultHandleError";
import {useAppContext, useTravel} from "../../../../contexts/AppContextProvider";
import ShowRoadCard from "../../components/ShowRoadCard/ShowRoadCard";
import {Place, Road, Travel} from "../../../../classes/StoreEntities";
import Container from "../../../../components/Container/Container";
import PlaceCard from "../../components/PlaceCard/PlaceCard";
import {TravelService} from "../../../../classes/services";
import {MS_IN_DAY} from "../../../../static/constants";
import {Tab} from "../../../../components/ui";

export default function ShowRouteByDays() {
    const {dayNumber} = useParams()
    const context = useAppContext()
    const travel = useTravel()
    const [dayPlane, setDayPlane] = useState<Array<Place | Road>>([])


    useEffect(() => {
        if (!travel) return
        if (!dayNumber) return

        const start = new Date(0)
        start.setHours(0, 0, 0, 0)
        start.setTime(start.getTime() + MS_IN_DAY * (Number(dayNumber) - 1))
        const end = new Date(start.getTime() + MS_IN_DAY - 1)
        const places = [...travel.places, ...travel.road]
            .sort((a, b) => a.time_start.getTime() - b.time_start.getTime())
            .filter(p => p.time_start >= start && p.time_start <= end)
        setDayPlane(places)
    }, [dayNumber, travel])


    let showHotel = false
    const lastPlannedActivity = dayPlane[dayPlane.length - 1]
    if (lastPlannedActivity && travel) {
        const freeTime = dayPlane.length > travel.preference.density
        if (freeTime)
            showHotel = true
    }

    const lastPlace = dayPlane[dayPlane.length - 1]

    function handleRemovePlace(place: Place) {
        if (!travel) return
        const newTravel = new Travel(travel)
        newTravel.removePlace(place)
        TravelService.update(context, newTravel)
            .then(() => context.setTravel(newTravel))
            .catch(defaultHandleError)
    }

    if (!travel) return null

    return (
        <>
            <div className='travel-tab-container flex-stretch flex-nowrap hide-scroll flex-0'>
                {Array.from({length: travel.days})
                    .map((_, i) => (
                        <Tab to={`/travel/${travel.id}/${i + 1}/`} key={i + 1} name={`${i + 1} день`}/>
                    ))
                }
            </div>
            <Container className='column overflow-x-hidden pt-20 pb-20 gap-1 flex-1'>
                {
                    dayPlane.length
                        ? dayPlane.map(p => {
                                if (p instanceof Place)
                                    return <PlaceCard key={p._id} place={p} onDelete={() => handleRemovePlace(p)}/>
                                return <ShowRoadCard key={p.id} road={p}/>

                            }
                        )
                        : <Link className='link align-center gap-1' to={`/travel/${travel.id}/add/place/`}>
                            +&nbsp;Добавить локацию
                        </Link>
                }
                {showHotel &&
                    <Link
                        className='link align-center gap-1'
                        to={`/travel/${travel.id}/add/place/${dayNumber}/`}>
                        +&nbsp;Добавить отель
                    </Link>}

            </Container>
        </>
    )
}
//
//
// /**
//  * @param {Activity} activity
//  * @return {JSX.Element}
//  */
// function ShowActivity({activity}) {
//     const {travel, travel} = useTravelContext()
//     const user = useUserSelector()
//     const [_activity, setActivity] = useState(/**@type{Activity}*/null)
//
//     useEffect(() => {
//         setActivity(activity)
//     }, [activity])
//
//
//     /** @param {PlaceType} place */
//     function handleRemovePLace(place) {
//         travel.removePlace(place)
//         travel.save(user.id)
//             .catch(defaultHandleError)
//     }
//
//     if (activity instanceof RoadActivity) {
//         return (
//             <>
//                 <RecommendLocation
//                     to={`/travel/${travel.id}/params/`}
//                     items={[
//                         {id: 1, entityType: 'hotel', entityName: '123'},
//                         {id: 2, entityType: 'hotel', entityName: 'name'},
//                     ]}
//                     activity={activity}
//                 />
//             </>
//         )
//     } else if (activity instanceof PlaceActivity)
//         return <PlaceCard
//             placeActivity={activity}
//             onDelete={handleRemovePLace}
//         />
//     else if (activity instanceof RestTimeActivity)
//         return null//<RestTimeComponent activity={activity}/>
//     // return (
//     //     <div>
//     //         {/*<div className='row mt-20 gap-1'>*/}
//     //         {/*    <Chip >{a.start.toLocaleTimeString()}</Chip>*/}
//     //         {/*    <Chip >{a.end.toLocaleTimeString()}</Chip>*/}
//     //         {/*</div>*/}
//     //         <div className='title-semi-bold'>Свободное время</div>
//     //         <dl>
//     //             <dt>Время до места</dt>
//     //             <dd>{a.durationToSting()}</dd>
//     //         </dl>
//     //     </div>
//     // )
// }


