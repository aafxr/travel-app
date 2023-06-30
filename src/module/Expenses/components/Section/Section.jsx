import React from "react";
import clsx from "clsx";
import Line from "../Line/Line";

import st from './Section.module.css'


/**
 *
 * @param {string} name имя секции расходов
 * @param {number} expLimit
 * @param {Array.<import('../../models/ExpenseModel').ExpenseType>} expenses
 * @param {boolean} actual
 * @return {JSX.Element}
 * @constructor
 */
export default function Section({
                                    name,
                                    expLimit,
                                    expenses = [],
                                    actual = false,
                                }) {
    const sectionTotalExpenses = expenses.reduce((acc, item) => acc + item.value, 0) || 0

    const personalExpenses = expenses
        .filter(item => item.personal === 1)
        .reduce((acc, item) => acc + item.value, 0)

    const persent = personalExpenses / expLimit
    const color = persent < 0.45 ? 'green' : persent > 0.82 ? 'red' : 'yellow'

    return (
        <div className={st.expensesList}>

            <div className={st.section}>
                <div className={clsx('flex-between')}>
                    <div className={st.sectionTitle}>{name}</div>
                    <div className={st.sectionTitle}>{sectionTotalExpenses}</div>
                </div>
                {
                    !!actual && (
                        <>
                            <Line value={personalExpenses / expLimit} color={color}/>
                            <div className={'flex-between'}>
                                <div className={st.sectionSubtitle}>Лимит {expLimit} ₽</div>
                                <div className={st.sectionSubtitle}>Осталось {expLimit - personalExpenses} ₽</div>
                            </div>
                        </>
                    )
                }
                {
                    !!expenses.length && expenses.map(
                        item => <SectionItem key={item.id} {...item}/>
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