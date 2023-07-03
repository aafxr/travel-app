import React from "react";
import st from './Input.module.css'
import clsx from "clsx";

export default function Input(props){
const styles = clsx(st.inputContainer, props.className)

    return <div className={styles}>
        <input {...props} className={st.input}/>
    </div>
}