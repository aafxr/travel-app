import {useParams} from "react-router-dom";
import React, {useEffect, useLayoutEffect, useRef, useState} from "react";

import YandexMapContainer from "../../../../components/YandexMapContainer/YandexMapContainer";
import useTravelContext from "../../../../hooks/useTravelContext";
import dateRange from "../../../../utils/dateRange";
import defaultPlace from "../../../../utils/default-values/defaultPlace";
import {Tab} from "../../../../components/ui";

export default function ShowRouteOnMap() {
    const {travel} = useTravelContext()
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

            route.forEach(r => {
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
