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
function Checkbox({
                      children,
                      className = '',
                      checked = false,
                      left,
                      onChange,
                      ...props
                  }, ref) {
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
        onChange && onChange(!checkedState)
    }

    return (
        <div className={styles} onClick={handler}>
            <input ref={ref} type="checkbox" checked={checkedState} onChange={handler} hidden/>
            <label>
                {children}
            </label>
            <div role='img' className={'checkbox-dot'}>
                <img className={clsx('img-abs', 'circle')} src={process.env.PUBLIC_URL + '/icons/checkbox-circle.svg'} alt="dot"/>
                <img className={clsx('img-abs', 'mark')} src={process.env.PUBLIC_URL + '/icons/checkbox-mark.svg'}  alt="dot"/>
            </div>
        </div>
    )
}

export default React.forwardRef(Checkbox)
