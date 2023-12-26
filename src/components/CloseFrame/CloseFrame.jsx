import React from 'react';

import './CloseFrame.css'
import clsx from "clsx";
import { PlusIcon} from "../svg";

/**
 * @param {React.HTMLAttributes<HTMLButtonElement>} props
 * @return {JSX.Element}
 * @constructor
 */
function CloseFrame(props) {
    return (
        <button {...props} className={clsx('close-frame', props.className)}>
            <PlusIcon/>
        </button>
    );
}

export default CloseFrame;