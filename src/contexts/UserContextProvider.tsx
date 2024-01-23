/**
 * Handler , который вызывается telegram auth widget  для дальнейшей обработки данных пользователя
 * @name TelegramAuthHandler
 * @function TelegramAuthHandler
 * @param {UserTelegramAuthPayloadType} user полученные данные пользователя из telegram
 * @category Utils
 */

import React, {createContext, useCallback, useEffect, useState} from "react";
import defaultHandleError from "../utils/error-handlers/defaultHandleError";
import {USER_AUTH} from "../static/constants";
import {CoordinatesType} from "../types/CoordinatesType";
import {UserType} from "../types/UserType";
import {DB} from "../db/DB";
import {WithId} from "../types/WithId";
import {StoreName} from "../types/StoreName";
import {User} from "../classes/StoreEntities";

type UserContextType = {
    user: User | null
    userLoc: CoordinatesType | null
    loading: boolean
    initUser: ({id}: {id: string}) => unknown
    login: (userData: UserType) => unknown
    logout: () => unknown
}




const defaultUserContext: UserContextType = {
    user: null,
    userLoc: null,
    loading: true,
    initUser: () => {},
    login: () => {},
    logout: () => {},
}


export const UserContext = createContext<UserContextType>(defaultUserContext)


export default function UserContextProvider({children}: React.PropsWithChildren) {
    const [state, setState] = useState(defaultUserContext)
    const [unsubscribe, setUnsubscribe] = useState<{unsub: null | Function}>({unsub: null})

    const subscribeOnUserChanges = (user: User) => {
        if(!user) return null
        if(unsubscribe.unsub) unsubscribe.unsub()
        return user.subscribe('update', function(this:User, user:User) {

            DB.update(this,this, undefined, defaultHandleError)
            localStorage.setItem(USER_AUTH, JSON.stringify(this.dto()))
            setState({...state, user: this})
        }.bind(user))
    }

    const initUser = async (userData: WithId) => {
        try {
            if (!userData) {
                setState({...state, loading: false, user: null})
                return
            }
            setState({...state, loading: true})
            const id = userData.id
            DB.getOne<User>(StoreName.USERS, id, (user) => {
                if (user) {
                    let newUser = new User(user)
                    const userLoc = null// await userLocation().catch(defaultHandleError)
                    setUnsubscribe({unsub : subscribeOnUserChanges(newUser)})
                    setState({...state, user: newUser, userLoc, loading: false})
                } else {
                    let newUser = new User(userData)
                    DB.add(newUser, newUser)
                    setUnsubscribe({unsub : subscribeOnUserChanges(newUser)})
                    setState({...state, user: newUser, userLoc: null, loading: false})
                }
            },defaultHandleError)

        } catch (err) {
            defaultHandleError(err as Error)
            setState({...state, user: null, userLoc: null, loading: false})
        }
    }

    function login(userData: UserType){
        if(userData) {
            const user = new User(userData)
            localStorage.setItem(USER_AUTH, JSON.stringify(user))
            setUnsubscribe({unsub : subscribeOnUserChanges(user)})
            setState(prev => ({...prev, user: user, loading: false}))
        }
    }

    function logout(){
        if (state.user){
            if(unsubscribe.unsub) unsubscribe.unsub()
            localStorage.setItem(USER_AUTH, JSON.stringify(null))
            setState(prev => ({...prev, user: null, loading: false}))
        }
    }

    useEffect(() => {
        if (process.env.NODE_ENV === 'production'){
            try {
                const user_auth = localStorage.getItem(USER_AUTH)
                if (user_auth) {
                    const _user = JSON.parse(user_auth)
                    const user = new User(_user)
                    DB.getOne<User>(StoreName.USERS, user.id, (user)=> {
                        if(user) login(user)
                    }, defaultHandleError)
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
