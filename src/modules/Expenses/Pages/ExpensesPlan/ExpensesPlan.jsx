import React, {useContext, useEffect, useState} from 'react'
import {useNavigate, useParams} from "react-router-dom";

import AddButton from "../../../../components/ui/AddButtom/AddButton";

import Container from "../../../../components/Container/Container";
import Section from "../../components/Section/Section";

import '../../css/Expenses.css'
import constants, {reducerConstants} from "../../../../static/constants";
import useFilteredExpenses from "../../hooks/useFilteredExpenses";
import ExpensesFilterVariant from "../../components/ExpensesFilterVariant";
import {defaultFilterValue} from "../../static/vars";
import updateExpenses from "../../helpers/updateExpenses";
import {UserContext} from "../../../../contexts/UserContextProvider.jsx";
import {useDispatch, useSelector} from "react-redux";
import {actions} from "../../../../redux/store";


/**
 * страница отображает плановые расходы  пользователя
 * @returns {JSX.Element}
 * @constructor
 */
export default function ExpensesPlan() {
    const {travelCode: primary_entity_id} = useParams()
    const {sections, limits, expensesPlan} = useSelector(state => state[constants.redux.EXPENSES])
    const {user} = useSelector(state => state[constants.redux.USER])
    const dispatch = useDispatch()

    const [noDataMessage, setNoDataMessage] = useState('')

    const [filter, setFilter] = useState(defaultFilterValue)

    const navigate = useNavigate()

    const user_id = user.id

    useEffect(() => {
            setTimeout(() => setNoDataMessage('Нет расходов'), 1000)
            updateExpenses( primary_entity_id, "plan")
                .then(items => dispatch(actions.expensesActions.setExpensesPlan(items)))
    }, [dispatch, primary_entity_id])

    const {filteredExpenses, limitsList, sectionList} = useFilteredExpenses(expensesPlan, limits, filter, user_id)

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
                <AddButton to={`/travel/${primary_entity_id}/expenses/plan/add/`}>Запланировать расходы</AddButton>
                {
                    sections && !!sections.length
                        ? sections
                            .filter(s => sectionList.includes(s.id))
                            .map(section => (
                                <Section
                                    key={section.id}
                                    section={section}
                                    expenses={filteredExpenses.filter(e => e.section_id === section.id)}
                                    sectionLimit={sectionLimit}
                                    user_id={user_id}
                                />
                            ))
                        : <div>{noDataMessage}</div>
                }
            </Container>
            <ExpensesFilterVariant className='footer' value={filter} onChange={setFilter}/>

        </>
    )
}
