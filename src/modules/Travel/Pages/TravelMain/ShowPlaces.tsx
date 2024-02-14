import React, {forwardRef, useEffect, useLayoutEffect, useRef, useState} from "react";

import {useAppContext, useTravel, useUser} from "../../../../contexts/AppContextProvider";
import defaultHandleError from "../../../../utils/error-handlers/defaultHandleError";
import {PlaceStep} from "../../../../classes/StoreEntities/route/PlaceStep";
import LocationCard from "../../components/LocationCard/LocationCard";
import Container from "../../../../components/Container/Container";
import {Place, Travel} from "../../../../classes/StoreEntities";
import {TravelService} from "../../../../classes/services";
import {Tab} from "../../../../components/ui";
import {PlaceStepCard} from "./steps/PlaceStepCard";

export default function ShowPlaces() {
    const travel = useTravel()
    const user = useUser()
    const context = useAppContext()
    // const {dayNumber} = useParams()
    const tabs_ref = useRef<HTMLDivElement>(null)
    const container_ref = useRef<HTMLDivElement>(null)
    const [placesAtDay, setPlacesAtDay] = useState<PlaceStep[]>([])

    // const activeDays = travel.routeBuilder.getActivityDays()

    useEffect(() => {
        if(!travel) return
        const places: PlaceStep[] = []
        travel.steps.forEach(s => {
            if (s instanceof PlaceStep) places.push(s)
        })
        setPlacesAtDay(places)
    }, [])


    function handleRemovePLace(place: Place) {
        if(!user) return
        if(!travel) return

        const t = new Travel(travel)
        Travel.removePlace(t, place)
        TravelService.update( t, user)
            .then( () => context.setTravel(t))
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
                    placesAtDay.map((p, idx) => (
                        <PlaceStepCard key={idx} place={p} timeLabels={false}/>
                    ))
                }
            </Container>
        </>
    )
}
