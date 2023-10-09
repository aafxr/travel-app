/**
 *
 * @returns {string}
 * @function
 * @name defaultThemeClass
 * @category Utils
 */
export default function defaultThemeClass(){
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark-theme'
    } else {
        return 'light-theme'
    }
}