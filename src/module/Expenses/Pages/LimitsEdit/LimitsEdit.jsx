import React, {useContext, useEffect, useState} from 'react'
import {useParams} from "react-router-dom";
import {Input, PageHeader} from "../../../../components/ui";
import {ExpensesContext} from "../../components/ExpensesContextProvider";

export default function Limits({
                                         user_id,
                                         primaryEntityType
                                     }) {
    const {travelCode: primary_entity_id} = useParams()
    const {controller} = useContext(ExpensesContext)


    return (
        <>
            <PageHeader arrowBack title={'Редактировать лимит'}/>
            <div style={{padding: '0 20px'}}>

            </div>
        </>
    )
}