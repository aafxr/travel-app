import { useParams} from "react-router-dom";
import React, { useEffect, useState} from 'react'
import {useDispatch, useSelector} from "react-redux";

import ExpensesFilterVariant from "../../components/ExpensesFilterVariant";
import AddButton from "../../../../components/ui/AddButtom/AddButton";
import Container from "../../../../components/Container/Container";
import useFilteredExpenses from "../../hooks/useFilteredExpenses";
import updateExpenses from "../../helpers/updateExpenses";
import Section from "../../components/Section/Section";
import {defaultFilterValue} from "../../static/vars";
import constants from "../../../../static/constants";
import {actions} from "../../../../redux/store";

import '../../css/Expenses.css'


/**
 * страница отображает текущие расходы с лимитами пользователя (если указаны)
 * @function
 * @name Expenses
 * @param {string} primary_entity_type
 * @returns {JSX.Element}
 * @category Pages
 */
export default function Expenses({primary_entity_type}) {
    const dispatch = useDispatch()
    const {travelCode: primary_entity_id} = useParams()
    const {user} = useSelector(state => state[constants.redux.USER])
    const {sections, limits, expensesActual} = useSelector(state => state[constants.redux.EXPENSES])
    const [noDataMessage, setNoDataMessage] = useState('')
    const [filter, setFilter] = useState(defaultFilterValue)

    const user_id = user.id

    /** загрузка расходов из бд */
    useEffect(() => {
            setTimeout(() => setNoDataMessage('Нет расходов'), 2000)
            updateExpenses( primary_entity_id, "actual")
                .then(items => dispatch(actions.expensesActions.setExpensesActual(items)))
    }, [dispatch, primary_entity_id])

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
                <AddButton to={`/travel/${primary_entity_id}/expenses/add/`}>Записать расходы</AddButton>
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
