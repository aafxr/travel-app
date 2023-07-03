import React from "react";
import clsx from "clsx";
import Line from "../Line/Line";

import st from './Section.module.css'


/**
 *
 * @param {string} name имя секции расходов
 * @param {number} expLimit
 * @param {Array.<import('../../models/ExpenseModel').ExpenseType>} expenses
 * @param {string} user_id
 * @param {boolean} personal
 * @param {boolean} actual
 * @return {JSX.Element}
 * @constructor
 */
export default function Section({
                                    name,
                                    expLimit,
                                    expenses = [],
                                    user_id,
                                    personal = false,
                                    actual = false,
                                }) {
    const sectionTotalExpenses = expenses.reduce((acc, item) => acc + item.value, 0) || 0

    const personalExpenses = expenses.filter(item => item.personal === 1 && user_id === item.user_id)

    const expensesList = personal ? personalExpenses: expenses

    const totalPersonalExpenses = personalExpenses
        .reduce((acc, item) => acc + item.value, 0)

    const percent = (totalPersonalExpenses / expLimit) || 0
    const color = percent < 0.45 ? '#52CF37' : percent > 0.82 ? '#FF0909' : '#E3CD00'

    let balance = expLimit - totalPersonalExpenses
    balance < 0 && (balance = 0)

    return (
        <div className={st.expensesList}>
            <div className='expenses-pt-20 expenses-pb-20'>
                <div className={clsx('flex-between')}>
                    <div className={st.sectionTitle}>{name}</div>
                    <div className={st.sectionTitle}>{sectionTotalExpenses} ₽</div>
                </div>
                {
                    !!actual && (
                        <>
                            <Line value={percent} color={color}/>
                            {
                                !!expLimit && (
                                    <div className={'flex-between'}>
                                        <div className={st.sectionSubtitle}>Лимит {expLimit} ₽</div>
                                        <div className={st.sectionSubtitle}>Осталось {balance} ₽</div>
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
 * @param {import('../../models/ExpenseModel').ExpenseType} expense
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
        <div className={clsx(st.sectionItem, 'flex-between')}>
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