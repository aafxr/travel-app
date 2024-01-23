import React, {useEffect, useLayoutEffect, useRef, useState} from "react";
import {useParams} from "react-router-dom";

import LocationCard from "../../components/LocationCard/LocationCard";
import Container from "../../../../components/Container/Container";
import useTravelContext from "../../../../hooks/useTravelContext";
import useUserSelector from "../../../../hooks/useUserSelector";
import {DEFAULT_IMG_URL} from "../../../../static/constants";
import {Place} from "../../../../classes/StoreEntities";
import {Tab} from "../../../../components/ui";
import {DB} from "../../../../db/DB";

export default function ShowPlaces() {
    const user = useUserSelector()
    const {dayNumber} = useParams()
    const {travel} = useTravelContext()
    const tabs_ref = useRef<HTMLDivElement>(null)
    const container_ref = useRef<HTMLDivElement>(null)
    const [placesAtDay, setPlacesAtDay] = useState<Place[]>([])

    // const activeDays = travel.routeBuilder.getActivityDays()

    useEffect(() => {
        // const days = travel.routeBuilder.getActivityDays()
        const places = travel.places//travel.routeBuilder.getPlacesAtDay(+dayNumber || days[0] || 1)
        setPlacesAtDay(places)
    }, [dayNumber, travel.places])


    function handleRemovePLace(place:Place) {
        if(!user) return user
        travel.removePlace(place)
        DB.update(travel, user)
    }

    useLayoutEffect(() => {
        if (tabs_ref.current && container_ref.current) {
            const rect = tabs_ref.current.getBoundingClientRect()
            container_ref.current.style.height = window.screen.height - rect.bottom + 'px'
        }
    })

    return (
        <>
            {
                <div ref={tabs_ref} className='travel-tab-container flex-stretch flex-nowrap hide-scroll flex-0'>
                    {
                        Array.from({length: travel.days})
                            .map((_, i) => (
                                <Tab to={`/travel/${travel.id}/${i+1}/`} key={i+1} name={`${i+1} день`}/>
                            ))
                        // :  <Tab to={`/travel/${travel.id}/1/`} name={dateToStringFormat(travel.date_start || travel.date_end).slice(0, -5)}/>
                    }
                </div>
            }
            <Container ref={container_ref} className='column overflow-x-hidden pt-20 pb-20 gap-1 flex-1'>
                {
                    placesAtDay.map(p => (
                        <LocationCard
                            key={p._id || p.id}
                            place={p}
                            onDelete={handleRemovePLace}
                        />
                    ))
                }
            </Container>
        </>
    )
}
