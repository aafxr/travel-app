import {Input} from "../ui";
import React, {useEffect, useState} from "react";

/**
 * компонент отрисовывает два поля для ввода диапазона дат
 * @param {string} startValue - стартовая дата в формате строки
 * @param {string} endValue - конечная дата в формате строки
 * @param {string} minDateValue - значение которое используется в качестве ограничения календаяря (делает не активной даты до указанной в ытом поле)
 * @param {Function} onChange - функция принимает измененные {start, end}
 * @returns {JSX.Element}
 * @constructor
 */
export default function DateRange({startValue, endValue, minDateValue = '', onChange}) {
    /**  */
    const [start, setStart] = useState('')
    const [end, setEnd] = useState('')

    useEffect(() => {
        if (startValue) setStart(startValue)
    }, [startValue])

    useEffect(() => {
        if (endValue) setEnd(endValue)
    }, [endValue])

    useEffect(() => {
        if (
            onChange &&
            (
                (start && start !== startValue)
                || (end && end !== endValue)
            )
        ) {
            onChange({start, end})
        }
    }, [start, end])


    function handleStartDateChange(e) {
        if (start && end) {
            const start_date = new Date(start)
            const end_date = new Date(end)
            const diff = end_date - start_date
            const current_date = new Date(e.target.value)
            setStart(e.target.value)
            setEnd(new Date(current_date.getTime() + diff).toISOString().split("T").shift())
        } else {
            setStart(e.target.value)
        }
    }

    function handleEndDateChange(e) {
        const newEnd = new Date(e.target.value).toISOString()
        setEnd(newEnd)
    }


    return (
        <div className='flex-stretch gap-0.25'>
            <Input
                type='date'
                placeholder={'Начало'}
                value={start.split('T').shift()}
                min={minDateValue.split('T').shift()}
                onChange={handleStartDateChange}
                // onFocus={e => e.target.type = 'date'}
                // onBlur={e => e.target.type = 'text'}
            />
            <Input
                type='date'
                placeholder={'Завершение'}
                value={end.split('T').shift()}
                min={start || minDateValue.split('T').shift()}
                onChange={handleEndDateChange}
                // onFocus={e => e.target.type = 'date'}
                // onBlur={e => e.target.type = 'text'}
            />
        </div>
    )
}