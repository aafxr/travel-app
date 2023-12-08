/**
 * @typedef  {'dark-theme' | 'light-theme'} DefaultThemeType
 */
/**
 * @typedef  ThemeContextType
 * @property {UserType | null} user
 * @property {CoordinatesType} userLoc
 * @property {boolean} loading
 * @property {(user: UserType) => unknown } setUser
 * @property {(newState: UserContextType) => unknown } setUserContext
 * @property {({id:string}) => unknown} initUser
 */






export default function ThemeContextProvider({children}){

}