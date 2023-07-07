import {useCallback, useEffect, useRef, useState} from 'react';


/**
 * хук реагирует на клики не по заданному в ref  компоненту
 *
 *
 * возвращает { ref, isShow, setIsShow }
 * @param {boolean} initialIsVisible
 * @returns {{ref: React.MutableRefObject<null>, setIsShow: (value: unknown) => void, isShow: unknown}}
 */
export const useOutside = (initialIsVisible) => {
    const [isShow, setIsShow] = useState(initialIsVisible);
    const ref = useRef(null);

    const handleClickOutside = useCallback((e) => {
        if (ref.current && !ref.current.contains(e.target)) {
            setIsShow(false);
        }
    }, []);

    useEffect(() => {
        document.addEventListener('click', handleClickOutside, true);

        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    });

    return { ref, isShow, setIsShow };
};