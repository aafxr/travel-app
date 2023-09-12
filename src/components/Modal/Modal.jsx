import {forwardRef, useEffect} from "react";

import {useKeyPress} from "../../hooks/useKeyPress";

import "./Modal.css";

function Modal({
                   children,
                   isVisible,
                   close ,
                   submit ,
                   ...props
               }, ref) {
    const [enter, esc] = useKeyPress([13, 27], true);
    // const isDisabled = props.disabled === "undefined" ? false : props.disabled;

    useEffect(() => {
        if (isVisible) {
            if (enter) {
                submit && submit();
            } else if (esc) {
                close && close();
            }
        }
    }, [enter, esc]);

    if (!isVisible) return null;

    return (
        <div className={'modal'}>
            <div className={'modal-backplate'} onMouseDown={() => close && close()}></div>
            <div ref={ref} className={'modal-wrapper'}>
                {/*<div className={'modal-close'} onMouseDown={() => close && close()}>*/}
                {/*    <PlusIcon />*/}
                {/*</div>*/}
                {children}
            </div>
        </div>
    );
}

export default forwardRef(Modal);
