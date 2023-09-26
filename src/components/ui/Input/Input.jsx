import React from "react";
import clsx from "clsx";

import './Input.css'


/**
 *
 * @param {HTMLInputElement} props
 * @param ref
 * @returns {JSX.Element}
 * @constructor
 */
function Input(props, ref) {
    const styles = clsx('input', props.className)

    function handleEnterKeyUp(e){
        if(e.keyCode === 13 || e.key === 'Enter'){
            e.target.blur()
        }
        props.onKeyUp && props.onKeyUp(e)
    }

    return (
            <input
                ref={ref}
                {...props}
                className={styles}
                onKeyUp={handleEnterKeyUp}  />
    )
}

export default React.forwardRef(Input)
