import React, {createContext, useEffect, useState} from 'react'
import {Outlet} from "react-router-dom";

import ExpensesActionController from "../controllers/ExpensesActionController";
import {LocalDB} from "../../../db";
import schema from "../db/schema";

export const ExpensesContext = createContext(null)

export default function ExpensesContextProvider({ user_id }) {
    const [dbReady, setDbReady] = useState(false)
    const [controller, setController] = useState(null)

    useEffect(() => {
        new LocalDB(
            schema,
            {
                onReady: (db) => {
                    console.log(db)
                    setDbReady(true)
                    setController(new ExpensesActionController(db, user_id, '123'))
                },
                onError: console.error
            })
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