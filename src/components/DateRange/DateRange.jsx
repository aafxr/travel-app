import React, {useEffect, useState} from "react";

import {Input} from "../ui";
import {MS_IN_DAY} from "../../static/constants";


/***
 * @type {DateRangeType}
 */
const defaultValue = {
    start: '',
    end: ''
}
/**
 * компонент отрисовывает два поля для ввода диапазона дат
 * @name DateRange
 * @param {DateRangeType} init - инициализация диапазона дат
 * @param {number} daysCount - количество дней
 * @param {string} minDateValue - значение которое используется в качестве ограничения календаяря (делает не активной даты до указанной в ытом поле)
 * @param {Function} onChange - функция принимает измененные {start, end}
 * @returns {JSX.Element}
 * @category Components
 */
export default function DateRange({init, daysCount, minDateValue = '', onChange}) {
    /*** диапазона дат */
    const [range, setRange] = useState(/***@type{{start: string, end: string}} */defaultValue)

    useEffect(() => {
        if (init && init.start && init.end) {
            setRange(init)
        } else console.warn('Не коректая инициализация RangeDate')
    }, [init])


    /***
     * обработчик устанавливает дату начала диапазона и смещает дату конца диапазона
     * @param {InputEvent} e
     */
    function handleStartDateChange(e) {
        if (typeof daysCount === 'number' && daysCount > 0) {
            const start_date = new Date(e.target.valueAsDate.getTime())
            const end_date = new Date(start_date.getTime() + MS_IN_DAY * daysCount)
            /***@type{DateRangeType}*/
            const newRange = {start: start_date.toISOString(), end: end_date.toISOString()}
            setRange(newRange)
            onChange && onChange(newRange)
        } else if (range.start && range.end) {
            /*** instance Date начала диапазона */
            const start_date = new Date(range.start)
            /*** instance Date конца диапазона */
            const end_date = new Date(range.end)
            /*** число миллисекунд диапазона до изменения */
            const diff = end_date.getTime() - new Date(start_date).getTime()
            /*** instance Date новое значение выбранного диапазона */
            const current_date = new Date(e.target.valueAsDate.getTime())
            const st = current_date.toISOString()
            const en = new Date(current_date.getTime() + diff).toISOString()
            /*** обновление состояния range
             * @type {DateRangeType}
             */
            const newRange = {start: st, end: en}
            setRange(newRange)
            onChange && onChange(newRange)
        } else {
            const st = e.target.valueAsDate.toISOString()
            /*** если значение конца диапазона не установленно, просто обновляем range.start
             * @type {DateRangeType}
             */
            const newRange = {...range, start: st}
            setRange(newRange)
            onChange && onChange(newRange)
        }
    }

    /***
     * обработчик обновляет конечное значение диаппазона дат
     * @param {InputEvent} e
     */
    function handleEndDateChange(e) {
        const end_date = new Date(e.target.valueAsDate.getTime())
        if (typeof daysCount === 'number' && daysCount > 0) {
            const start_date = new Date(end_date.getTime() - MS_IN_DAY * daysCount)
            /***@type {DateRangeType}*/
            const newRange = {start: start_date.toISOString(), end: end_date.toISOString()}
            setRange(newRange)
            onChange && onChange(newRange)
        } else {
            const en = end_date.toISOString()
            /***@type {DateRangeType}*/
            const newRange = {...range, end: en}
            setRange(newRange)
            onChange && onChange(newRange)
        }

    }


    return (
        <div className='flex-stretch gap-0.25'>
            <Input
                type='date'
                placeholder={'Начало'}
                value={range.start ? range.start.split('T').shift() : ''}
                min={typeof minDateValue === 'string' ? minDateValue.split('T').shift() : ''}
                onChange={handleStartDateChange}
            />
            <Input
                type='date'
                placeholder={'Завершение'}
                value={range.end ? range.end.split('T').shift() : ''}
                min={(range.start || typeof minDateValue === 'string') ? (range.start || minDateValue).split('T').shift() : ''}
                onChange={handleEndDateChange}
            />
        </div>
    )
}