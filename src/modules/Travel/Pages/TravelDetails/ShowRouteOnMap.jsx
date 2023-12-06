import React, {useEffect, useLayoutEffect, useRef, useState} from "react";

import YandexMapContainer from "../../../../components/YandexMapContainer/YandexMapContainer";
import useTravelContext from "../../../../hooks/useTravelContext";
import dateRange from "../../../../utils/dateRange";
import IconButton from "../../../../components/ui/IconButton/IconButton";
import {MapIcon} from "../../../../components/svg";
import BaseService from "../../../../classes/BaseService";
import constants from "../../../../static/constants";
import defaultHandleError from "../../../../utils/error-handlers/defaultHandleError";
import useUserSelector from "../../../../hooks/useUserSelector";

export default function ShowRouteOnMap() {
    const {travel} = useTravelContext()
    const {user} = useUserSelector()
    // const {dayNumber} = useParams()
    // const tabs_ref = useRef(/**@type{HTMLDivElement}*/ null)
    const ref = useRef(/** @type{HTMLDivElement}*/null)

    const [map, setMap] = useState(/**@type{YMap}*/null)

    useEffect(() => {
        if (map) {
            const route = travel.places

            // /**@type{MapPointType[]}*/
            // const routePointForMap = route
            //     .map(({id, coords}) => ({id, coords}))
            map
                .showRoute(route, {})
                .autoZoom()

            route.forEach((r, index) => {
                /**@type{BalloonOptionsType}*/
                const balloonOptions = {
                    hintContent: r.name,
                    balloonContentHeader: `<div class="balloon-header">${r.name}</div>`,
                    balloonContentBody: `
                    <div class="balloon-body">
                        ${r.photos?.length ? `
                        <div class="balloon-image">
                            <img class="img-abs" src="${r.photos[0]}" alt="${r.name}">
                        </div>` : ''}
                        <div class="balloon-content">
                            <div>
                                <span>Координаты: </span >
                                <span class="title-semi-bold">${r.location[0]}, ${r.location[1]}</span>
                            </div>
                            <div>
                                <span>Запланировано на: </span>
                                <span class="title-semi-bold">${dateRange(r.time_start, r.time_end)}</span>
                            </div>
                        </div>
                    </div>
                    `,
                    balloonContentFooter: `<div class="balloon-footer">${r.formatted_address}</div>`,
                    iconContent: index + 1
                }
                map.setBalloonToPoint(r.id, balloonOptions, {maxWidth: window.innerWidth * 0.6})
            })
            window.map = map
        }
    }, [map])

    useLayoutEffect(() => {
        if (ref.current) {
            ref.current.style.height = '100%'
            /**@type{HTMLDivElement}*/
            const parent = ref.current.parentElement
            const delta = parent.scrollHeight - parent.clientHeight
            ref.current.style.height = ref.current.offsetHeight - delta + 'px'
        }
    })

    // детальный маршрут ===============================================================================================

    useEffect(() => {
        const initDetailRout = async () => {
            const service = new BaseService(constants.store.ROUTE)
            /**@type{RouteDetailType | null}*/
            let route = await service.read(travel.id)
            if (route && !routNeedUpdateNeed(route)) {
                let points = route.routes.reduce((acc, segment) => acc.concat(segment.route), [])
                map
                    .showPolyRoute(points)
                    .autoZoom()
            }
        }
        if (travel && map && user)
            initDetailRout().catch(defaultHandleError)
    }, [travel, map, user])


    async function buildDetailRoute() {
        try {
            const service = new BaseService(constants.store.ROUTE)
            /**@type{RouteDetailType | null}*/
            let route = await service.read(travel.id)

            if (route) {
                if (routNeedUpdateNeed(route)) {
                    route = await updateRoute(service)
                }
                let points = route.routes.reduce((acc, segment) => acc.concat(segment.route), [])
                map.showPolyRoute(points)
            } else {
                const newDetailRoute = await updateRoute(service)
                let points = newDetailRoute.routes.reduce((acc, segment) => acc.concat(segment.route), [])
                map.showPolyRoute(points)
            }
        } catch (err) {
            defaultHandleError(err)
        }

    }

    /**
     * @param {RouteDetailType} track
     * @returns {boolean}
     */
    function routNeedUpdateNeed(track) {
        const places = travel.places

        if (track.viaPoints?.length !== places.length) return true

        return !places.every(p => track.viaPoints.includes(p.id))
    }

    /**
     * @param {BaseService} service
     * @returns {Promise<RouteDetailType>}
     */
    async function updateRoute(service) {
        const updatedRout = await map.buildDetailRoute(travel.places.map(({id, coords}) => ({id, coords})))
        await service.update(updatedRout, user.id)
        return updatedRout
    }

    return (
        <>
            {/*{*/}
            {/*    <div ref={tabs_ref} className='travel-tab-container flex-stretch flex-nowrap hide-scroll'>*/}
            {/*        {*/}
            {/*            travel.routeBuilder.getActivityDays()*/}
            {/*                .map((i) => (*/}
            {/*                    <Tab to={`/travel/${travel.id}/${i}/`} key={i} name={`${i} день`}/>*/}
            {/*                ))*/}
            {/*        }*/}
            {/*    </div>*/}
            {/*}*/}
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
                    onClick={buildDetailRoute}
                />
                <YandexMapContainer onMapReadyCB={setMap}/>
            </div>
        </>
    )
}
