import React, {useEffect, useRef, useState} from "react";


import './Toast.css'
import clsx from "clsx";

type ToastPropsType = {
    items?: string[]
    visible?: boolean
    max?: number
    onSelect?: (item: string) => unknown
    onSubmit?: (item: string) => unknown
    className?: string
}


const testString = [
    'testString 1',
    'testString 2',
    'testString 3',
    'testString 4',
    'testString 5',
    'testString 6',
]

export default function Toast({
                                  items = testString,
                                  visible = false,
                                  max = 5,
                                  onSelect,
                                  onSubmit,
                                  className
                              }: ToastPropsType
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
        function handleKeyPress(e: KeyboardEvent){
            if(!items || !items.length) return
            if(!itemRef.current || !toastRef.current) return


            const {code} = e
            const idx = items.findIndex(item => item === selected)
            const toastOffset = toastRef.current.offsetTop
            const toastHeight = toastRef.current.offsetHeight
            const pointerTop = itemRef.current.offsetHeight * idx

            if(pointerTop < toastOffset){
                toastRef.current.offsetTop = pointerTop
            }
                else if( pointerTop > toastOffset + toastHeight){
                toastRef.current.offsetTop =
            }
            const itemHeight = itemRef.current.offsetHeight
            const offset = (idx - max + 1) * itemHeight
            console.log(idx, offset)
            if(offset >= 0) toastRef.current.scrollTop = offset

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
            }
        }

        document.addEventListener('keyup', handleKeyPress)
        return () => { document.removeEventListener('keyup', handleKeyPress) }
    }, [selected])


    function handleItemClick(item: string) {
        onSubmit && onSubmit(item)
    }


    return (
        <ul ref={toastRef} className={clsx('toast', {visible}, className)}>
            {
                items?.map((item, idx) => (
                    <li
                        key={idx}
                        ref={itemRef}
                        className={clsx('toast-item', {active: selected === item})}
                        onClick={() => handleItemClick(item)}

                    >{item}</li>
                ))
            }
        </ul>
    )
}