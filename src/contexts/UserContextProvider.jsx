import {createContext, useContext, useEffect, useState} from "react";
import {Outlet} from "react-router-dom";

import {UNAUTHORIZED, USER_AUTH} from "../static/constants";
import {WorkerContext} from "./WorkerContextProvider";

/**
 * объект которы предоставляет telegram auth widget
 *@typedef {Object} UserAuthType
 * @property {number} id
 * @property {string} first_name
 * @property {string} last_name
 * @property {number} auth_date
 * @property {string} hash
 */

/**
 * @typedef {Object} UserAppType
 * @property {string} id
 * @property {string} first_name
 * @property {string} last_name
 * @property {string} username
 * @property {string} photo
 * @property {string} token
 * @property {string} refresh_token
 */

/**
 * @function TelegramAuthHandler
 * @param {UserAuthType} user
 */

/**
 * @typedef {Object} UserContextType
 * @property {UserAppType | null} user
 * @property {TelegramAuthHandler} setUser
 */

/**
 *
 * @type {React.Context<UserContextType>}
 */
export const UserContext = createContext({})


export default function UserContextProvider() {
    const [user, setUser] = useState(null)
    const {worker} = useContext(WorkerContext)

    /**@type {TelegramAuthHandler} */
    function handleUserAuth(user) {
        const result = user
        localStorage.setItem(USER_AUTH, JSON.stringify(result))
        setUser(result)
    }

    useEffect(()=> {
        if(worker){
            worker.addEventListener('message', msg=>{
                if(msg.type === UNAUTHORIZED){
                    localStorage.setItem(USER_AUTH, JSON.stringify(null))
                    setUser(null)
                }
            })
        }
    }, [worker])

    useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            /**@type{UserAppType} */
            const userPH = {
                id: '12',
                first_name: 'Иван',
                last_name: 'Алексеев'
            }
            setUser(userPH)
        } else {
            const us = JSON.parse(localStorage.getItem(USER_AUTH))
            setUser(us)
        }

    }, [])


    return (
        <UserContext.Provider value={{user, setUser: handleUserAuth}}>
            <Outlet/>
        </UserContext.Provider>
    )

}