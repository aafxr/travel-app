import clsx from "clsx";
import React, {InputHTMLAttributes, useEffect, useState} from "react";

import './Input.css'

interface NumberInputPropsType extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
    delay?: number
    value?: number
    onChange?: (value: number) => unknown

}

export default React.forwardRef<HTMLInputElement, NumberInputPropsType>(({
                                                                             value,
                                                                             onChange,
                                                                             ...props
                                                                         }, ref) => {
    const [num, setNum] = useState('')
    const styles = clsx('input', props.className)

    useEffect(() => {
        if (typeof value === 'number') setNum((value).toString())
    }, [value])


    function handleEnterKeyUp(e: React.KeyboardEvent<HTMLInputElement>) {
        const el = e.target as HTMLInputElement
        if (e.keyCode === 13 || e.key === 'Enter') {
            el.blur()
        }
        props.onKeyUp && props.onKeyUp(e)
    }


    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const n = parseInt(e.target.value)
        setNum(e.target.value)
        if (onChange) onChange(n || 0)
    }


    return (
        <input
            ref={ref}
            {...props}
            type={'text'}
            inputMode={'numeric'}
            value={num}
            className={styles}
            onKeyUp={handleEnterKeyUp}
            onChange={handleChangeInput}
        />
    )
})