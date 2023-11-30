import {useParams} from "react-router-dom";
import React, {useEffect, useLayoutEffect, useRef, useState} from "react";

import YandexMapContainer from "../../../../components/YandexMapContainer/YandexMapContainer";
import useTravelContext from "../../../../hooks/useTravelContext";
import dateRange from "../../../../utils/dateRange";
import defaultPlace from "../../../../utils/default-values/defaultPlace";
import {Tab} from "../../../../components/ui";

export default function ShowRouteOnMap() {
    const {travel} = useTravelContext()
    const {dayNumber} = useParams()
    const tabs_ref = useRef(/**@type{HTMLDivElement}*/ null)
    const ref = useRef(/** @type{HTMLDivElement}*/null)

    const [map, setMap] = useState(/**@type{YMap}*/null)

    useEffect(() => {
        if (map) {
            const points = Array.from({length: 20}).fill(0).map((_, idx) => (defaultPlace()))

            // window.genetic = (mutation = 50, cycles = 200) => {
            //     const start = new Date()
            //
            //     const result = travel.routeBuilder.sortByGeneticAlgorithm(points, mutation, cycles);
            //
            //     const end = new Date()
            //     const ms = (end - start) % 1000
            //     const sec = (end - start - ms) / 1000
            //     console.log('Spent time: ', `${sec}sec ${ms}ms`)
            //     console.log(map)
            //     map.clearMap()
            //     map.showRoute(result);
            // }
            //
            // window.salesman = (dist = 70) => {
            //     const start = new Date()
            //
            //     const result = travel.routeBuilder.sortPlacesByDistance(points, dist);
            //
            //     const end = new Date()
            //     const ms = (end - start) % 1000
            //     const sec = (end - start - ms) / 1000
            //     console.log('Spent time: ', `${sec}sec ${ms}ms`)
            //     map.clearMap()
            //     map.showRoute(result);
            // }

            // travel.setPlaces(points)
            // window.activities = () => {
            //     travel.routeBuilder.updateRoute()
            // }
        }

    }, [map])

    useEffect(() => {
        if (map && dayNumber) {
            const route = travel.places

            /**@type{MapPointType[]}*/
            const routePointForMap = route
                .map(({id, location: {lat, lng}}) => ({id, coords: [lat, lng]}))
            map
                .showRoute(route, {})
                .autoZoom()

            route.forEach(r => {
                /**@type{BalloonOptionsType}*/
                const ballonOptions = {
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
                                <span class="title-semi-bold">${r.location.lat}, ${r.location.lng}</span>
                            </div>
                            <div>
                                <span>Запланировано на: </span>
                                <span class="title-semi-bold">${dateRange(r.date_start, r.date_end)}</span>
                            </div>
                        </div>
                    </div>
                    `,
                    balloonContentFooter: `<div class="balloon-footer">${r.formatted_address}</div>`,
                }
                map.setBalloonToPoint(r.id, ballonOptions, {maxWidth: window.innerWidth * 0.6})
            })
            window.map = map
        }
    }, [map, dayNumber])

    useLayoutEffect(() => {
        if (ref.current) {
            ref.current.style.height = '100%'
            /**@type{HTMLDivElement}*/
            const parent = ref.current.parentElement
            const delta = parent.scrollHeight - parent.clientHeight
            ref.current.style.height = ref.current.offsetHeight - delta + 'px'
        }
    })

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
                <YandexMapContainer onMapReadyCB={setMap}/>
            </div>
        </>
    )
}
