import React, {useEffect} from "react";

import Container from "../../../../components/Container/Container";
import {useAppContext, useUser} from "../../../../contexts/AppContextProvider";
import Button from "../../../../components/ui/Button/Button";
import {CalendarIcon, FlagIcon, MapIcon} from "../../../../components/svg";
import ShowRouteByDays from "./ShowRouteByDays";
import ShowRouteOnMap from "./ShowRouteOnMap";
import debounce from "lodash.debounce";
import ShowPlaces from "./ShowPlaces";
import './TravelDetails.css'

export function ShowRoute() {
    const user = useUser()!
    const context = useAppContext()


    useEffect(() => {
        const debouncedUpdate = debounce(() => {
            context.setUser(user)
        },50, {trailing:true})
        const unsubscribe = user.subscribe('update', debouncedUpdate)
        return () => unsubscribe()
    })


    return (
        <div className='h-full relative column'>

            <Container className='flex-0'>
                <div className='flex-between gap-1 pt-20 pb-20'>
                    <Button
                        className='travel-details-button'
                        onClick={() => user.setRouteFilter('byDays')}
                        active={user.getSetting('routeFilter') === 'byDays'}
                    >
                        <div className='column center'>
                            <CalendarIcon className='icon' />
                            <span>по дням</span>
                        </div>
                    </Button>
                    <Button
                        className='travel-details-button'
                        onClick={() => user.setRouteFilter('onMap')}
                        active={user.getSetting('routeFilter') === 'onMap'}
                    >
                        <div className='column center'>
                            <MapIcon className='icon' />
                            <span>на карте</span>
                        </div>
                    </Button>
                    <Button
                        className='travel-details-button'
                        onClick={() => user.setRouteFilter('allPlaces')}
                        active={user.getSetting('routeFilter') === 'allPlaces'}
                    >
                        <div className='column center'>
                            <FlagIcon className='icon' />
                            <span>все места</span>
                        </div>
                    </Button>
                </div>
            </Container>

            {
                user.getSetting('routeFilter') === 'allPlaces' && <ShowPlaces/>
            }
            {
                user.getSetting('routeFilter') === 'onMap' && <ShowRouteOnMap/>
            }
            {
                user.getSetting('routeFilter') === 'byDays' && <ShowRouteByDays/>
            }
        </div>
    )
}