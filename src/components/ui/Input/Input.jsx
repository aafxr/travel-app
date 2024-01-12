import React, {useCallback} from "react";
import clsx from "clsx";

import './Input.css'
import debounce from "lodash.debounce";


/**
 * Стилезованный компонент input
 * @kind component
 * @function
 * @param {number} delay default = 0, задержка вызова onInput / onChange в мс
 * @param {React.Attributes<HTMLInputElement>} props пропс, которые допускает использовать react для компонента input
 * @param {React.Ref<HTMLInputElement>} ref react ref на input
 * @returns {JSX.Element}
 * @category UI-Components
 * @name Input
 */
function Input({delay = 0, ...props}, ref) {
    const styles = clsx('input', props.className)

    function handleEnterKeyUp(e){
        if(e.keyCode === 13 || e.key === 'Enter'){
            e.target.blur()
        }
        props.onKeyUp && props.onKeyUp(e)
    }

    const handleChangeInput = useCallback(debounce(/**@param{ChangeEvent | InputEvent} e */ e => {
        console.log(e)

    }, delay, {trailing: true}), [delay])

    return (
            <input
                ref={ref}
                {...props}
                className={styles}
                onKeyUp={handleEnterKeyUp}
                onChange={handleChangeInput}
                onInput={handleChangeInput}
            />
    )
}

export default React.forwardRef(Input)
