import React, {useLayoutEffect, useRef} from "react";
import {useParams} from "react-router-dom";

import defaultHandleError from "../../../../utils/error-handlers/defaultHandleError";
import LocationCard from "../../components/LocationCard/LocationCard";
import Container from "../../../../components/Container/Container";
import useTravelContext from "../../../../hooks/useTravelContext";
import useUserSelector from "../../../../hooks/useUserSelector";
import {DEFAULT_IMG_URL} from "../../../../static/constants";
import {Tab} from "../../../../components/ui";
import dateToStringFormat from "../../../../utils/dateToStringFormat";

export default function ShowPlaces() {
    const {user} = useUserSelector()
    const {dayNumber} = useParams()
    const {travel} = useTravelContext()
    const tabs_ref = useRef(/**@type{HTMLDivElement}*/ null)
    const container_ref = useRef(/**@type{HTMLDivElement}*/ null)
    const activeDays = travel.routeBuilder.getActivityDays()

    /** @param {PlaceType} place */
    function handleRemovePLace(place) {
        travel.removePlace(place)
        travel.save(user.id)
            .catch(defaultHandleError)
    }

    useLayoutEffect(() => {
        if (tabs_ref.current && container_ref) {
            const rect = tabs_ref.current.getBoundingClientRect()
            container_ref.current.style.height = window.screen.height - rect.bottom + 'px'
        }
    })

    return (
        <>
            {
                <div ref={tabs_ref} className='travel-tab-container flex-stretch flex-nowrap hide-scroll'>
                    {
                        activeDays.length > 1
                        ? activeDays
                            .map((i) => (
                                <Tab to={`/travel/${travel.id}/${i}/`} key={i} name={`${i} день`}/>
                            ))
                            :  <Tab to={`/travel/${travel.id}/`} name={dateToStringFormat(travel.date_start || travel.date_end).slice(0, -5)}/>
                    }
                </div>
            }
            <Container ref={container_ref} className='column overflow-x-hidden pt-20 pb-20 gap-1'>
                {
                    travel.routeBuilder.getRouteByDay(+dayNumber || 1).map(p => (
                        <LocationCard
                            key={p._id || p.id}
                            id={p.id}
                            title={p.name}
                            imgURLs={p.photos || [DEFAULT_IMG_URL]}
                            entityType={p.formatted_address}
                            onDelete={handleRemovePLace}
                            item={p}
                        />
                    ))
                }
            </Container>
        </>
    )
}