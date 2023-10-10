import React, {useState} from 'react'

import {ru} from 'date-fns/locale';
import {DayPicker} from 'react-day-picker';

import 'react-day-picker/dist/style.css';
import './DatePicker.css'

/**
 *
 * @param multy
 * @param onSelect
 * @param date
 * @param from
 * @param to
 * @param ref
 * @returns {JSX.Element}
 * @category Components
 */
function DatePicker({multy, onSelect,date, from, to}, ref) {
    const [range, setRange] = useState(multy? {from, to} : date);

    function selectHandler(data) {
        setRange(data)
        onSelect && onSelect(data)
    }

    function deleteHandler() {
        setRange(undefined)
    }

    function todayHandler() {
        const now = Date.now()
        const fromMidnight = now % (1000 * 60 * 60 * 24)
        const date = new Date(now - fromMidnight)
        if (multy) {
            const days ={
                from: date,
                to: date
            }

            setRange(days)
            onSelect && onSelect(days)
        } else {
            setRange(date)
            onSelect && onSelect(date)
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
