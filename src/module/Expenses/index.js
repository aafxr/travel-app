import React, {useEffect, useState} from 'react'
import {LocalDB} from "../../db";
import schema from './db/schema'
import ExpensesActionController from '../Expenses/controllers/ExpensesActionController'
import ExpenseComp from "./components/ExpenseComp";
import LimitComp from "./components/LimitComp";

export default function Expanses({
                                     user_id,
                                     primaryEntityType,
                                     primary_entity_id
                                 }) {
    const [db, setDb] = useState(null)
    const [dbReady, setDbReady] = useState(false)
    const [idCounter, setIdCounter] = useState(0)
    const [controller, setController] = useState(null)

    const [inpval, setInpval] = useState('')
    const [inpval2, setInpval2] = useState('')


    useEffect(() => {
        setDb(new LocalDB(
            schema,
            {
                onReady: (db) => {
                    console.log(db)
                    setDbReady(true)
                    setController(new ExpensesActionController(db, user_id, '123'))
                },
                onError: console.error
            }))
    }, [])


    const addHandler = function () {
        const action = controller.createAction({
                action: "add",
                uid: user_id,
                datetime: new Date().toISOString(),
                entity: "expenses_plan",
                synced: 1,
                data: ''
            },
            {
                id: idCounter,
                user_id: user_id.toString(),
                primary_entity_type: 'travel',
                primary_entity_id: primary_entity_id.toString(),
                entity_type: 'excursion',
                entity_id: Date.now().toString(),
                title: 'Колывань историческая',
                value: 12000,
                personal: 1,
                section_id: Math.floor(1 + Math.random() * 5).toString(),
                datetime: new Date().toISOString(),
                created_at: new Date().toISOString()
            }
        )

        setIdCounter(prev => prev + 1)
        controller.handleAction(action)
    }


    function addExpense(data, type) {
        const action = controller.createAction({
                action: "add",
                uid: user_id,
                datetime: new Date().toISOString(),
                entity: type,
                synced: 1,
                data: ''
            },
            data
        )

        setIdCounter(prev => prev + 1)
        controller.handleAction(action)
    }

    function limitHandler(data, type){
        const action = controller.createAction({
                action: "add",
                uid: user_id,
                datetime: new Date().toISOString(),
                entity: type,
                synced: 1,
                data: ''
            },
            data
        )

        setIdCounter(prev => prev + 1)
        controller.handleAction(action)
    }


    const getHandler = function () {
        controller.expensesPlanedModel.getFromIndex(inpval || 'section_id', IDBKeyRange.only(inpval2 || '5'))
            .then(console.log)
    }

    return (
        <>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                alignItems: 'center',
                marginBottom: '1rem'
            }}>
                <h2>Expanses</h2>
                {idCounter}
                <button onClick={addHandler} disabled={!dbReady}>add element</button>
                <input type="text" onChange={e=> setInpval(e.target.value)} value={inpval} placeholder={'indexName'} />
                <input type="text" onChange={e=> setInpval2(e.target.value)} value={inpval2} placeholder={'search value'} />
                <button onClick={getHandler} disabled={!dbReady}>get element</button>
            </div>
            <div>
                <ExpenseComp
                    user_id={user_id}
                    primary_entity_id={primary_entity_id}
                    id={idCounter}
                    onClick={addExpense}
                    type={'expenses_actual'}
                    btnName={'Новый актуальный расход'}
                />
                <ExpenseComp
                    user_id={user_id}
                    primary_entity_id={primary_entity_id}
                    id={idCounter}
                    onClick={addExpense}
                    type={'expenses_plan'}
                    btnName={'Новый плановый расход'}
                />
                <LimitComp
                    user_id={user_id}
                    primary_entity_id={primary_entity_id}
                    id={idCounter}
                    onClick={limitHandler}
                    type={'limit'}
                    btnName={'Новый лимит'}
                />

            </div>
        </>
    )
}