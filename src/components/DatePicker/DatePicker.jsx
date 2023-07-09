import React, {useEffect, useState} from "react";

import './DatePicker.css'
import daysRange from "./daysRange";
import clsx from "clsx";
import dayMonthYear from "./dayMonthYear";

const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
const monthName = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь']

export default function DatePicker() {
    const [date, setDate] = useState(new Date())

    const {daysArray, start, end, current} = daysRange(date)
    const {d, m, y, wd} = dayMonthYear(date)
    console.log(daysArray)

    const [selectedDay, setSelectedDay] = useState(current)


    useEffect(() => {
        if (current) {
            setSelectedDay(current)
        }
    }, [date, current])


    function onDaySelect(day) {
        console.log(daysArray[current], daysArray[day], current - day)
        if (day < start || day > end) {
            const newDate = new Date(date.setDate(date.getDate() - (current - day)))
            console.log(newDate.toLocaleDateString())
            setDate(newDate)
        }
        // setSelectedDay(day)
    }

    return (
        <div className='date-picker-container column gap-0.5'>
            <div className='date-picker-header'>
                <div className='date-picker-month'>{monthName[m]}</div>
            </div>
            <div className='page-header-content column'>
                <div className='flex-between'>
                    {
                        weekDays.map(w => (
                            <div key={w} className='date-picker-day center'>{w}</div>
                        ))
                    }
                </div>
                <div className='flex-wrap'>
                    {
                        daysArray.map((d, i) => (
                            <div
                                key={i}
                                className={clsx(
                                    'date-picker-item flex-wrap center',
                                    {
                                        'inactive': i < start || i > end,
                                        'selected': i === selectedDay && i >= start && i <= end
                                    }
                                )}
                                onClick={() => onDaySelect(i)}
                            >
                                {d}
                            </div>
                        ))
                    }
                </div>

            </div>
            <div className='date-picker-footer flex-between'>
                <div
                    onClick={() => setSelectedDay(null)}
                >
                    Удалить
                </div>
                <div
                    onClick={() => {
                        setDate(new Date())
                    }}
                >
                    Сегодня
                </div>
            </div>
        </div>
    )
}