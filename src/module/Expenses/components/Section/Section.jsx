import React from "react";
import st from './Line.module.css'
import Line from "../Line/Line";
import clsx from "clsx";


/**
 *
 * @param {string} name имя секции расходов
 * @param {number} expLimit
 * @param {Array.<import('../../models/ExpenseModel').ExpenseType>} expenses
 * @return {JSX.Element}
 * @constructor
 */
export default function Section({
                                    name,
                                    expLimit,
                                    expenses = []
                                }) {
    const sectionTotalExpenses = expenses.reduce((acc, item) => acc + item.value) || 0
    const personalExpenses = expenses
        .filter(item => item.personal === 1)
        .reduce((acc, item) => acc + item.value)


    return <div className={st.section}>
        <div className={'flex-between'}>
            <div className={st.sectionTitle}>{name}</div>
            <div className={st.sectionTitle}>{sectionTotalExpenses}</div>
        </div>
        <Line value={personalExpenses / expLimit} color={'green'}/>
        <div className={'flex-between'}>
            <div className={st.sectionTitle}>Лимит {name} ₽</div>
            <div className={st.sectionTitle}>Осталось {sectionTotalExpenses} ₽</div>
        </div>
        {
            !!expenses.length && expenses.map(
                item => <SectionItem key={item.id} {...item}/>
            )
        }

    </div>
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


    return <div className={clsx(st.sctionItem, 'flex-between')}>
        <div>
            <div>
                {title || ''} <span>{entity_type || ''}</span>
            </div>
            <span>{time}</span>
        </div>

        <div>{value} ₽</div>
    </div>

}