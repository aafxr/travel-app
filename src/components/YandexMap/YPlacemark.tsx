import {useYMap} from "./useYMap";
import {useEffect, useState} from "react";
import type {Placemark} from "ymaps/index";

type YPlaceMarkPropsType = {
    // children: ReactElement,
    coordinates: [number, number],
    iconContent?: string,
    icon?: {
        url: string,
        size: [number, number]
    }
}


const iconURL = process.env.PUBLIC_URL + '/icons/location_on_24px.svg'
const iconSize = [32, 32]


export function YPlacemark({coordinates, iconContent, icon}: YPlaceMarkPropsType) {
    const [state, setState] = useState<Placemark>()
    const map = useYMap()

    useEffect(() => {
        if (!map) return
        if (state) map.geoObjects.remove(state)

        const url = icon ? icon.url : iconURL
        const size = icon ? icon.size : iconSize
        const iconOffset = icon
            ? [-icon.size[0] * 0.5, -icon.size[1]]
            : [-iconSize[0] * 0.5, -iconSize[1]]

        const iconContentLayout = window.ymaps.templateLayoutFactory.createClass(
            '<div style="color: #FFFFFF; background-color: #FF8E09; font-size: 9px;transform: translate(-50%, -50%)">$[properties.iconContent]</div>'
        )


        const marker = new window.ymaps.Placemark(coordinates, {
            iconContent: iconContent || ''
        }, {
            iconLayout: 'default#imageWithContent',
            iconImageHref: url,
            iconImageSize: size,
            iconImageOffset: iconOffset,
            iconContentOffset: [size[0] * 0.5, size[1] * 0.375],
            draggable: false,
            cursor: 'pointer',
            iconContentLayout,
        })

        map.geoObjects.add(marker)
        setState(marker)

        return () => {
            map && state && map.geoObjects.remove(marker)
        }
    }, [map, coordinates, iconContent, icon])

    return <></>
}