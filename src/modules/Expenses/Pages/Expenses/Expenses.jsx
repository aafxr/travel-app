import React, {useEffect, useState} from 'react'

import ExpensesFilterVariant from "../../components/ExpensesFilterVariant";
import AddButton from "../../../../components/ui/AddButtom/AddButton";
import Container from "../../../../components/Container/Container";
import useFilteredExpenses from "../../hooks/useFilteredExpenses";
import useTravelContext from "../../../../hooks/useTravelContext";
import useUserSelector from "../../../../hooks/useUserSelector";
import Section from "../../components/Section/Section";
import {defaultFilterValue} from "../../static/vars";
import storeDB from "../../../../db/storeDB/storeDB";
import constants from "../../../../static/constants";
import useSectionsList from "./useSectionsList";

import '../../css/Expenses.css'
import defaultUpdateTravelInfo from "../../../../utils/defaultUpdateTravelInfo";
import combineExpensesForSectionComponent from "./combineExpensesForSectionComponent";


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
    const [sectionComponentData, setSectionComponentData] = useState(/**@type{SectionComponentDataType[]} */[])


    /** загрузка расходов из бд */
    useEffect(() => {
        setTimeout(() => setNoDataMessage('Нет расходов'), 2000)

        storeDB.getOne(constants.store.UPDATED_TRAVEL_INFO, travel.id)
            .then(uti => setUpdateTravelInfo(uti ? uti : defaultUpdateTravelInfo(travel.id)))

        storeDB.getAllFromIndex(constants.store.EXPENSES_ACTUAL, constants.indexes.PRIMARY_ENTITY_ID, travel.id)
            .then(setExpenses)

        combineExpensesForSectionComponent(constants.store.EXPENSES_ACTUAL, filter, travel.id)
            .then(setSectionComponentData)

    }, [travel])


    console.log('sectionComponentData ', sectionComponentData)

    return (
        <>
            <Container className='pt-20 content column gap-1'>
                <AddButton to={`/travel/${travel.id}/expenses/add/`}>Записать расходы</AddButton>
                {
                    sectionComponentData.length > 0
                        ? sectionComponentData.map(sk => (
                            <Section
                                key={sk}
                                {...sk}
                                user_id={user.id}
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
