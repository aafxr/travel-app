import React, {useState} from "react";
import st from './Checkbox.module.css'
import clsx from "clsx";


/**
 * @param {JSX.Element} children
 * @param {string} className
 * @param {boolean} checked
 * @param {boolean} left - default = right сторона с которой отображается гконка
 * @param {function} [onChange]
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export default function Checkbox({
                                     children,
                                     className = '',
                                     checked = false,
                                     left,
                                     onChange,
                                     ...props
                                 }) {
    const [checkedState, setChecked] = useState(checked)

    const styles = clsx({
        [st.checkbox]: true,
        [st.checked]: checkedState,
        [st.left]: left,
        [st.right]: !left,
        [className]: true,
    })

    function handler(e) {
        setChecked(e.target.checked)
        onChange && onChange(e)
    }

    return (
        <div className={styles}>
            <label {...props} >
                <input type="checkbox" checked={checkedState} onChange={handler} hidden/>
                {children}
            </label>
            <div className={st.dot}>
                {!checkedState && <img className={clsx('img-abs', st.circle)}
                                       src={process.env.PUBLIC_URL + '/icons/checkbox-circle.svg'} alt="dot"/>}
                {checkedState &&
                    <img className={clsx('img-abs', st.mark)} src={process.env.PUBLIC_URL + '/icons/checkbox-mark.svg'}
                         alt="dot"/>}
            </div>
        </div>
    )
}