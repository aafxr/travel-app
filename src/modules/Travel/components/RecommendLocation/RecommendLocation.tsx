import React from "react";

import durationToSting from "../../../../utils/date-utils/durationToString";

import './RecommendLocation.css'
import {CoordinatesType} from "../../../../types/CoordinatesType";

type RecommendLocation2PropsType = {
    to?: string
    items?: any
    moving?: number
}

type RecommendLocationPropsType = {
    from: CoordinatesType
    to: CoordinatesType
}

/**
 * Компоонент отображает рекомендованные места в периоды между активностями
 * @param  from
 * @param  to
 * @returns {JSX.Element}
 * @constructor
 */
export default function RecommendLocation({
                                              from,
                                              to,
                                              // items,
                                              // moving = 10
                                          }: RecommendLocationPropsType) {


    return (
        <div className='recommend-location'>
            <div className='column gap-0.5'>
                recomend
            </div>
        </div>
    )
}