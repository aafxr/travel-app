import {useEffect, useLayoutEffect, useRef, useState} from "react";
import YMap from "../../../../classes/YMap";
import useTravelContext from "../../../../hooks/useTravelContext";
import {useParams} from "react-router-dom";
import MapControls from "../../../../components/MapControls/MapControls";

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
            m
                .setContainerID('on-map')
                .showRoute(travel.routeBuilder.getRouteByDay(+dayNumber), travel.routeBuilder.getRouteByDay(+dayNumber)[0]?.name || '')
            setMap(m)
            window.map = m
        })
        return () => map && map.destroyMap()
    }, [])

    useLayoutEffect(() => {
        if(ref.current){
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
            <MapControls className='map-controls' map={map} />
        </div>
    )
}