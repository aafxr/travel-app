import clsx from "clsx";
import React from "react";
import {useDispatch} from "react-redux";
import {Link, useNavigate} from "react-router-dom";

import dateToStringFormat from "../../../../utils/dateToStringFormat";
import {pushAlertMessage} from "../../../../components/Alerts/Alerts";
import {formatter} from "../../../../utils/currencyFormat";
import Swipe from "../../../../components/ui/Swipe/Swipe";
import createAction from "../../../../utils/createAction";
import storeDB from "../../../../db/storeDB/storeDB";
import constants from "../../../../static/constants";
import {actions} from "../../../../redux/store";
import Line from "../Line/Line";

import './Section.css'
import useTravelContext from "../../../../hooks/useTravelContext";

/**
 * @function
 * @name Section
 * @param {string} title - имя секции расходов
 * @param {ExpenseType[]} expenses
 * @param {number} limit
 * @param {number} total
 * @param {string} section_id
 * @param {string} user_id
 * @param {boolean} line default = false
 * @param {{common: TotalBySectionType, personal: TotalBySectionType}} totalBySection
 * @param {boolean} planed флаг указывает, что секция относится к планам расходов
 * @return {JSX.Element}
 * @category Expenses-Component
 */
function Section({
                     title,
                     limit,
                     total,
                     section_id,
                     expenses = [],
                     user_id,
                     line = false,
                     planed
                 }) {
    const {travel} = useTravelContext()

    const percent = (total / limit) || 0
    const color = percent < 0.45 ? 'var(--color-success)' : percent > 0.82 ? 'var(--color-danger)' : 'var(--color-warning)'

    let balance = limit - total


    return (
        <div className='expenses-list'>
            <div>
                <Link to={`/travel/${travel.id}/expenses/limit/${section_id}/`}>
                    <div className='flex-between'>
                        <div className='section-title'>{title}</div>
                        <div className='section-title'>{formatter.format(total)} ₽</div>
                    </div>
                </Link>
                {
                    !!line && (
                        <>
                            <Line value={limit ? percent : 0} color={color}/>
                            {
                                !!limit && limit > 0 && (
                                    <div className={'flex-between'}>
                                        <div className='section-subtitle'>Лимит {formatter.format(limit)} ₽</div>
                                        {
                                            balance >= 0
                                                ?
                                                <div className='section-subtitle'>Осталось: {formatter.format(balance)} ₽</div>
                                                : <div
                                                    className='section-subtitle red'>Перерасход: {formatter.format(Math.abs(balance))} ₽</div>
                                        }

                                    </div>
                                )
                            }
                        </>
                    )
                }
                {
                    !!expenses.length && (
                        <div className='section-items column gap-0.5'>
                            {
                                expenses
                                    .map(
                                        item => (
                                            <SectionItem
                                                key={item.id}
                                                expense={item}
                                                isPlan={planed}
                                                user_id={user_id}
                                            />
                                        )
                                    )
                            }
                        </div>
                    )
                }
            </div>
        </div>

    )
}


const month = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']


/**
 * @function
 * @param {import('../../../../types/ExpenseType').ExpenseType} expense
 * @param isPlan
 * @param user_id
 * @returns {JSX.Element}
 * @category Expenses-Component
 */
function SectionItem({expense, isPlan, user_id}) {
    const {datetime, value, title, entity_type, id, primary_entity_id} = expense
    const dispatch = useDispatch()
    const navigate = useNavigate();

    let time = dateToStringFormat(datetime)

    const editRoute = isPlan
        ? `/travel/${primary_entity_id}/expenses/plan/edit/${id}/`
        : `/travel/${primary_entity_id}/expenses/edit/${id}/`


    async function handleRemove() {
        if (expense) {
            const storeName = isPlan ? constants.store.EXPENSES_PLAN : constants.store.EXPENSES_ACTUAL

            await storeDB.removeElement(storeName, expense.id).catch(console.error)
            await storeDB.addElement(
                constants.store.EXPENSES_ACTIONS,
                createAction(storeName, user_id, 'remove', expense)
            )

            const action = isPlan
                ? actions.expensesActions.removeExpensePlan
                : actions.expensesActions.removeExpenseActual
            dispatch(action(expense))
            pushAlertMessage({type: 'success', message: `Успешно удалено`})
        }
    }


    return (
        <Swipe
            onClick={() => navigate(editRoute)}
            onRemove={handleRemove}
            rightButton
            small
        >
            <div className={clsx('section-item', 'flex-between')}>
                <div>
                    <div>
                        {title || ''} <span>{entity_type || ''}</span>
                    </div>
                    <span>{time}</span>
                </div>

                <div>{formatter.format(value)} {expense.currency}</div>
            </div>
        </Swipe>
    )

}

export default Section
