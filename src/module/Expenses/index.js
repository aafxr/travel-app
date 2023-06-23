import React, {useEffect, useState} from 'react'
import {Database} from "../../db";
import schema from './db/schema'

export default function Expanses({
                                     userId,
                                     primaryEntityType,
                                     primaryEntityId
                                 }) {
    const [db, setDb] = useState()


    useEffect(() => {
        const db = new Database(schema, {onReady: setDb, onError: console.error})
    }, [])

    const addHandler = function () {
        db.addElement('section', {id: 1, title: 'Отель', hidden: false, color: 'green'})
            .then(console.log)
            .catch(console.error)
    }
    const updateHandler = function () {
        db.editElement('section', {id: 1, title: 'Отель', hidden: false, color: 'red'})
            .then(console.log)
            .catch(console.error)
    }
    const removeHandler = function () {
        db.removeElement('section', 1)
            .catch(console.error)
            .then(console.log)
    }
    const getHandler = function () {
        db.getElement('section', 1)
            .then(console.log)
            .catch(console.error)
    }
    const wrangHandler = function () {
        db.getElement('setion', 1)
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
        <button onClick={addHandler} disabled={!db}>add element</button>
        <button onClick={updateHandler} disabled={!db}>update element</button>
        <button onClick={removeHandler} disabled={!db}>remove element</button>
        <button onClick={getHandler} disabled={!db}>get element</button>
        <button onClick={wrangHandler} disabled={!db}>wrang section</button>

    </div>
}