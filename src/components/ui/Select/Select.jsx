import React, {useState} from 'react'
import clsx from "clsx";

import './Select.css'
import useOutside from "../../../hooks/useOutside";


function Select({defaultValue = '', options, className, size = 4, border, ...props}, ref) {
    const [selected, setSelected] = useState(defaultValue)
    const [active, setActive] = useState(false)
    const {ref: selectMainRef} = useOutside(active, setActive.bind(this, () => false))

    function onSelectHandler(value) {
        if (active) {
            setSelected(value)
            setActive(!active)
        }
    }

    const selectStyle = {
        maxHeight: `calc( (var(--select-padding) * 2 + var(--select-height)) * ${active ? size + 1 : 1})`,
    }

    const selectClasses = clsx(
        'select column',
        {
            'active': active,
            'border': border
        },
        className
    )


    return (
        <div ref={selectMainRef} className={selectClasses}
             style={selectStyle}
        >
            <div className='select-header flex-between' onClick={() => setActive(!active)}>
                <div className='select-value center'>
                    {selected || ''}
                </div>
                <div className='select-chevron'/>
            </div>
            <select ref={ref} value={selected} onChange={() => {
            }} {...props} hidden>
                {
                    options && options.length && options.map(o => (
                        <option key={o} value={o}>{o}</option>
                    ))
                }
            </select>

            {
                options && options.length && options.map(o => (
                    <div key={o} className={clsx('select-item center', {'selected': selected === o})}
                         onClick={() => onSelectHandler(o)}
                    >
                        {o}
                    </div>
                ))
            }
        </div>
    )
}

export default React.forwardRef(Select)
