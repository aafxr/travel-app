import React from 'react'

import {useExpensesGroupPlan} from "../../../../contexts/ExpensesContexts/useExpensesGroupPlan";
import ExpensesFilterVariant from "../../components/ExpensesFilterVariant";
import AddButton from "../../../../components/ui/AddButtom/AddButton";
import Container from "../../../../components/Container/Container";
import {useTravel, useUser} from "../../../../contexts/AppContextProvider";

import '../../css/Expenses.css'


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
    const group = useExpensesGroupPlan(user.getSetting('expensesFilter'))

    console.log(group)

    return (
        <>
            <Container className='pt-20 content column gap-1'>
                <AddButton to={`/travel/${travel.id}/expenses/plan/add/`}>Запланировать расходы</AddButton>

            </Container>
            {
                travel.members_count > 1 && (
                    <ExpensesFilterVariant
                        className='footer'
                        value={user.getSetting("expensesFilter")}
                        onChange={console.log}
                    />
                )
            }

        </>
    )
}
