import React, {useEffect, useRef, useState} from "react";

import {YPlacemark, YandexMapContainer, YPolyline} from "../../../../components/YandexMap";
import {useTravel} from "../../../../contexts/AppContextProvider";
import {RoadStep} from "../../../../classes/StoreEntities/route/RoadStep";
import {PlaceStep} from "../../../../classes/StoreEntities/route/PlaceStep";
import {HotelStep} from "../../../../classes/StoreEntities/route/HotelStep";

export default function ShowRouteOnMap() {
    const travel = useTravel()
    const ref = useRef<HTMLDivElement>(null)

    const [points, setPoints] = useState<[number, number][]>([])

    useEffect(() => {
        if(!travel) return

        const pl:[number, number][] = travel
            .steps.filter(s => !(s instanceof RoadStep))
            .map((p, idx) => {
                if (p instanceof PlaceStep) return p.place.position
                if (p instanceof HotelStep) return p.place.position
                return [1000,1000]
            })
        setPoints(pl)
    }, [])

    // const lines: [string, Array<Place | Road>, string] = useMemo(() => {
    //     let list = [...groups.dayGroups.entries()].map(([day, g]) => ([day, g.items, g.color]))
    //     list = list.map(([day, g, color]) => ([day, (g as (Place | Road)[]).filter(i => i instanceof Place), color]))
    //
    //     for (let i = 1; i < list.length; i++) {
    //         const l1 = list[i - 1][1] as Array<Place>
    //         const l2 = list[i][1]as Array<Place>
    //         l2.unshift(l1[l1.length - 1])
    //     }
    //
    //     return list as unknown as [string, Array<Place | Road>, string]
    //
    // }, [groups.dayGroups])


    // useLayoutEffect(() => {
    //     if (ref.current) {
    //         ref.current.style.height = '100%'
    //         const parent = ref.current.parentElement
    //         if (parent) {
    //             const delta = parent.scrollHeight - parent.clientHeight
    //             ref.current.style.height = ref.current.offsetHeight - delta + 'px'
    //         }
    //     }
    // })


    if (!travel) return null

    if (travel.steps)
        return (
            <>
                <div
                    ref={ref}
                    id='on-map'
                    className='flex-1 relative'
                >
                    <YandexMapContainer style={{height: '100%'}}>
                        {points.map((p, idx) => (<YPlacemark key={idx} coordinates={p} iconContent={`${idx + 1}`}/>)) }
                        <YPolyline rout={points} strokeWidth={4}/>
                    </YandexMapContainer>
                </div>
            </>
        )

    return (
        <>
            <div
                ref={ref}
                id='on-map'
                className='flex-1 relative'
                style={{height: '100%'}}
            >
                {/*<IconButton*/}
                {/*    icon={<MapIcon/>}*/}
                {/*    title={'Детальный маршрут'}*/}
                {/*    className="map-detail-route-button" small*/}
                {/*/>*/}
                <YandexMapContainer style={{height: '100%'}}>
                    {travel.places.map((p, idx) => (
                        <YPlacemark key={idx} coordinates={p.location} iconContent={`${idx + 1}`}/>
                    ))}
                    <YPolyline rout={travel.places.map(p => p.location)} strokeWidth={4}/>
                </YandexMapContainer>
            </div>
        </>
    )
}

// {
//     lines.map(([day, places, color], i) => (
//         <div
//             key={i}
//             className='center'
//             style={{
//                 backgroundColor:'#fff',
//                 borderRadius: '2rem'
//             }}>
//             <span style={{backgroundColor: color as string, width:'15px', height: '3px'}}></span>
//             &nbsp;День {day}
//         </div>
//     ))
// }
