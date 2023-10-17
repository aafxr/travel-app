import {Input} from "../ui";
import React, {useEffect, useState} from "react";
import {MS_IN_DAY} from "../../static/constants";

/**
 * компонент отрисовывает два поля для ввода диапазона дат
 * @param {string} startValue - стартовая дата в формате строки
 * @param {string} endValue - конечная дата в формате строки
 * @param {string} minDateValue - значение которое используется в качестве ограничения календаяря (делает не активной даты до указанной в ытом поле)
 * @param {Function} onChange - функция принимает измененные {start, end}
 * @returns {JSX.Element}
 * @category Components
 */
export default function DateRange({startValue, endValue, minDateValue = '', onChange}) {
    /*** дата начала диапазона */
    const [start, setStart] = useState('')
    /*** дата конца диапазона */
    const [end, setEnd] = useState('')

    /*** при обновлении startValue обновляется локальное состояние start */
    useEffect(() => {
        if (startValue) setStart(startValue)
    }, [startValue])

    /*** при обновлении endValue обновляется локальное состояние end */
    useEffect(() => {
        if (endValue) setEnd(endValue)
    }, [endValue])

    /**
     * обработчик устанавливает дату начала диапазона и смещает дату конца диапазона
     * @param {InputEvent} e
     */
    // код ниже- это обработчик <input  type="date" onchange="handleStartDateChange" />. почему в обработчике диапазон со временем уменьшается
    function handleStartDateChange(e) {
        // debugger
        if (start && end) {
            /*** instance Date начала диапазона */
            const start_date = new Date(start)
            /*** instance Date конца диапазона */
            const end_date = new Date(end)
            /*** число миллисекунд диапазона до изменения */
            const diff = end_date.getTime() - start_date.getTime()
            /*** instance Date новое значение выбранного диапазона */
            const current_date = new Date(e.target.valueAsDate.getTime())
            const st = current_date.toISOString()
            const en = new Date(current_date.getTime() + diff).toISOString()
            /*** обновление состояния start */
            setStart(st)
            /*** смещение конца диапазона относительно текущего выбранного значения на величину миллисекунд которая была до изменения диапазона */
            setEnd(en)
            onChange && onChange({start: st, end: en})
        } else {
            const st = e.target.valueAsDate.toISOString()
            /*** если значение конца диапазона не установленно, просто обновляем start */
            setStart(st)
            onChange && onChange({start: st, end})
        }
    }

    /***
     * обработчик обновляет конечное значение диаппазона дат
     * @param {InputEvent} e
     */
    function handleEndDateChange(e) {
        const newEnd = e.target.valueAsDate
        const en = newEnd.toISOString()
        setEnd(en)
        onChange && onChange({start, end: en})
    }


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