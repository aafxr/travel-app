import clsx from "clsx";
import React, {useEffect, useMemo, useState} from "react";
import {Link, useNavigate} from "react-router-dom";

import defaultHandleError from "../../../../utils/error-handlers/defaultHandleError";
import {Expense, Section as SectionEntity, User} from "../../../../classes/StoreEntities";
import {ExpenseService, SectionService} from "../../../../classes/services";
import {useTravel, useUser} from "../../../../contexts/AppContextProvider";
import {useLimit} from "../../../../contexts/ExpensesContexts/useLimit";
import dateToStringFormat from "../../../../utils/dateToStringFormat";
import {pushAlertMessage} from "../../../../components/Alerts/Alerts";
import {formatter} from "../../../../utils/currencyFormat";
import Swipe from "../../../../components/ui/Swipe/Swipe";
import {currencySymbol} from "../../static/vars";
import Line from "../Line/Line";

import './Section.css'

type SectionPropsType = {
    section_id: string,
    expenses: Expense[]
}

/**
 * @function
 * @name Section
 * @param {string} title - имя секции расходов
 * @param {Expense[]} expenses
 * @param {string} section_id
 * @return {JSX.Element}
 * @category ExpensesActual-Component
 */
function Section({
                     section_id,
                     expenses,
                 }: SectionPropsType) {
    const user = useUser()
    const travel = useTravel()

    const [section, setSection] = useState<SectionEntity>()
    const limit = useLimit(section_id)
    const total = useMemo(() => expenses.reduce((a, e) => a + e.valueOf(), 0), [expenses])

    useEffect(() => {
        SectionService.getSectionById(section_id)
            .then(setSection)
            .catch(defaultHandleError)
    }, [])


    let percent = 0
    if (limit) percent = total / limit.value

    const color = percent < 0.45 ? 'var(--color-success)' : percent > 0.82 ? 'var(--color-danger)' : 'var(--color-warning)'

    let balance = (limit?.value || 0) - total

    if (!travel || !user) return null

    return (
        <div className='expenses-list'>
            <div>
                <Link to={`/travel/${travel.id}/expenses/limit/${section_id}/`}>
                    <div className='flex-between'>
                        <div className='section-title'>{section?.title}</div>
                        <div className='section-title'>{formatter.format(total)} ₽</div>
                    </div>
                </Link>
                {
                    <>
                        <Line value={User.getSetting(user, 'expensesFilter') !== "all" ? percent : 0} color={color}/>
                        {
                            !!limit && (
                                <div className={'flex-between'}>
                                    <div className='section-subtitle'>Лимит {formatter.format(limit.value)} ₽</div>
                                    {balance >= 0
                                        ?
                                        <div className='section-subtitle'>Осталось: {formatter.format(balance)} ₽</div>
                                        : <div
                                            className='section-subtitle red'>Перерасход: {formatter.format(Math.abs(balance))} {currencySymbol.get(user.currency)}</div>
                                    }
                                </div>
                            )
                        }
                    </>
                }
                {
                    !!expenses.length && (
                        <div className='section-items column gap-0.5'>
                            {
                                expenses.map(item => (<SectionItem key={item.id} expense={item}/>))
                            }
                        </div>
                    )
                }
            </div>
        </div>

    )
}


// const month = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']


/**
 * @function
 * @param {Expense} expense
 * @param user_id
 * @returns {JSX.Element}
 * @category ExpensesActual-Component
 */
function SectionItem({expense}: { expense: Expense }) {
    const {datetime, value, title, entity_type, id, primary_entity_id} = expense
    const travel = useTravel()
    const user = useUser()
    const navigate = useNavigate();

    let time = dateToStringFormat(datetime)
    const isPlan = expense.variant === 'expenses_plan'
    const editRoute = isPlan
        ? `/travel/${primary_entity_id}/expenses/plan/edit/${id}/`
        : `/travel/${primary_entity_id}/expenses/edit/${id}/`


    async function handleRemove() {
        if (!travel || !user) return
        if (expense) {
            if (isPlan) {
                ExpenseService.delete(expense, user)
                    .then(() => pushAlertMessage({type: 'success', message: `Успешно удалено`}))
                    .catch(defaultHandleError)
            }

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

                <div>{formatter.format(value)} {currencySymbol.get(expense.currency)}</div>
            </div>
        </Swipe>
    )

}

export default Section
