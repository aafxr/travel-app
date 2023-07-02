import React, {createContext, useEffect, useState} from 'react'
import {Outlet, useParams} from "react-router-dom";

import ActionController from "../../../actionController/ActionController";
import schema from "../db/schema";
import options, {onUpdate} from '../controllers/controllerOptions'

export const ExpensesContext = createContext(null)

export default function ExpensesContextProvider({user_id}) {
    const {travelCode: primary_entity_id} = useParams()
    const [dbReady, setDbReady] = useState(false)
    const [controller, setController] = useState(null)

    // useEffect(() => {
    //     new LocalDB(
    //         schema,
    //         {
    //             onReady: (db) => {
    //                 console.log(db)
    //                 setDbReady(true)
    //                 setController(new ExpensesActionController(db, user_id, '123'))
    //             },
    //             onError: console.error
    //         })
    // }, [])

    useEffect(() => {
        const c = new ActionController(schema, {
            ...options,
            onReady: () => setDbReady(true),
            onError: console.error
        })

        c.onUpdate = onUpdate(primary_entity_id)

        setController(c)
    }, [])

    if (!dbReady) {
        return <div>Loading...</div>
    }

    return (
        <ExpensesContext.Provider value={{controller}}>
            <Outlet/>
        </ExpensesContext.Provider>
    )
}