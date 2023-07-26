import React, {useEffect, useRef, useState} from 'react'
import clsx from "clsx";

import useOutside from "../../../hooks/useOutside";

import './Select.css'


function Select({
                    defaultValue = '',
                    value,
                    options,
                    className,
                    size = 4,
                    border,
                    onChange,
                    ...props},
                ref) {
    const [selected, setSelected] = useState(defaultValue)
    const [active, setActive] = useState(false)
    const {ref: selectMainRef} = useOutside(active, setActive.bind(this, () => false))
    const headerRef = useRef()

    useEffect(()=>{
        value && setSelected(value)
    }, [value])

    useEffect(() => {
        if (selectMainRef.current && headerRef.current) {
            selectMainRef.current.style.maxHeight = headerRef.current
                ? headerRef.current.getBoundingClientRect().height * (active ? size + 1 : 1) + 'px'
                : '0'
        }
    }, [selectMainRef.current, headerRef.current, active])

    function onSelectHandler(value, e) {
        e.stopPropagation()
        if (active) {
            setSelected(value)
            setActive(!active)
            onChange && onChange(value)
        }
    }

    const selectClasses = clsx(
        className,
        'select column hide-scroll',
        {
            'active': active,
            'border': border
        },
    )


    return (
        <div ref={selectMainRef} className={selectClasses}>
            <div ref={headerRef} className='select-header flex-between' onClick={() => setActive(!active)}>
                <div className='select-value'>
                    {selected || ''}
                </div>
                <div className='select-chevron'/>
            </div>
            <div
                className='select-options column hide-scroll'
                style={{
                    height: 100 * size / (size + 1) + '%'
                }}
            >
                {
                    options && options.length && options.map(o => (
                        <div
                            key={o}
                            className={clsx('select-item', {'selected': selected === o})}
                            onClick={(e) => onSelectHandler(o, e)}
                        >
                            {o}
                            <span/>
                        </div>
                    ))
                }
            </div>
            <select
                ref={ref}
                value={selected}
                onChange={(e) => e.stopPropagation()}
                hidden
                {...props}
            >
                {
                    options && options.length && options.map(o => (
                        <option key={o} value={o}>{o}</option>
                    ))
                }
            </select>
        </div>
    )
}

export default React.forwardRef(Select)
