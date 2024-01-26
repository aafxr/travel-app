import React, {useEffect} from "react";

import Container from "../../../../components/Container/Container";
import {useAppContext, useUser} from "../../../../contexts/AppContextProvider";
import Button from "../../../../components/ui/Button/Button";
import ShowRouteByDays from "./ShowRouteByDays";
import ShowPlaces from "./ShowPlaces";
import debounce from "lodash.debounce";

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
                        active={user.routeFilter === 'byDays'}
                    >по дням</Button>
                    <Button
                        onClick={() => user.setRouteFilter('onMap')}
                        active={user.routeFilter === 'onMap'}
                    >на карте</Button>
                    <Button
                        onClick={() => user.setRouteFilter('allPlaces')}
                        active={user.routeFilter === 'allPlaces'}
                    >все места</Button>
                </div>
            </Container>

            {
                user.routeFilter === 'allPlaces' && <ShowPlaces/>
            }
            {/*{*/}
            {/*    user.routeFilter === 'onMap' && <ShowRouteOnMap/>*/}
            {/*}*/}
            {
                user.routeFilter === 'byDays' && <ShowRouteByDays/>
            }
        </div>
    )
}