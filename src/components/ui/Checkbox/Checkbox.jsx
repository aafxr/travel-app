import React, {useState} from "react";
import st from './Checkbox.module.css'
import clsx from "clsx";


/**
 * @param {JSX.Element} children
 * @param {string} className
 * @param {boolean} left - default = right сторона с которой отображается гконка
 * @param {function} [onChange]
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export default function Checkbox({children, className, left, onChange,...props}){
    const [checked, setChecked] = useState(false)

    const styles = clsx({
        [st.checkbox]: true,
        [st.checked]: checked,
        [st.left]: left,
        [st.right]: !left,
        className
    })

    function handler(e){
        setChecked(e.target.checked)
        onChange && onChange(e.target.checked)
    }

    return(
        <div className={styles}>
            <label {...props} >
                <input type="checkbox" checked={checked} onChange={handler} hidden />
                {children}
            </label>
            <div className={st.dot}>
                {!checked && <img className={clsx('img-abs', st.circle)} src={process.env.PUBLIC_URL + '/icons/checkbox-circle.svg'} alt="dot"/>}
                {checked && <img className={clsx('img-abs', st.mark)} src={process.env.PUBLIC_URL + '/icons/checkbox-mark.svg'} alt="dot"/>}
            </div>
        </div>
    )
}