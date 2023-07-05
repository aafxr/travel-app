import React from "react";
import clsx from "clsx";

import st from './Input.module.css'

function Input(props, ref) {
    const styles = clsx(st.inputContainer, props.className)

    return (
        <div className={styles}>
            <input ref={ref} {...props} className={st.input}/>
        </div>
    )
}

export default React.forwardRef(Input)
