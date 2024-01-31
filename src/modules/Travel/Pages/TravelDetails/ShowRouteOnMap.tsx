import React, {useLayoutEffect, useRef} from "react";

import IconButton from "../../../../components/ui/IconButton/IconButton";
import {useTravel} from "../../../../contexts/AppContextProvider";
import {YPlacemark, YandexMapContainer} from "../../../../components/YandexMap";
import {MapIcon} from "../../../../components/svg";

export default function ShowRouteOnMap() {
    const travel = useTravel()
    // const {dayNumber} = useParams()
    // const tabs_ref = useRef(/**@type{HTMLDivElement}*/ null)
    const ref = useRef<HTMLDivElement>(null)


    useLayoutEffect(() => {
        if (ref.current) {
            ref.current.style.height = '100%'
            const parent = ref.current.parentElement
            if (parent) {
                const delta = parent.scrollHeight - parent.clientHeight
                ref.current.style.height = ref.current.offsetHeight - delta + 'px'
            }
        }
    })


    // async function buildDetailRoute() {
    //     try {
    //         const service = new BaseService(constants.store.ROUTE)
    //         /**@type{RouteDetailType | null}*/
    //         let route = await service.read(travelObj.id)
    //
    //         if (route) {
    //             if (routNeedUpdateNeed(route)) {
    //                 route = await updateRoute(service)
    //             }
    //             let points = route.routes.reduce((acc, segment) => acc.concat(segment.route), [])
    //             map.showPolyRoute(points)
    //         } else {
    //             const newDetailRoute = await updateRoute(service)
    //             let points = newDetailRoute.routes.reduce((acc, segment) => acc.concat(segment.route), [])
    //             map.showPolyRoute(points)
    //         }
    //     } catch (err) {
    //         defaultHandleError(err)
    //     }
    //
    // }


    async function updateRoute() {
        // const updatedRout = await map.buildDetailRoute(travelObj.places.map(({id, coords}) => ({id, coords})))
        // await service.update(updatedRout, user.id)
        // return updatedRout
    }


    if (!travel) return null

    return (
        <>

            <div
                ref={ref}
                id='on-map'
                className='flex-1 relative'
                style={{height: '100%'}}
            >
                <IconButton
                    icon={<MapIcon/>}
                    title={'Детальный маршрут'}
                    className="map-detail-route-button" small
                />
                <YandexMapContainer style={{height: '100%'}}>
                    {travel.places.map((p, idx) => (
                        <YPlacemark coordinates={p.coords} iconContent={`${idx + 1}`}/>
                    ))}
                </YandexMapContainer>
            </div>
        </>
    )
}
