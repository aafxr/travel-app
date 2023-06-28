import React from "react";
import st from './Input.module.css'
import clsx from "clsx";

export default function Input(props){
const styles = clsx(st.input, props.className)


    return <div className={st.inputContainer}>
        <input {...props} className={styles}/>
    </div>
}