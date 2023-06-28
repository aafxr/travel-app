import React, {useEffect, useState} from 'react'
import {useParams} from "react-router-dom";
import {Input, PageHeader} from "../../../../components/ui";

export default function Limits({
                                         user_id,
                                         primaryEntityType,
                                         primary_entity_id
                                     }) {
    const params = useParams()
    console.log(params)
    const [db, setDb] = useState(null)
    const [dbReady, setDbReady] = useState(false)
    const [idCounter, setIdCounter] = useState(0)
    const [controller, setController] = useState(null)


    return (
        <>
            <PageHeader arrowBack title={'Список лимитов'}/>
            <div style={{padding: '0 20px'}}>

            </div>
        </>
    )
}