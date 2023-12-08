/**
 * объект которы предоставляет telegram auth widget
 * @name UserTelegramAuthPayloadType
 * @typedef {Object} UserTelegramAuthPayloadType
 * @property {number} id
 * @property {string} first_name
 * @property {string} last_name
 * @property {number} auth_date
 * @property {string} hash
 * @category Types
 */

/**
 * Тип, описывающий данные пользователя
 * @name UserType
 * @typedef {Object} UserType
 * @property {string} id id пользователя
 * @property {string} first_name имя пользователя
 * @property {string} last_name фамилия пользователя
 * @property {string} username никнейм пользователя
 * @property {string} photo url ссылка на фото пользователя
 * @property {string} token access token
 * @property {string} refresh_token refresh token
 * @category Types
 */

/**
 * Handler , который вызывается telegram auth widget  для дальнейшей обработки данных пользователя
 * @name TelegramAuthHandler
 * @function TelegramAuthHandler
 * @param {UserTelegramAuthPayloadType} user полученные данные пользователя из telegram
 * @category Utils
 */

/**
 * @typedef {Object} UserContextType
 * @property {UserType | null} user
 * @property {CoordinatesType} userLoc
 * @property {boolean} loading
 * @property {(user: UserType) => unknown } setUser
 * @property {(newState: UserContextType) => unknown } setUserContext
 * @property {({id:string}) => unknown} initUser
 */


import React, {createContext, useCallback, useEffect, useState} from "react";
import defaultHandleError from "../utils/error-handlers/defaultHandleError";
import constants, {THEME} from "../static/constants";
import userLocation from "../utils/userLocation";
import storeDB from "../db/storeDB/storeDB";

/**@type {UserContextType}*/
const defaultUserContext = {
    user: null,
    userLoc: null,
    loading: false,
    setUser: () => {
    },
    initUser: () => {
    },
    setUserContext: () => {
    }
}

/**
 * @type {React.Context<UserContextType>}
 */
export const UserContext = createContext(defaultUserContext)


export default function UserContextProvider({children}) {
    const [state, setState] = useState(defaultUserContext)

    const initUser = useCallback(/** @param {{id:string}} userData */async (userData) => {
        try {
            if (!userData) return null
            console.log('initUser')
            setState({...state, loading: true})
            const user = await storeDB.getOne(constants.store.USERS, userData.id)
            let newUserData = userData
            if (user) {
                newUserData = {...user, ...newUserData}
            }
            await storeDB.editElement(constants.store.USERS, newUserData)
            const userLoc = null// await userLocation().catch(defaultHandleError)
            setState({...state, user: newUserData, userLoc, loading: false})
        } catch (err) {
            defaultHandleError(err)
            setState({...state, user: null, userLoc: null, loading: false})
        }
    }, [])

    const setUser = useCallback(/**@param{UserType} newUser*/(newUser) => setState({...state, user: newUser}), [])

    useEffect(() => {
        setState({
            ...state,
            initUser,
            setUser,
            setUserContext: setState
        })
    }, [])


    return (
        <UserContext.Provider value={state}>
            {children}
        </UserContext.Provider>
    )


}
