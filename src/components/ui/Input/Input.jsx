import React from "react";
import clsx from "clsx";

import './Input.css'

function Input(props, ref) {
    const styles = clsx('input-container', props.className)

    return (
        <div className={styles}>
            <input ref={ref} {...props} className='input'/>
        </div>
    )
}

export default React.forwardRef(Input)
