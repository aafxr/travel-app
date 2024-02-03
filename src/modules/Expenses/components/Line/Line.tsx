import React from "react";
import './Line.css'

type LinePropsType = {
    value: number
    color: string
}

/**
 * @param {number} value значение 0 - 1, процент заполнения цветной полоски
 * @param {string} color
 * @returns {JSX.Element}
 * @constructor
 */
export default function Line({value, color}: LinePropsType){

    return <div className={'line'}>
        <div
            className={'line-front'}
            style={{
                width: value * 100 + '%',
                backgroundColor: color
            }} />
    </div>
}