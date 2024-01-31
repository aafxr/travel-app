import React, {createContext, HTMLAttributes, PropsWithChildren, useEffect, useState} from "react";
import {YMapControls} from "./YMapControls/YMapControls";
import type {IMapState, Map} from "ymaps/index";

type YMapContextType = {
    map: Map | null
}

const defaultState: YMapContextType = {map: null}

export const YMapContext = createContext(defaultState)

interface YandexMapContainerType extends PropsWithChildren<HTMLAttributes<HTMLDivElement> & Partial<IMapState>>{
}

const MAP_ID = 'YMapsID'

export  function YandexMapContainer({children, id, zoom, center, ...props}: YandexMapContainerType) {
    const [state, setState] = useState(defaultState)

    useEffect(() => {
        window.ymaps.ready(() => {
            const node = document.getElementById(id || MAP_ID)
            if (!node) return

            const map = new window.ymaps.Map(node, {
                center: center || [50, 50],
                zoom: zoom || 10
            })

            setState({map})
        })
    }, [])


    return (
        <YMapContext.Provider value={state}>
            <div id={id || MAP_ID} {...props}>
                {children}
                <YMapControls />
            </div>
        </YMapContext.Provider>
    )
}