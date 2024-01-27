import React, {useEffect, useState} from "react";

import {Input} from "../ui";
import DateInput from "../ui/Input/DateInput";


type DateRangeType = { start: Date | undefined, end: Date | undefined }


type DateRangePropsType = {
    init?: DateRangeType,
    minDate?: Date,
    maxDate?: Date,
    onChange?: (date: Partial<DateRangeType>) => unknown
}

/**
 * компонент отрисовывает два поля для ввода диапазона дат
 * @name DateRange
 * @param {DateRangeType} init - инициализация диапазона дат
 * @param {Date} minDate - значение которое используется в качестве ограничения календаяря (делает не активной даты до указанной в ытом поле)
 * @param {Date} maxDate - значение которое используется в качестве ограничения календаяря (делает не активной после даты указанной в этом поле)
 * @param {Function} onChange - функция принимает измененные {start, end}
 * @returns {JSX.Element}
 * @category Components
 */
export default function DateRange({
                                      init,
                                      minDate,
                                      maxDate,
                                      onChange
                                  }: DateRangePropsType) {
    /*** диапазона дат */
    const [range, setRange] = useState<DateRangeType>({start: undefined, end: undefined})

    useEffect(() => {
        if (init) {
            setRange(init)
        }
    }, [])


    /** обработчик устанавливает дату начала диапазона и смещает дату конца диапазона */
    function handleDateChange(date: Date, type: 'start' | 'end') {
        if (range) {
            if (type === 'start') {
                date.setHours(0, 0, 0, 0)
                const state = {...range, start: date}
                setRange(state)
                onChange && onChange({start: date})
            } else if (type === 'end') {
                date.setHours(23, 59, 59, 999)
                const state = {...range, end: date}
                setRange(state)
                onChange && onChange({end: date})
            }
        }
    }



    return (
        <div className='flex-stretch gap-0.25'>
            <DateInput
                placeholder={'Начало'}
                value={range?.start}
                onChange={date => handleDateChange(date, "start")}
            />
            <DateInput
                placeholder={'Завершение'}
                value={range?.end}
                min={range?.start}
                onChange={date => handleDateChange(date, "end")}
            />
        </div>
    )
}