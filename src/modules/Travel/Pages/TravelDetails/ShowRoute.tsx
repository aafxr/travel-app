import React, {useEffect} from "react";

import Container from "../../../../components/Container/Container";
import {useAppContext, useUser} from "../../../../contexts/AppContextProvider";
import Button from "../../../../components/ui/Button/Button";
import ShowRouteByDays from "./ShowRouteByDays";
import ShowPlaces from "./ShowPlaces";
import debounce from "lodash.debounce";
import ShowRouteOnMap from "./ShowRouteOnMap";

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
                        onClick={() => user.setRouteFilter('byDays')}
                        active={user.getSetting('routeFilter') === 'byDays'}
                    >по дням</Button>
                    <Button
                        onClick={() => user.setRouteFilter('onMap')}
                        active={user.getSetting('routeFilter') === 'onMap'}
                    >на карте</Button>
                    <Button
                        onClick={() => user.setRouteFilter('allPlaces')}
                        active={user.getSetting('routeFilter') === 'allPlaces'}
                    >все места</Button>
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