import React, {useEffect, useState} from 'react'
import {Database} from "../../db";
import schema from './db/schema'

export default function Expanses({
                                     userId,
                                     primaryEntityType,
                                     primaryEntityId
                                 }) {
    const [db, setDb] = useState(null)
    const [dbReady, setDbReady] = useState(false)
    const [idCounter, setIdCounter] = useState(0)

    useEffect(() => {
        setDb(new Database(schema, {onReady: () => setDbReady(true), onError: console.error}))
    }, [])

    const addHandler = function () {
        db.addElement('section', {
            id: idCounter,
            hidden: 1,
            title: 'title',
            color: 'green',
        })
            .then(res => console.log(res))
            .catch(console.error)

        setIdCounter(prev => prev + 1)
    }


    const getHandler = function () {
        db.getFromIndex('section_limit', 'section_id', IDBKeyRange.bound(100, 180))
            .then(console.log)
            .catch(console.error)
    }

    return <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        alignItems: 'center'
    }}>
        <h2>Expanses</h2>
        {idCounter}
        <button onClick={addHandler} disabled={!dbReady}>add element</button>
        <button onClick={getHandler} disabled={!dbReady}>get element</button>

    </div>
}