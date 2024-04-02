import clsx from "clsx";
import {createPortal} from "react-dom";
import React, {useEffect, useRef, useState} from "react";

import './DropDown.css'


type DropDownPropsType<T> = {
    items?: string[]
    visible?: boolean
    max?: number
    onSelect?: (item: string) => unknown
    onSubmit?: (item: string) => unknown
    onDropDownClose?: () => unknown
    className?: string
    node?: React.RefObject<T>
}


/**
 * компонент отображает выпадающий список
 * @param items - массив строк который будет отображен в выподающем списке
 * @param visible - флаг видимости списка
 * @param max - максимальное число эллеменото отображаемых в списке
 * @param onSelect - метод, вызывается при навигации по полям при помощи стрелок
 * @param onSubmit - метод, вызывается при клике/enter
 * @param onDropDownClose - метод вызывается при нажатии Esc
 * @param className - стили, применяются к корневому элементу списка
 * @param node - dom нода, к которой будет спозиционирован список
 * @constructor
 */
export default function DropDown<T extends HTMLElement>({
                                  items = [],
                                  visible = false,
                                  max = 5,
                                  onSelect,
                                  onSubmit,
                                  onDropDownClose,
                                  className,
                                  node
                              }: DropDownPropsType<T>
) {
    const itemRef = useRef<HTMLLIElement>(null)
    const rootRef = useRef<HTMLUListElement>(null)
    const [selected, setSelected] = useState('')


    useEffect(() => {
        if (!itemRef.current || !rootRef.current) return
        const itemHeight = itemRef.current.offsetHeight
        rootRef.current.style.maxHeight = itemHeight * max + 'px'
    }, [itemRef.current, rootRef.current, max])


    useEffect(() => {
        if(!rootRef.current) return
        if(!node || !node.current) return

        const rect = node.current.getBoundingClientRect()
        rootRef.current.style.top = rect.bottom + 'px'
        rootRef.current.style.left = rect.left + 'px'
        rootRef.current.style.width = rect.width + 'px'

    }, [node])


    useEffect(() => {
        function handleKeyPress(e: KeyboardEvent){
            if(!items || !items.length) return
            if(!itemRef.current || !rootRef.current) return

            const {code} = e
            const idx = items.findIndex(item => item === selected)

            if (code === 'ArrowUp') {
                if (!selected) {
                    setSelected(items[items.length - 1])
                    onSelect && onSelect(items[items.length - 1])
                } else if (idx !== -1) {
                    const selectedItem = idx === 0 ? items[items.length - 1] : items[idx - 1]
                    setSelected(selectedItem)
                    onSelect && onSelect(selectedItem)
                }
            } else if(code === 'ArrowDown'){
                if (!selected) {
                    setSelected(items[0])
                    onSelect && onSelect(items[0])
                } else if (idx !== -1) {
                    const selectedItem = idx === items.length - 1 ? items[0] : items[idx + 1]
                    setSelected(selectedItem)
                    onSelect && onSelect(selectedItem)
                }
            } else if(code === 'Enter' && selected){
                onSubmit && onSubmit(selected)
            } else if(code === 'Escape'){
                onDropDownClose && onDropDownClose()
            }
        }

        document.addEventListener('keyup', handleKeyPress)
        return () => { document.removeEventListener('keyup', handleKeyPress) }
    }, [selected])


    useEffect(() => {
        if(!items || !items.length) return
        if(!itemRef.current || !rootRef.current) return

        const idx = items.findIndex(item => item === selected)

        if(idx !== -1){
            const rootTopOffset = rootRef.current.scrollTop
            const rootHeight = rootRef.current.offsetHeight
            const itemHeight = itemRef.current.offsetHeight
            const pointerTop = itemHeight * idx

            if(pointerTop < rootTopOffset){
                rootRef.current.scrollTop = pointerTop
            }
            else if( pointerTop >= rootTopOffset + rootHeight){
                rootRef.current.scrollTop = pointerTop + itemHeight - rootHeight
            }
        }
    },[selected])


    function handleItemClick(item: string) {
        setSelected(item)
        onSubmit && onSubmit(item)
    }


    return createPortal((
        <ul ref={rootRef} className={clsx('dropdown', {visible}, className)}>
            {
                items?.map((item, idx) => (
                    <li
                        key={idx}
                        ref={itemRef}
                        className={clsx('dropdown-item', {active: selected === item})}
                        onClick={() => handleItemClick(item)}
                    >{item}</li>
                ))
            }
        </ul>
    ), document.body)
}