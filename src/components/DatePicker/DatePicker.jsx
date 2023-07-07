import React, {useEffect, useState} from "react";

import './DatePicker.css'
import daysRange from "./daysRange";
import clsx from "clsx";

const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
const monthName = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь']

export default function DatePicker() {
    const [date, setDate] = useState(new Date())
    const month = date.getUTCMonth()
    const {daysArray, start, end, current} = daysRange(new Date())

    const [selectedDay, setSelectedDay] = useState(current)

    useEffect(() => {
        if (current){
            setSelectedDay(current)
        }
    }, [date, current])

    return (
        <div className='date-picker-container column gap-0.5'>
            <div className='date-picker-header'>
                <div className='date-picker-month'>{monthName[month]}</div>
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
                                onClick={() => setSelectedDay(i)}
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