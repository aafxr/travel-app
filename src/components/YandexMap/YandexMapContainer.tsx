import React, {createContext, HTMLAttributes, PropsWithChildren, useEffect, useState} from "react";
import {YMap} from "ymaps3";

type YMapContextType = {
    map: YMap | null
}

const defaultState: YMapContextType = {map: null}

export const YMapContext = createContext(defaultState)

interface YandexMapContainerType extends PropsWithChildren<HTMLAttributes<HTMLDivElement>> {}

const MAP_ID = 'YMapsID'

export default function YandexMap({children, id, ...props}: YandexMapContainerType) {
    const [state, setState] = useState(defaultState)

    useEffect(() => {
        const node = document.getElementById(id || MAP_ID)
        if (!node) return

        const map = new ymaps3.YMap(node, {
            location: {
                zoom: 10,
            }
        })
        setState({map})
    }, [])


    return (
        <YMapContext.Provider value={state}>
            <div id={id || MAP_ID} {...props}>{children}</div>
        </YMapContext.Provider>
    )
}