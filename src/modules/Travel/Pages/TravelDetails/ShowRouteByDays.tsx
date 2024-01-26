import {Link, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";

import Container from "../../../../components/Container/Container";
import {useTravel} from "../../../../contexts/AppContextProvider";
import PlaceCard2 from "../../components/PlaceCard2/PlaceCard2";
import {Place} from "../../../../classes/StoreEntities";
import {MS_IN_DAY} from "../../../../static/constants";
import {PlusIcon} from "../../../../components/svg";
import {Tab} from "../../../../components/ui";

export default function ShowRouteByDays() {
    const {dayNumber} = useParams()
    const travel = useTravel()!
    const [dayPlane, setDayPlane] = useState<Place[]>([])


    useEffect(() => {
        const start = new Date(travel.date_start.getTime() + Number(dayNumber) * MS_IN_DAY)
        const end = new Date(start.getTime() + MS_IN_DAY)
        const places = travel.places.filter(p => p.time_start > start && p.time_start < end)
        setDayPlane(places)
    }, [dayNumber, travel])


    let showHotel = false
    const lastPlannedActivity = dayPlane[dayPlane.length - 1]
    if (lastPlannedActivity) {
        const freeTime = dayPlane.length > travel.preferences.density
        if (freeTime)
            showHotel = true
    }

    const lastPlace = dayPlane[dayPlane.length - 1]

    function handleRemovePlace(place: Place) {
        travel.removePlace(place)
    }

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
                        ? dayPlane.map(p =>
                            <PlaceCard2 key={p._id} place={p} onDelete={() => handleRemovePlace(p)}/>
                        )
                        : <Link className='link align-center gap-1'
                                to={`/travel/${travel.id}/add/place/${dayNumber}/`}><PlusIcon
                            className='icon'/>&nbsp;Добавить локацию</Link>
                    // activitiesList
                    //     ? travel.routeBuilder.getActivitiesAtDay(+dayNumber).map((a, idx) => (
                    //         <React.Fragment key={idx}>
                    //             <div>
                    //                 {<ShowActivity activity={a} index={idx} activitiesList={activitiesList}/>}
                    //                 {<ShowAdvice prevActivity={a} nextActivity={activitiesList[idx + 1]}/>}
                    //             </div>
                    //         </React.Fragment>))
                    //     : travel.places.length === 0
                    //         ? (
                    //             <div>
                    //                 <Link className='link' to={`/travel/${travel.id}/add/place/`}>Добавить место</Link>
                    //             </div>
                    //         )
                    //         : <div>PageContainer...</div>
                }
                {showHotel &&
                    <Link
                        className='link align-center gap-1'
                        to={`/travel/${travel.id}/add/place/${dayNumber}/?place=${lastPlace?._id}`}>
                        <PlusIcon className='icon'/>&nbsp;Добавить отель
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


