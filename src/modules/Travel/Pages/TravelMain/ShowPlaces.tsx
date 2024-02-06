import {useParams} from "react-router-dom";
import React, {forwardRef, useEffect, useLayoutEffect, useRef, useState} from "react";

import {useAppContext, useTravel, useUser} from "../../../../contexts/AppContextProvider";
import defaultHandleError from "../../../../utils/error-handlers/defaultHandleError";
import LocationCard from "../../components/LocationCard/LocationCard";
import Container from "../../../../components/Container/Container";
import {TravelService} from "../../../../classes/services";
import {Place, Travel} from "../../../../classes/StoreEntities";
import {Tab} from "../../../../components/ui";

export default function ShowPlaces() {
    const travel = useTravel()
    const user = useUser()
    const context = useAppContext()
    const {dayNumber} = useParams()
    const tabs_ref = useRef<HTMLDivElement>(null)
    const container_ref = useRef<HTMLDivElement>(null)
    const [placesAtDay, setPlacesAtDay] = useState<Place[]>([])

    // const activeDays = travel.routeBuilder.getActivityDays()

    useEffect(() => {
        if(!travel) return
        const places = travel.places
        setPlacesAtDay(places)
    }, [dayNumber, travel?.places])


    function handleRemovePLace(place: Place) {
        if(!user) return
        if(!travel) return

        Travel.removePlace(travel,place)
        TravelService.update( travel, user)
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
