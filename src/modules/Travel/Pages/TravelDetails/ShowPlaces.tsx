import {useParams} from "react-router-dom";
import React, {forwardRef, useEffect, useLayoutEffect, useRef, useState} from "react";

import {useAppContext, useTravel} from "../../../../contexts/AppContextProvider";
import defaultHandleError from "../../../../utils/error-handlers/defaultHandleError";
import LocationCard from "../../components/LocationCard/LocationCard";
import Container from "../../../../components/Container/Container";
import {TravelService} from "../../../../classes/services";
import {Place} from "../../../../classes/StoreEntities";
import {Tab} from "../../../../components/ui";

export default function ShowPlaces() {
    const travel = useTravel()!
    const context = useAppContext()
    const {dayNumber} = useParams()
    const tabs_ref = useRef<HTMLDivElement>(null)
    const container_ref = useRef<HTMLDivElement>(null)
    const [placesAtDay, setPlacesAtDay] = useState<Place[]>([])

    // const activeDays = travel.routeBuilder.getActivityDays()

    useEffect(() => {
        // const days = travel.routeBuilder.getActivityDays()
        const places = travel.places//travel.routeBuilder.getPlacesAtDay(+dayNumber || days[0] || 1)
        setPlacesAtDay(places)
    }, [dayNumber, travel.places])


    function handleRemovePLace(place: Place) {
        travel.removePlace(place)
        TravelService.update(context, travel)
            .then( () => context.setTravel(travel))
            .catch(defaultHandleError)
    }

    useLayoutEffect(() => {
        if (tabs_ref.current && container_ref.current) {
            const rect = tabs_ref.current.getBoundingClientRect()
            container_ref.current.style.height = window.screen.height - rect.bottom + 'px'
        }
    })

    return (
        <>
            {/*<TabsGroup ref={tabs_ref} count={travel.days}/>*/}
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

type TabsGroupPropsType = { count: number }
const TabsGroup = forwardRef<HTMLDivElement, TabsGroupPropsType>(({count}, ref) => {
    const travel = useTravel()!

    return (
        <div ref={ref} className='travel-tab-container flex-stretch flex-nowrap hide-scroll flex-0'>
            {
                Array.from({length: count})
                    .map((_, i) => (
                        <Tab to={`/travel/${travel.id}/${i + 1}/`} key={i + 1} name={`${i + 1} день`}/>
                    ))
            }
        </div>
    )
})
