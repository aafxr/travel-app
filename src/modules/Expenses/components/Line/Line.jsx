import React from "react";
import st from './Line.module.css'


/**
 * @param {number} value значение 0 - 1, процент заполнения цветной полоски
 * @param {string} color
 * @returns {JSX.Element}
 * @constructor
 */
export default function Line({value, color}){

    return <div className={st.line}>
        <div
            className={st.front}
            style={{
                width: value * 100 + '%',
                backgroundColor: color
            }} />
    </div>
}