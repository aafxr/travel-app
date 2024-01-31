import {useYMap} from "./useYMap";
import {useEffect, useState} from "react";
import type {Polyline} from "ymaps/index";

type YPolylinePropsType = {
    rout: [number, number][],
    strokeColor?: string,
    strokeWidth?: number,
}


export function YPolyline({rout, strokeColor, strokeWidth}: YPolylinePropsType) {
    const [state, setState] = useState<Polyline>()
    const map = useYMap()

    useEffect(() => {
        if (!map) return
        if (state) map.geoObjects.remove(state)

        const polyline = new window.ymaps.Polyline(rout, {}, {
            draggable: false,
            strokeColor: strokeColor || "#FF8E09",
            strokeWidth: strokeWidth !== undefined ? strokeWidth : 4,
        })

        map.geoObjects.add(polyline)

        setState(polyline)
        return () => {
            map && map.geoObjects.remove(polyline)
        }
    }, [map, rout, strokeColor, strokeWidth])

    return <></>
}