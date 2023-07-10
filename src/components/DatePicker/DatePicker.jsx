import React, {useState} from 'react'

import {ru} from 'date-fns/locale';
import {DayPicker} from 'react-day-picker';

import 'react-day-picker/dist/style.css';
import './DatePicker.css'


function DatePicker({multy, onSelect}, ref) {
    const [range, setRange] = useState(undefined);

    function selectHandler(data) {
        setRange(data)
        onSelect && onSelect(data)
        console.log(data)

    }

    function deleteHandler() {
        setRange(undefined)
    }

    function todayHandler() {
        const now = Date.now()
        const fromMidnight = now % (1000 * 60 * 60 * 24)
        const date = new Date(now - fromMidnight)
        if (multy) {
            setRange({
                from: date,
                to: date
            })
        } else {
            setRange(date)
        }
    }

    return (
        <div ref={ref} className='date-picker'>
            <div className='column gap-0.5'>
                <DayPicker
                    mode={multy ? "range" : "single"}
                    locale={ru}
                    selected={range}
                    onSelect={selectHandler}
                    showOutsideDays
                    ISOWeek
                />
                <div className='date-picker-footer flex-between'>
                    <div onClick={deleteHandler}>
                        Удалить
                    </div>
                    <div onClick={todayHandler}>
                        Сегодня
                    </div>
                </div>
            </div>
        </div>
    )
}

export default React.forwardRef(DatePicker)
