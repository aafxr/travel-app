import React from 'react'

import {useExpensesGroupPlan} from "../../../../contexts/ExpensesContexts/useExpensesGroupPlan";
import ExpensesFilterVariant from "../../components/ExpensesFilterVariant";
import {useTravel, useUser} from "../../../../contexts/AppContextProvider";
import AddButton from "../../../../components/ui/AddButtom/AddButton";
import Container from "../../../../components/Container/Container";
import Section from "../../components/Section/Section";

import '../../css/Expenses.css'
import {User} from "../../../../classes/StoreEntities";


/**
 * страница отображает плановые расходы  пользователя
 * @function
 * @name ExpensesPlan
 * @returns {JSX.Element}
 * @category Pages
 */
export default function ExpensesPlan() {
    const user = useUser()!
    const travel = useTravel()!
    const groupMap = useExpensesGroupPlan(User.getSetting(user, 'expensesFilter'))

    return (
        <>
            <Container className='pt-20 content column gap-1'>
                <AddButton to={`/travel/${travel.id}/expenses/plan/add/`}>Запланировать расходы</AddButton>
                {Array.from(groupMap.entries()).map(([section_id, expensesList]) => (
                    <Section key={section_id} section_id={section_id} expenses={expensesList}/>
                ))}
            </Container>
            { travel.members_count > 1 && ( <ExpensesFilterVariant className='footer' /> ) }

        </>
    )
}
