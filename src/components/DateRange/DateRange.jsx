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
    /** дата начала диапазона */
    const [start, setStart] = useState('')
    /** дата конца диапазона */
    const [end, setEnd] = useState('')

    /** при обновлении startValue обновляется локальное состояние start */
    useEffect(() => {
        if (startValue) setStart(startValue)
    }, [startValue])

    /** при обновлении endValue обновляется локальное состояние end */
    useEffect(() => {
        if (endValue) setEnd(endValue)
    }, [endValue])

    /** при изменении локального состояния (start / end) диапазон дат передается в callback onChange */
    useEffect(() => {
        if (
            onChange &&
            (
                (start && start !== startValue)
                || (end && end !== endValue)
            )
        ) {
            console.log({start, end})
            /** если состояние компонента изменилось (обновились значения start / end) вызывается callback onChange */
            onChange({start, end})
        }
    }, [start, end])


    /**
     * обработчик устанавливает дату начала диапазона и смещает дату конца диапазона
     * @param {InputEvent} e
     */
    function handleStartDateChange(e) {
        if (start && end) {
            /** instance Date начала диапазона */
            const start_date = new Date(start)
            /** instance Date конца диапазона */
            const end_date = new Date(end)
            /** число миллисекунд диапазона до изменения */
            const diff = end_date.getTime() - start_date.getTime()
            /** instance Date новое значение выбранного диапазона */
            const current_date = e.target.valueAsDate
            /** обновление состояния start */
            setStart(e.target.valueAsDate.toISOString())
            /** смещение конца диапазона относительно текущего выбранного значения на величину миллисекунд которая была до изменения диапазона */
            setEnd(new Date(current_date.getTime() + diff).toISOString().split("T").shift())
        } else {
            /** если значение конца диапазона не установленно, просто обновляем start */
            setStart(e.target.valueAsDate.toISOString())
        }
    }

    /**
     * обработчик обновляет конечное значение диаппазона дат
     * @param {InputEvent} e
     */
    function handleEndDateChange(e) {
        const newEnd = e.target.valueAsDate
        setEnd(newEnd.toISOString())
    }

    console.log({start, end, minDateValue})
    return (
        <div className='flex-stretch gap-0.25'>
            <Input
                type='date'
                placeholder={'Начало'}
                value={start ? start.split('T').shift() : ''}
                min={typeof minDateValue === 'string' ? minDateValue.split('T').shift() : ''}
                onChange={handleStartDateChange}
            />
            <Input
                type='date'
                placeholder={'Завершение'}
                value={end ? end.split('T').shift() : ''}
                min={(start || typeof minDateValue === 'string') ? (start || minDateValue).split('T').shift() : ''}
                onChange={handleEndDateChange}
            />
        </div>
    )
}