import {useEffect, useState} from "react";
import debounce from 'lodash.debounce'


/**
 * Хук добовляет "resize" listener,  который сробатывает с задержкой delay (что позволяет уменьшить количество rerender)
 * @param {number} delay default = 300 ms
 * @return {number}
 */
export default function useResize(delay = 300) {
    const [innerWith, setInnerWith] = useState(0)

    useEffect(() => {
        const cb = debounce(() => {
            setInnerWith(window.innerWidth)
        }, delay, {
            trailing: true
        })

        window.addEventListener('resize', cb)
        return () => window.removeEventListener('resize', cb)
    }, [])

    return innerWith
}