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
 * @property {({id:string}) => unknown} initUser
 * @property {(userData: UserType) => unknown} login
 * @property {() => unknown} logout
 */


import React, {createContext, useCallback, useEffect, useState} from "react";
import defaultHandleError from "../utils/error-handlers/defaultHandleError";
import constants, {THEME, USER_AUTH} from "../static/constants";
import storeDB from "../db/storeDB/storeDB";

/**@type {UserContextType}*/
const defaultUserContext = {
    user: null,
    userLoc: null,
    loading: true,
    initUser: () => {},
    login: () => {},
    logout: () => {},
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

    // const setUser = useCallback(/**@param{UserType | null} newUser*/(newUser) => {
    //     if (newUser) {
    //         localStorage.setItem(USER_AUTH, JSON.stringify(newUser))
    //         setState({...state, user: newUser})
    //     } else {
    //         localStorage.setItem(USER_AUTH, JSON.stringify(null))
    //         setState({...state, user: null})
    //
    //     }
    // }, [])

    /**@param {UserType} userData*/
    function login(userData){
        if(userData) {
            localStorage.setItem(USER_AUTH, JSON.stringify(userData))
            storeDB.editElement(constants.store.USERS, userData)
            setState(prev => ({...prev, user: userData, loading: false}))
        }
    }

    function logout(){
        if (state.user){
            const user = state.user
            localStorage.setItem(USER_AUTH, JSON.stringify(null))
            storeDB.removeElement(constants.store.USERS, user.id)
            setState(prev => ({...prev, user: null, loading: false}))
        }
    }

    useEffect(() => {
        if (process.env.NODE_ENV === 'production'){
            try {
                const user = localStorage.getItem(USER_AUTH)
                if (user) {
                    storeDB.getOne(constants.store.USERS, user.id)
                        .then(_user => {
                            if (_user) login(_user)
                        })
                }

            } catch (err) {
            }
        }

        setState({
            ...state,
            initUser,
            login,
            logout
        })
    }, [])


    state.login = login
    state.logout = logout
    state.initUser = initUser

    return (
        <UserContext.Provider value={state}>
            {children}
        </UserContext.Provider>
    )


}
