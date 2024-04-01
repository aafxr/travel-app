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
                                  className,
                                  node
                              }: DropDownPropsType<T>
) {
    const itemRef = useRef<HTMLLIElement>(null)
    const toastRef = useRef<HTMLUListElement>(null)
    const [selected, setSelected] = useState('')


    useEffect(() => {
        if (!itemRef.current || !toastRef.current) return
        const itemHeight = itemRef.current.offsetHeight
        toastRef.current.style.maxHeight = itemHeight * max + 'px'
    }, [itemRef.current, toastRef.current, max])


    useEffect(() => {
        if(!toastRef.current) return
        if(!node || !node.current) return

        const rect = node.current.getBoundingClientRect()
        toastRef.current.style.top = rect.bottom + 'px'
        toastRef.current.style.left = rect.left + 'px'
        toastRef.current.style.width = rect.width + 'px'

    }, [node])


    useEffect(() => {
        function handleKeyPress(e: KeyboardEvent){
            if(!items || !items.length) return
            if(!itemRef.current || !toastRef.current) return


            const {code} = e
            const idx = items.findIndex(item => item === selected)

            if(idx !== -1){
                const toastOffset = toastRef.current.offsetTop
                const toastHeight = toastRef.current.offsetHeight
                const pointerTop = itemRef.current.offsetHeight * (idx + 1)

                if(pointerTop < toastOffset){
                    toastRef.current.scrollTop = pointerTop
                }
                else if( pointerTop > toastOffset + toastHeight){
                    toastRef.current.scrollTop = pointerTop - toastOffset - toastHeight
                }
            }

            console.log(idx, toastRef.current.offsetTop)

            if (code === 'ArrowUp') {
                if (!selected) {
                    setSelected(items[items.length - 1])
                    return
                }
                if (idx !== -1) {
                    idx === 0
                        ? setSelected(items[items.length - 1])
                        : setSelected(items[idx - 1])

                }
            } else if(code === 'ArrowDown'){
                if (!selected) {
                    setSelected(items[0])
                    return
                }
                if (idx !== -1) {
                    idx === items.length - 1
                        ? setSelected(items[0])
                        : setSelected(items[idx + 1])
                }
            } else if(code === 'Enter' && selected){
                onSubmit && onSubmit(selected)
            }
        }

        document.addEventListener('keyup', handleKeyPress)
        return () => { document.removeEventListener('keyup', handleKeyPress) }
    }, [selected])


    function handleItemClick(item: string) {
        setSelected(item)
        onSubmit && onSubmit(item)
    }


    return createPortal((
        <ul ref={toastRef} className={clsx('dropdown', {visible}, className)}>
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