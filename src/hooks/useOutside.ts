import {useCallback, useEffect, useRef, useState} from 'react';


/**
 * хук реагирует на клики не по заданному в ref  компоненту
 *
 *
 * возвращает { ref, isShow, setIsShow }
 * @param {boolean} initialIsVisible
 * @param {function} cb
 * @returns {{ref: React.MutableRefObject<null>, setIsOutside: (value: (((prevState: boolean) => boolean) | boolean)) => void, isOutside: boolean}}
 */
export default function useOutside<T extends HTMLElement>(initialIsVisible: boolean, cb: Function) {
    const [isOutside, setIsOutside] = useState(initialIsVisible || false);
    const ref = useRef<T>(null);

    const handleClickOutside = useCallback((e: Event) => {
        if(e instanceof TouchEvent ||  e instanceof MouseEvent) {
            if (e.target instanceof Node && ref.current && !ref.current.contains( e.target)) {
                setIsOutside(true);
                cb && cb()
            }
        }
    }, []);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside, true);

        return () =>  document.removeEventListener('mousedown', handleClickOutside, true);
    });

    return { ref, isOutside, setIsOutside };
};