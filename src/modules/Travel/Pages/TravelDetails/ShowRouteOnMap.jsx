import {useEffect, useLayoutEffect, useRef, useState} from "react";
import YMap from "../../../../classes/YMap";
import useTravelContext from "../../../../hooks/useTravelContext";
import {useParams} from "react-router-dom";
import MapControls from "../../../../components/MapControls/MapControls";
import dateToStringFormat from "../../../../utils/dateToStringFormat";
import dateRange from "../../../../utils/dateRange";

export default function ShowRouteOnMap() {
    const {travel} = useTravelContext()
    const {dayNumber} = useParams()
    const ref = useRef(/** @type{HTMLDivElement}*/null)

    const [map, setMap] = useState(/**@type{YMap}*/null)

    useEffect(() => {
        window.ymaps.ready(() => {
            const m = new YMap({
                container_id: 'on-map',
                points: [],
                location_icon: process.env.PUBLIC_URL + '/icons/location_on_24px.svg'
            })
            const route = travel.routeBuilder.getRouteByDay(+dayNumber)
            m
                .setContainerID('on-map')
                .showRoute(route, travel.routeBuilder.getRouteByDay(+dayNumber)[0]?.name || '')

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
                m.setBalloonToPoint(r.id, ballonOptions, {maxWidth: window.innerWidth * 0.6})
            })
            setMap(m)
            window.map = m
        })
        return () => map && map.destroyMap()
    }, [])

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
        <div
            ref={ref}
            id='on-map'
            className='flex-1 relative'
            style={{
                height: '100%',
            }}>
            <MapControls className='map-controls' map={map}/>
        </div>
    )
}
