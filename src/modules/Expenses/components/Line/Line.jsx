import React from "react";
import st from './Line.module.css'

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