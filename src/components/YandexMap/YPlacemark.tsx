import useYMap from "./useYMap";
import { useEffect, useState} from "react";
import {Placemark} from "ymaps";

type YPlaceMarkPropsType = {
    // children: ReactElement,
    coordinates: [number, number]
}

export default function YPlaceMark({ coordinates}:YPlaceMarkPropsType){
    const [state, setState] = useState<Placemark>()
    const map = useYMap()

    useEffect(() => {
        if(!map) return
        if(state) map.geoObjects.remove(state)



        // const content =  ReactDOMServer.renderToString(children)
        const marker = new Placemark(coordinates, {
        });

        map.geoObjects.add(marker)
        setState(marker)

        return () => {map && state && map.geoObjects.remove(state)}
    },[map])

    return <></>
}