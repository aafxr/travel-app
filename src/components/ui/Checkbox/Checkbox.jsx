import React from "react";
import clsx from "clsx";

import './Checkbox.css'


/**
 * @param {JSX.Element | string} children
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

    const styles = clsx({
            ['checkbox']: true,
            ['checked']: checked,
            ['left']: left,
            ['right']: !left,
        },
        className
    )

    function handler(e) {
        onChange && onChange(!checked)
    }

    return (
        <div className={styles} onClick={handler}>
            <input ref={ref} type="checkbox" checked={checked} onChange={handler} hidden/>
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
