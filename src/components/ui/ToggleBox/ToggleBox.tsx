import clsx from "clsx";
import {useEffect, useState} from "react";

import './ToggleBox.css'

type ToggleBoxPropsChange = {
    init?: boolean
    title?: string
    className?: string
    subtitle?: string
    onChange?: (enable: boolean) => unknown
    right?: boolean
}


/**
 * __ToggleBox__ component
 * @function
 * @name ToggleBox
 * @param {boolean} init initial value
 * @param {string} title надпись, отображаемая в компоненте
 * @param {string} subtitle надпись, отображаемая в компоненте
 * @param {string} className css class
 * @param {function} onChange handler, вызываеся при изменении состояниея компонента
 * @param {boolean} right default = false,
 * @returns {JSX.Element}
 * @category UI-Components
 */
export default function ToggleBox({
                                      init,
                                      title,
                                      className,
                                      subtitle,
                                      onChange,
                                      right = false
                                  }: ToggleBoxPropsChange) {
    const [active, setActive] = useState(false)

    const cn = clsx(
        'toggle-box',
        active && 'active',
        right && 'reverse',
        className
    )

    useEffect(() => {
        if (typeof init === 'boolean') setActive(init)
    }, [])

    function handleChange() {
        setActive(!active)
        onChange && onChange(!active)
    }

    return (
        <div
            className={cn}
            onClick={handleChange}
        >
            <div className='toggle-box-thumb'/>
            <div className="toggle-box-content">
                {!!title && <div className='toggle-box-title'>{title}</div>}
                {!!subtitle && <div className='toggle-box-subtitle'>{subtitle}</div>}
            </div>
        </div>
    )
}
