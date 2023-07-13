import React from "react";
import clsx from "clsx";
import Line from "../Line/Line";

import './Section.css'
import {Link, useParams} from "react-router-dom";


/**
 *
 * @param {import('../../models/SectionType').SectionType} section - имя секции расходов
 * @param {import('../../models/LimitType').LimitType | null} sectionLimit - лимит расходов поьзователя
 * @param {Array.<import('../../models/ExpenseType').ExpenseType>} expenses
 * @param {string} user_id
 * @param {boolean} personal
 * @param {boolean} line
 * @return {JSX.Element}
 * @constructor
 */
export default function Section({
                                    section,
                                    sectionLimit,
                                    expenses = [],
                                    user_id,
                                    personal = false,
                                    line = false,
                                }) {
    const {travelCode: primary_entity_id} = useParams()

    const title = section ? section.title : ''
    const limit = sectionLimit ? sectionLimit.value : 0

    const sectionTotalExpenses = expenses.reduce((acc, item) => acc + item.value, 0) || 0

    // const expensesList = personal ? personalExpenses : expenses

    const totalExpenses = expenses
        .reduce((acc, item) => acc + item.value, 0)

    const percent = (totalExpenses / limit) || 0
    const color = percent < 0.45 ? 'var(--color-success)' : percent > 0.82 ? 'var(--color-danger)' : 'var(--color-warning)'

    let balance = limit - totalExpenses

    return (
        <div className='expenses-list'>
            <div className='expenses-pt-20 expenses-pb-20'>
                <Link to={`/travel/${primary_entity_id}/expenses/limit/${section.id}`}>
                    <div className='flex-between'>
                        <div className='section-title'>{title}</div>
                        <div className='section-title'>{sectionTotalExpenses} ₽</div>
                    </div>
                </Link>
                {
                    !!line && (
                        <>
                            <Line value={limit ? percent : 0} color={color}/>
                            {
                                !!limit && (
                                    <div className={'flex-between'}>
                                        <div className='section-subtitle'>Лимит {limit} ₽</div>
                                        {
                                            balance >= 0
                                                ? <div className='section-subtitle'>Осталось: {balance} ₽</div>
                                                : <div className='section-subtitle red'>Перерасход: {Math.abs(balance)} ₽</div>
                                        }

                                    </div>
                                )
                            }
                        </>
                    )
                }
                {
                    !!expenses.length && (
                        expenses
                            .map(
                                item => <SectionItem key={item.id} {...item}/>
                            )

                    )
                }
            </div>
        </div>

    )
}


const month = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']


/**
 * @param {import('../../models/ExpenseType').ExpenseType} expense
 * @return {JSX.Element}
 * @constructor
 */
function SectionItem(expense) {
    const {datetime, value, title, entity_type} = expense

    let time = new Date(datetime)
    Number.isNaN(time)
        ? time = '--/--'
        : time = time.getUTCDate() + ' ' + month[time.getMonth()]


    return (
        <div className={clsx('section-item', 'flex-between')}>
            <div>
                <div>
                    {title || ''} <span>{entity_type || ''}</span>
                </div>
                <span>{time}</span>
            </div>

            <div>{value} ₽</div>
        </div>
    )

}