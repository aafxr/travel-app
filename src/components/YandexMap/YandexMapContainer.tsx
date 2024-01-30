import React, {createContext, HTMLAttributes, PropsWithChildren, useEffect, useRef, useState} from "react";
import ymaps from "ymaps";

type YMapContextType = {
    map: ymaps.Map | null
}

const defaultState: YMapContextType = {map: null}

export const YMapContext = createContext(defaultState)

interface YandexMapContainerType extends PropsWithChildren<HTMLAttributes<HTMLDivElement>> {
}

const MAP_ID = 'YMapsID'

export default function YandexMapContainer({children, id, ...props}: YandexMapContainerType) {
    const [state, setState] = useState(defaultState)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!ref.current) return
        ymaps.ready(() => {
            const node = document.getElementById(id || MAP_ID)
            if (!node) return

            const map = new ymaps.Map(node, {
                center: [37.64, 55.76],
                zoom: 10
            })

            setState({map})
        })
    }, [])


    return (
        <YMapContext.Provider value={state}>
            <div ref={ref} id={id || MAP_ID} {...props}>{children}</div>
        </YMapContext.Provider>
    )
}