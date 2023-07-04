import React, {createContext, useEffect, useState} from 'react'
import {Outlet, useParams} from "react-router-dom";

import ActionController from "../../../controllers/ActionController";
import schema from "../db/schema";
import options, {onUpdate} from '../controllers/controllerOptions'

import '../css/Expenses.css'

export const ExpensesContext = createContext(null)

export default function ExpensesContextProvider({user_id}) {
    const {travelCode: primary_entity_id} = useParams()
    const [dbReady, setDbReady] = useState(false)
    const [controller, setController] = useState(null)

    useEffect(() => {
        const c = new ActionController(schema, {
            ...options,
            onReady: () => {
                setDbReady(true)
            },
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