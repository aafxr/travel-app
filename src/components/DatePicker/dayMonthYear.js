export default function dayMonthYear(date) {
    if (date instanceof Date) {
        const m = date.getUTCMonth()
        const d = date.getUTCDate();
        const y = date.getUTCFullYear();
        const wd = date.getDay()

        return {m, d, y, wd}
    }

    return {m: -1, d: -1, y: -1, wd: -1}
}