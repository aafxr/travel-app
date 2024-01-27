import clsx from "clsx";
import debounce from "lodash.debounce";
import React, {InputHTMLAttributes, useCallback, useEffect, useRef, useState} from "react";

import './Input.css'


interface InputPropsType extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    delay?: number
    value?: string
    onChange?: (value: string) => unknown
}

/**
 * Стилезованный компонент input
 * @kind component
 * @function
 * @param delay default = 0, задержка вызова onChange в мс
 * @param props пропс, которые допускает использовать react для компонента input
 * @param ref react ref на input
 * @returns {JSX.Element}
 * @category UI-Components
 * @name Input
 */

export default React.forwardRef<HTMLInputElement, InputPropsType>(({delay = 0, value, onChange, ...props}, ref) => {
    const [text, setText] = useState('')
    const change = useRef<Function>()
    const styles = clsx('input', props.className)

    useEffect(() => {
        change.current = onChange
    }, [onChange])

    useEffect(() => {
        if (value) setText(value)
    }, [value])


    useEffect(() => {
        if (text && onChange) handleChangeInput(text)
    }, [text])


    function handleEnterKeyUp(e: React.KeyboardEvent<HTMLInputElement>) {
        const el = e.target as HTMLInputElement
        if (e.keyCode === 13 || e.key === 'Enter') {
            el.blur()
        }
        props.onKeyUp && props.onKeyUp(e)
    }

    const handleChangeInput = useCallback(debounce((str: string) => {
        if(change.current)change.current(str)

    }, delay, {trailing: true}), [delay])


    return (
        <input
            ref={ref}
            {...props}
            value={text}
            className={styles}
            onKeyUp={handleEnterKeyUp}
            onChange={e => setText(e.target.value)}
        />
    )
})
