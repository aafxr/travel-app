import React, {useEffect, useRef, useState} from 'react'
import clsx from "clsx";

import useOutside from "../../../hooks/useOutside";

import './Select.css'


interface SelectPropsType  {
    defaultValue: string
    value: string
    options: string[]
    className: string
    size?: number
    border?: boolean
    onChange: (value: string) => void
}

/**
 * Компонент-селектор
 * @kind component
 * @function
 * @param {string} defaultValue значение, используемое по умолчанию
 * @param {string} value текущее значение
 * @param {string[]} options список опции, из которых будет осуществляться выбор
 * @param {string} className css class
 * @param {number} size количество отображаемых опций
 * @param {boolean} border флаг, добавляет стиль border
 * @param {(value: string) => void} onChange callback, вызывается при изменении состояния компонента
 * @param props other props
 * @returns {JSX.Element}
 * @category UI-Components
 * @name Select
 */
export default function Select(this:Function, {
                    defaultValue = '',
                    value,
                    options,
                    className,
                    size = 4,
                    border,
                    onChange
                }: SelectPropsType) {
    const [selected, setSelected] = useState(defaultValue)
    const [active, setActive] = useState(false)
    const {ref: selectMainRef} = useOutside<HTMLDivElement>(active, setActive.bind(this, () => false))
    const headerRef = useRef<HTMLDivElement>(null)

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

    function onSelectHandler(value: string, e: React.MouseEvent<HTMLDivElement>) {
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
            <div ref={headerRef} className='select-header' onClick={() => setActive(!active)}>
                <div className='select-value'>
                    {selected || ''}
                </div>
                <ChevronDown className='select-chevron' />
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
                value={selected}
                onChange={(e) => e.stopPropagation()}
                hidden
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


function ChevronDown({className}: { className?: string }){

     return (
         <svg className={className} viewBox="0 0 24 24"  xmlns="http://www.w3.org/2000/svg">
             <path d="M16 10L12 14L8 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
         </svg>
     )
}
