import React from "react";
import clsx from "clsx";

import './Checkbox.css'


/**
 * Компонент, аналогичный native \<input type="checkbox" /\>
 * @kind component
 * @function
 * @param {JSX.Element | string} children
 * @param {string} className css class
 * @param {boolean} checked флаг / состояние компонента чекбокс
 * @param {boolean} left default = right сторона с которой отображается гконка
 * @param {function} [onChange] обработчик на изменение состояния чекбокс
 * @param props
 * @returns {JSX.Element}
 * @category UI-Components
 * @name Checkbox
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
            ['checkbox gap-0.5']: true,
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
        <div {...props} className={styles} onClick={handler}>
            <input ref={ref} type="checkbox" checked={checked} onChange={handler} hidden/>
            <label className='flex-1'>
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
