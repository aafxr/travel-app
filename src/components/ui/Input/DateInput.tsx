import clsx from "clsx";
import React, {InputHTMLAttributes} from "react";

import './Input.css'


interface DateInputPropsType extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'min' | 'max'> {
    value?: Date
    onChange?: (date: Date) => unknown
    min?: Date,
    max?: Date
}


export default React.forwardRef<HTMLInputElement, DateInputPropsType>(({value, onChange,min,max, ...props}, ref) => {

    const className = clsx('input date-input', props.className)

    const dateToString = (date: Date) => date.toISOString().split('T').shift()


    function handleEnterKeyUp(e: React.KeyboardEvent<HTMLInputElement>) {
        const el = e.target as HTMLInputElement
        if (e.key === 'Enter') {
            el.blur()
        }
    }

    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (onChange && e.target.valueAsDate) onChange(e.target.valueAsDate)
    }


    return (
        <input
            {...props}
            ref={ref}
            type='date'
            className={className}
            value={value ? dateToString(value): undefined}
            min={min && dateToString(min)}
            max={max && dateToString(max)}
            onKeyUp={handleEnterKeyUp}
            onChange={handleChangeInput}
        />
    )
})