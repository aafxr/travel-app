import React, {useState} from 'react'
import clsx from "clsx";


 function Select({options, className, size = 4, ...props}, ref){
     const [selected, setSelected] = useState((options && options[0]) || '')

     function onSelectHandler(value){
         setSelected(value)
     }

    return (
        <div className={clsx('select', className)}
        style={{
            height: `calc(var(--select-height) * ${size})`,
        }}
        >
            <div className='select-value'>
                {selected || ''}
            </div>
            <select ref={ref} {...props} hidden>
                {
                    options && options.length && options.map( o => (
                        <option key={o} value={o} selected={selected === o}>{o}</option>
                    ))
                }
            </select>

            {
                options && options.length && options.map( o => (
                    <div  className={clsx(
                        'select-item',
                        {
                            'selected': selected === o,
                        }
                    )}
                          onClick={()=> onSelectHandler(o)}
                    >
                        {o}
                    </div>
                ))
            }
        </div>
    )
}

export default React.forwardRef(Select)
