import clsx from "clsx";
import {useState} from "react";

import Checkbox from "../ui/Checkbox/Checkbox";

/**
 * компонент для отрисовки чеклиста
 * @param {string} className
 * @param {string} title
 * @param {string[]} checklist
 * @param {function} onChange
 * @param {'right' | 'left'} position default = 'right'
 * @param {boolean} multy
 * @returns {JSX.Element|null}
 * @constructor
 */
export default function RadioButtonGroup({className, title, checklist, onChange, position = 'right', multy = false}) {
    const classNames = clsx('column', className)
    const isLeft = position === 'left'
    const [selected, setSelected] = useState(multy ? [] : '')

    if (!checklist || !checklist.length) {
        console.warn('RadioButtonGroup list empty.')
        return null
    }

    function handleChange(item) {
        let newSelected
        if (multy) {
            if (selected.includes(item)) {
                newSelected = selected.filter(s => s !== item)
                setSelected(newSelected)
            } else {
                newSelected = [...selected, item]
                setSelected(newSelected)
            }
        } else {
            newSelected = item
            setSelected(newSelected)
        }
        onChange && onChange(newSelected)
    }

    return (
        <div>
            <div className='title-bold'>{title}</div>
            <div className={classNames}>
                {
                    checklist.map(c => (
                        <Checkbox
                            key={c}
                            left={isLeft}
                            onChange={() => handleChange(c)}
                            checked={multy ? selected.includes(c) : selected === c}
                        >
                            {c}
                        </Checkbox>
                    ))
                }
            </div>
        </div>
    )
}
