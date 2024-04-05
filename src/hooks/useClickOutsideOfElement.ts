import React, {useEffect, useState} from "react";

export default function useClickOutsideOfElement<T extends HTMLElement>(ref: React.RefObject<T>){
    const [outside, setOutside] = useState<boolean>(false)
    useEffect(() => {
        if(!ref || !ref.current) return

        const handleClick = (e: MouseEvent | TouchEvent) => {
            if(ref.current?.contains(e.target as HTMLElement)) {
                setOutside(false)
            } else {
                setOutside(true)
            }
        }

        document.addEventListener('click', handleClick)
        document.addEventListener('touchend', handleClick)
        return () => {
            document.removeEventListener('click', handleClick)
            document.removeEventListener('touchend', handleClick)
        }
    }, [ref])

    console.log(outside)
    return outside
}