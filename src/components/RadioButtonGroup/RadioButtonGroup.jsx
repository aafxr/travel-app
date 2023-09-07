import clsx from "clsx";
import {useEffect, useState} from "react";

import Checkbox from "../ui/Checkbox/Checkbox";

/**
 * компонент для отрисовки чеклиста
 * @param {string} groupClassNames
 * @param {string} className
 * @param {string} title
 * @param {Object[]} checklist
 * @param {function} onChange
 * @param {'right' | 'left'} position default = 'right'
 * @param {boolean} multy
 * @param {string | string[]} initValue
 * @returns {JSX.Element|null}
 * @constructor
 */
export default function RadioButtonGroup({
                                             groupClassNames,
                                             className,
                                             title,
                                             checklist,
                                             onChange,
                                             position = 'right',
                                             multy = false,
                                             initValue
                                         }) {
    const classNames = clsx('column', className)
    const isLeft = position === 'left'
    const [selected, setSelected] = useState(multy ? [] : '')

    useEffect(() => {
        if (initValue) {
            if (multy && initValue && !Array.isArray(initValue)) {
                console.warn('[RadioButtonGroup] initValue must be array')
            } else {
                setSelected(initValue)
            }
        }
    }, [initValue, multy])

    if (!checklist || !checklist.length) {
        console.log('[RadioButtonGroup] list empty.')
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
        <div className={groupClassNames}>
            {!!title && <div className='title-bold'>{title}</div>}
            <div className={classNames}>
                {
                    checklist.map(c => (
                        <Checkbox
                            key={c.id}
                            left={isLeft}
                            onChange={() => handleChange(c)}
                            checked={multy ? selected.includes(c) : selected === c}
                        >
                            {c.title}
                        </Checkbox>
                    ))
                }
            </div>
        </div>
    )
}
