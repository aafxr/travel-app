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

    const personalExpenses = expenses.filter(item => item.personal === 1 && user_id === item.user_id)

    const expensesList = personal ? personalExpenses : expenses

    const totalPersonalExpenses = personalExpenses
        .reduce((acc, item) => acc + item.value, 0)

    const percent = (totalPersonalExpenses / limit) || 0
    const color = percent < 0.45 ? '#52CF37' : percent > 0.82 ? '#FF0909' : '#E3CD00'

    let balance = limit - totalPersonalExpenses
    balance < 0 && (balance = 0)

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
                            <Line value={percent} color={color}/>
                            {
                                !!limit && (
                                    <div className={'flex-between'}>
                                        <div className='section-subtitle'>Лимит {limit} ₽</div>
                                        <div className='section-subtitle'>Осталось {balance} ₽</div>
                                    </div>
                                )
                            }
                        </>
                    )
                }
                {
                    !!expensesList.length && (
                        expensesList
                            .map(
                                item => <SectionItem key={item.id} {...item}/>
                            )

                    )
                }
            </div>
        </div>

    )
}


const month = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь']


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
        : time = time.getDay() + ' ' + month[time.getMonth()]


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