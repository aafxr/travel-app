/**
 *
 * @type {Intl.NumberFormat}
 */
export const formatter = new Intl.NumberFormat(
    navigator.language,
    {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2
    }
)