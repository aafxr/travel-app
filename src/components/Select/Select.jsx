import {useEffect, useRef, useState} from "react";

import './Select.css'
import clsx from "clsx";

/**
 * @param {string[]} options
 * @param {(selected: string) => unknown} onSelect
 * @param {React.HTMLAttributes<HTMLSelectElement>} props other select props
 * @return {JSX.Element}
 * @constructor
 */
export default function Select({options, onSelect, ...props}){
    const [_options, setOptions] = useState([])
    const selectedValue = useRef('')

    useEffect(() => {
        if(Array.isArray(options)){
            setOptions(options)
        }
    }, [options])

    /** @param {ChangeEvent<HTMLSelectElement>} e */
    function handleSelectChange(e){
        const {value} =  e.target
        if(onSelect && selectedValue.current !== value){
            selectedValue.current = value
            onSelect(value)
        }
    }

    return (
        <select {...props} className={clsx('select', props.className)} onChange={handleSelectChange}>
            {
                _options.map(o => (
                    <option key={o} value={o}>{o}</option>
                ))
            }
        </select>
    )
}