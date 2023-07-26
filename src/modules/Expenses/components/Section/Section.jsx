import React, {useContext} from "react";
import clsx from "clsx";
import Line from "../Line/Line";

import {Link, useNavigate, useParams} from "react-router-dom";
import Swipe from "../../../../components/ui/Swipe/Swipe";

import './Section.css'
import {formatter} from "../../../../utils/currencyFormat";
import {currency} from "../../static/vars";
import {ExpensesContext} from "../../contextProvider/ExpensesContextProvider";
import constants from "../../db/constants";
import {pushAlertMessage} from "../../../../components/Alerts/Alerts";

/**
 *
 * @param {import('../../models/SectionType').SectionType} section - имя секции расходов
 * @param {function} sectionLimit - лимит расходов поьзователя
 * @param {Array.<import('../../models/ExpenseType').ExpenseType>} expenses
 * @param {string} user_id
 * @param {boolean} personal
 * @param {boolean} line
 * @return {JSX.Element}
 * @constructor
 */
function Section({
                     section,
                     sectionLimit,
                     expenses = [],
                     user_id,
                     personal = false,
                     line = false,
                 }) {
    const {travelCode: primary_entity_id} = useParams()
    const {currency} = useContext(ExpensesContext)

    if(!currency.length)
        return null

    const title = section ? section.title : ''
    let limit = sectionLimit(section)
    limit = limit ? limit.value : 0


    const totalExpenses = expenses
        .reduce((acc, item) => {
            const cur = currency.find(c => c.char_code === item.currency)?.value || 1
            return acc + item.value * cur
        }, 0)

    const percent = (totalExpenses / limit) || 0
    const color = percent < 0.45 ? 'var(--color-success)' : percent > 0.82 ? 'var(--color-danger)' : 'var(--color-warning)'

    let balance = limit - totalExpenses


    return (
        <div className='expenses-list'>
            <div>
                <Link to={`/travel/${primary_entity_id}/expenses/limit/${section.id}/`}>
                    <div className='flex-between'>
                        <div className='section-title'>{title}</div>
                        <div className='section-title'>{formatter.format(totalExpenses)} ₽</div>
                    </div>
                </Link>
                {
                    !!line && (
                        <>
                            <Line value={limit ? percent : 0} color={color}/>
                            {
                                !!limit && (
                                    <div className={'flex-between'}>
                                        <div className='section-subtitle'>Лимит {formatter.format(limit)} ₽</div>
                                        {
                                            balance >= 0
                                                ? <div className='section-subtitle'>Осталось: {formatter.format(balance)} ₽</div>
                                                : <div className='section-subtitle red'>Перерасход: {formatter.format(Math.abs(balance))} ₽</div>
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
                                                isPlan={!line}
                                                currencySymbol={currency.find(c => c.char_code === item.currency)?.symbol || ''}
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
 *
 * @param {import('../../models/ExpenseType').ExpenseType} expense
 * @param isPlan
 * @param currencySymbol
 * @returns {JSX.Element}
 * @constructor
 */
function SectionItem({expense, isPlan, currencySymbol, user_id}) {
    const {datetime, value, title, entity_type, id, primary_entity_id} = expense
    const navigate = useNavigate();
    const {controller} = useContext(ExpensesContext)

    let time = new Date(datetime)
    let minutes = time.getMinutes().toString()
    minutes = minutes.length < 2 ? 0 + minutes : minutes
    Number.isNaN(time)
        ? time = '--/--'
        : time = time.getUTCDate() + ' ' + month[time.getMonth()] + ' ' + time.getHours() + ':' + minutes


    const editRoute = isPlan
        ? `/travel/${primary_entity_id}/expenses/plan/edit/${id}/`
        : `/travel/${primary_entity_id}/expenses/edit/${id}/`




    function handleRemove(){
        if (controller && expense) {
            const storeName = isPlan ? constants.store.EXPENSES_PLAN : constants.store.EXPENSES_ACTUAL

            controller.write({
                storeName,
                action: 'remove',
                data: expense,
                user_id
            })
                .then(() => {
                    pushAlertMessage({type: 'success', message: `Успешно удалено`})
                })
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

                <div>{formatter.format(value)} {currencySymbol}</div>
            </div>
        </Swipe>
    )

}

export default Section
