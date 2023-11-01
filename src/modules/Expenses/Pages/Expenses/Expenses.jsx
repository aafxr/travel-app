import { useParams} from "react-router-dom";
import React, {useEffect, useMemo, useState} from 'react'
import {useDispatch, useSelector} from "react-redux";

import ExpensesFilterVariant from "../../components/ExpensesFilterVariant";
import AddButton from "../../../../components/ui/AddButtom/AddButton";
import Container from "../../../../components/Container/Container";
import useFilteredExpenses from "../../hooks/useFilteredExpenses";
import useUserSelector from "../../../../hooks/useUserSelector";
import updateExpenses from "../../helpers/updateExpenses";
import Section from "../../components/Section/Section";
import {defaultFilterValue} from "../../static/vars";
import constants from "../../../../static/constants";
import {actions} from "../../../../redux/store";

import '../../css/Expenses.css'
import useTravelContext from "../../../../hooks/useTravelContext";
import storeDB from "../../../../db/storeDB/storeDB";
import {ca} from "date-fns/locale";
import useSectionsList from "./useSectionsList";


/**
 * страница отображает текущие расходы с лимитами пользователя (если указаны)
 * @function
 * @name Expenses
 * @param {string} primary_entity_type
 * @returns {JSX.Element}
 * @category Pages
 */
export default function Expenses({primary_entity_type}) {
    // const dispatch = useDispatch()
    const {user} = useUserSelector()
    const {travel, update} = useTravelContext()
    const [updateTravelInfo, setUpdateTravelInfo] = useState(/**@type{UpdateTravelInfoType}*/null)
    const [expenses, setExpenses] = useState(/**@type{ExpenseType[]}*/[])
    // const {sections, limits, expensesActual} = useSelector(state => state[constants.redux.EXPENSES])
    const [noDataMessage, setNoDataMessage] = useState('')
    const [filter, setFilter] = useState(/**@type{ExpenseFilterType} */defaultFilterValue)

    const user_id = user.id

    /** загрузка расходов из бд */
    useEffect(() => {
        setTimeout(() => setNoDataMessage('Нет расходов'), 2000)

        storeDB.getOne(constants.store.UPDATED_TRAVEL_INFO, travel.id)
            .then(setUpdateTravelInfo)

        storeDB.getAllFromIndex(constants.store.EXPENSES_ACTUAL, constants.indexes.PRIMARY_ENTITY_ID, travel.id)
            .then(setExpenses)
    }, [travel])

    const sections = useSectionsList(expenses, updateTravelInfo, filter)


    const {filteredExpenses, limitsList, sectionList} = useFilteredExpenses(expensesActual, limits, filter, user_id)

    /**
     *
     * @param section
     * @returns {T|null|{id: number, value: *}}
     */
    const sectionLimit = function (section) {
        if (filter !== 'all') {
            return limitsList.find(l => l.section_id === section.id) || null
        } else {
            const value = limitsList
                .filter(l => (
                    l.section_id === section.id
                    && (l.personal === 0 || l.user_id === user_id)
                ))
                .map(l => l.value)
                .reduce((acc, l) => acc + l, 0)

            return {
                id: Date.now(),
                value
            }
        }
    }

    return (
        <>
            <Container className='pt-20 content column gap-1'>
                <AddButton to={`/travel/${travel.id}/expenses/add/`}>Записать расходы</AddButton>
                {
                    sectionList && !!sectionList.length
                        ? sections
                            .filter(s => sectionList.includes(s.id))
                            .map(section => (
                                <Section
                                    key={section.id}
                                    section={section}
                                    expenses={filteredExpenses.filter(e => e.section_id === section.id)}
                                    sectionLimit={sectionLimit}
                                    user_id={user_id}
                                    line
                                />
                            ))
                        : <div>{noDataMessage}</div>
                }
            </Container>
            <ExpensesFilterVariant className='footer' value={filter} onChange={setFilter}/>
        </>
    )
}
