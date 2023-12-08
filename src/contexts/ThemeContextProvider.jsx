/**
 * @typedef  {'dark-theme' | 'light-theme' | 'default'} DefaultThemeType
 */

/**
 * @typedef  ThemeContextType
 * @property {DefaultThemeType} theme
 * @property {(newTheme: DefaultThemeType) => unknown} setTheme
 */

import {createContext, useCallback, useEffect, useState} from "react";
import defaultThemeClass from "../utils/defaultThemeClass";
import {THEME} from "../static/constants";

/**@type{ThemeContextType} */
const defaultThemeContext = {
    theme: defaultThemeClass(),
    setTheme: () => {
    }
}

/**
 * @type {React.Context<ThemeContextType>}
 */
export const ThemeContext = createContext(defaultThemeContext)


export default function ThemeContextProvider({children}) {
    const [state, setState] = useState(defaultThemeContext)

    const setTheme = useCallback(/**@param{DefaultThemeType} newTheme*/(newTheme) => {
        const themeName = newTheme === 'default' ? defaultThemeClass() : newTheme
        localStorage.setItem(THEME, newTheme.toString())

        document.body.classList.remove('dark-theme')
        document.body.classList.remove('light-theme')
        document.body.classList.add(themeName)

        setState({
            ...state,
            theme: themeName
        })
    }, [])

    useEffect(() => {
        setState({...state, setTheme})
    }, [])


    return (
        <ThemeContext.Provider value={state}>
            {children}
        </ThemeContext.Provider>
    )
}