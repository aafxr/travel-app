import React from "react";
import clsx from "clsx";

import './Input.css'

function Input(props, ref) {
    const styles = clsx('input-container', props.className)

    function handleEnterKeyUp(e){
        if(e.keyCode === 13 || e.key === 'Enter'){
            e.target.blur()
        }
        props.onKeyUp && props.onKeyUp(e)
    }

    return (
        <div className={styles}>
            <input ref={ref}  {...props} onKeyUp={handleEnterKeyUp} className='input'/>
        </div>
    )
}

export default React.forwardRef(Input)
