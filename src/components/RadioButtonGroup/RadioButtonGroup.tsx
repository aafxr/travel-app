import clsx from "clsx";
import {useEffect, useState} from "react";

import Checkbox from "../ui/Checkbox/Checkbox";

export type RadioButtonGroupItemType = {
    id: number
    title: string
}

type RadioButtonGroupPropsType = {
    groupClassNames?: string
    className?: string
    title?: string
    checklist:RadioButtonGroupItemType[]
    onChange?: (selected:RadioButtonGroupItemType[]) => unknown
    position?:'right' | 'left'
    multy?: boolean
    init: RadioButtonGroupItemType | RadioButtonGroupItemType[]
}

/**
 * компонент для отрисовки чеклиста
 * @param {string} groupClassNames - css класс корневова блока компонента
 * @param {string} className css class - css класс блока-контейнера группы Checkbox
 * @param {string} title
 * @param {RadioButtonGroupItemType[]} checklist
 * @param {function} onChange
 * @param {'right' | 'left'} position default = 'right'
 * @param {boolean} multy - флаг, позволяющий выбирать несколько значений
 * @param {RadioButtonGroupItemType | RadioButtonGroupItemType[]} initValue
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
                                             init
                                         }:RadioButtonGroupPropsType) {
    const classNames = clsx('column', className)
    const isLeft = position === 'left'
    const [selected, setSelected] = useState<RadioButtonGroupItemType|RadioButtonGroupItemType[]>()

    /*** инициялизация выбранных полей */
    useEffect(() => {
        if (init) setSelected(init)
    }, [])

    if (!checklist || !checklist.length) {
        console.log('[RadioButtonGroup] list empty.')
        return null
    }

    /** обработчик клика по Checkbox  */
    function handleChange(item:RadioButtonGroupItemType) {
        let newSelected
        if (multy && Array.isArray(selected)) {
            if (selected.includes(item)) newSelected = selected.filter(s => s !== item)
            else newSelected = [...selected, item]
        } else  newSelected = item

        setSelected(newSelected)
        onChange && onChange(Array.isArray(newSelected)? newSelected : [newSelected])
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
                            checked={Array.isArray(selected) ? selected.includes(c) : selected === c}
                        >
                            {c.title}
                        </Checkbox>
                    ))
                }
            </div>
        </div>
    )
}
