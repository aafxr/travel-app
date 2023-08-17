import React, {useContext, useEffect} from 'react'
import {useDispatch, useSelector} from "react-redux";
import {Outlet, useParams} from "react-router-dom";

import {WorkerContext} from "../../../contexts/WorkerContextProvider";

import useDefaultSection from "../hooks/useDefaultSections";

import constants from "../../../static/constants";

import usePostMessage from "../hooks/usePostMessage";

import {initExpensesThunk} from "../../../redux/expensesStore/initExpensesThunk";
import {actions} from "../../../redux/store";
import '../css/Expenses.css'
import updateCurrency from "../helpers/updateCurrency";

/**
 * @typedef {Object} DispatchType
 * @property {DispatchFunction} dispatch
 */


/**
 * обертка для молуля Expenses
 *
 * оборачивает в ExpensesContext
 * @returns {JSX.Element}
 * @constructor
 */
export default function ExpensesWrapper() {
    const {sections} = useSelector(state => state[constants.redux.EXPENSES])
    const dispatch = useDispatch()
    const {travelCode: primary_entity_id} = useParams()
    const {worker} = useContext(WorkerContext)
    const {user} = useSelector(state => state[constants.redux.USER])
    const user_id = user.id

    useDefaultSection(primary_entity_id, user_id)

    usePostMessage(worker, primary_entity_id)

    // console.log(state)
    useEffect(() => {
        updateCurrency(dispatch)
    }, [])

    useEffect(() => {
        dispatch(initExpensesThunk(primary_entity_id))
    }, [dispatch])

    useEffect(() => {
        if (sections && sections.length) {
            const section = sections.find(s => s.title === 'Прочие расходы')
            const defaultSection = section ? section : null
            dispatch(actions.expensesActions.setDefaultSection(defaultSection))
        }
    }, [sections])


    return <Outlet/>
}
