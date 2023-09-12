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
export default function useOutside(initialIsVisible, cb) {
    const [isOutside, setIsOutside] = useState(initialIsVisible || false);
    const ref = useRef(null);

    const handleClickOutside = useCallback((e) => {
        if (ref.current && !ref.current.contains(e.target)) {
            setIsOutside(true);
            cb && cb()
        }
    }, []);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside, true);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside, true);
        };
    });

    return { ref, isOutside, setIsOutside };
};