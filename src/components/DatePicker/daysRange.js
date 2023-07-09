import daysInMonth from "./daysInMonth";
import isString from "../../utils/validation/isString";

export default function daysRange(year, month, day, weekDay){
    let m = month
    let d = day
    let y = year
    let wd = weekDay

    if (isString(year) || year instanceof Date){
        const date = year instanceof Date ? year: Date.parse(year)
        m = date.getUTCMonth()
        d = date.getUTCDate();
        y = date.getUTCFullYear();
        wd = date.getDay()
    }

    const daysInPrevMonth = daysInMonth(
        m === 0 ?  y - 1: y,
        m === 0 ? 11 : m - 1)

    const daysInThisMonth = daysInMonth(y, m, d)


    const delta = Math.abs(d - wd) % 7
    const daysFromPrevMonth = delta === 0 ? 0 : 6 - delta
    const startDay = daysInPrevMonth - daysFromPrevMonth

    const arr = new Array(42)

    let current
    for (let i = 0; i < arr.length; i++){
        if (startDay + i <= daysInPrevMonth){
            arr[i] = startDay + i
        } else if (i - daysFromPrevMonth <= daysInThisMonth) {
            arr[i] = i - daysFromPrevMonth
            i - daysFromPrevMonth === d && (current = i)
        } else{
            arr[i] = i - daysInThisMonth - daysFromPrevMonth
        }
    }
    let start
    let end
    for (let i = 1; i < arr.length; i++){
        if(arr[i-1] > arr[i]){
            if(!start){
                (start = i)
            }
            else if (start && !end){
                end = i - 1
            }
        }
    }

    !end && (end = 42)

    return {daysArray: arr, start, end, current}
}