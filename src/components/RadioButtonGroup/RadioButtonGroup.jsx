import clsx from "clsx";
import {useEffect, useState} from "react";

import Checkbox from "../ui/Checkbox/Checkbox";

/**
 * @typedef CheckListType
 * @property {string} id
 * @property {string} title
 */

/**
 * компонент для отрисовки чеклиста
 * @param {string} groupClassNames - css класс корневова блока компонента
 * @param {string} className css class - css класс блока-контейнера группы Checkbox
 * @param {string} title
 * @param {CheckListType[]} checklist
 * @param {function} onChange
 * @param {'right' | 'left'} position default = 'right'
 * @param {boolean} multy - флаг, позволяющий выбирать несколько значений
 * @param {string | string[]} initValue
 * @returns {JSX.Element|null}
 * @category Components
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

    /*** инициялизация выбранных полей */
    useEffect(() => {
        if (initValue) setSelected(initValue)
    }, [initValue])

    if (!checklist || !checklist.length) {
        console.log('[RadioButtonGroup] list empty.')
        return null
    }

    /***
     * обработчик клика по Checkbox
     * @param {CheckListType} item
     */
    function handleChange(item) {
        let newSelected
        if (multy) {
            if (selected.includes(item)) newSelected = selected.filter(s => s !== item)
            else newSelected = [...selected, item]
        } else {
            newSelected = item
        }
        setSelected(newSelected)
        /*** передача выбранных элементов в родительский компонент */
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
