import React, {useState} from "react";
import './Checkbox.css'
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
        ['checkbox']: true,
        ['checked']: checkedState,
        ['left']: left,
        ['right']: !left,
    },
        className
    )

    function handler(e) {
        setChecked(prev => !prev)
        onChange && onChange(!checked)
    }

    return (
        <div className={styles} onClick={() => setChecked(prev => !prev)}>
            <label {...props} >
                <input type="checkbox" checked={checkedState} onChange={handler} hidden/>
                {children}
            </label>
            <div className={'checkbox-dot'}>
                {!checkedState && <img className={clsx('img-abs', 'circle')}
                                       src={process.env.PUBLIC_URL + '/icons/checkbox-circle.svg'} alt="dot"/>}
                {checkedState &&
                    <img className={clsx('img-abs', 'mark')} src={process.env.PUBLIC_URL + '/icons/checkbox-mark.svg'}
                         alt="dot"/>}
            </div>
        </div>
    )
}