import React, {useEffect} from 'react'

import {useExpensesGroupActual} from "../../../../contexts/ExpensesContexts/useExpensesGroupActual";
import ExpensesFilterVariant from "../../components/ExpensesFilterVariant";
import {useTravel, useUser} from "../../../../contexts/AppContextProvider";
import AddButton from "../../../../components/ui/AddButtom/AddButton";
import Container from "../../../../components/Container/Container";

import '../../css/Expenses.css'


/** страница отображает текущие расходы с лимитами пользователя (если указаны) */
export default function ExpensesComponent() {
    const user = useUser()!
    const travel = useTravel()!
    const group = useExpensesGroupActual(user.getSetting('expensesFilter'))


    useEffect(() => {
        for (const g  of group.entries())
            console.log(g[0], g[1])
    }, [group])



    return (
        <>
            <Container className='pt-20 content column gap-1'>
                <AddButton to={`/travel/${travel.id}/expenses/add/`}>Записать расходы</AddButton>

            </Container>
            {
                travel.members_count > 1 && (
                    <ExpensesFilterVariant
                        className='footer'
                        value={user.getSetting('expensesFilter')}
                        onChange={console.log}
                    />
                )
            }
        </>
    )
}


// {
//     sectionComponentData.length > 0
//         ? sectionComponentData.map(sk => (
//             <Section
//                 key={sk}
//                 {...sk}
//                 user_id={user.id}
//                 line
//             />
//         ))
//         : <div>{noDataMessage}</div>
// }
