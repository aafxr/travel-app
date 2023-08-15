import React, {useContext, useEffect, useRef, useState} from 'react'
import {useNavigate, useParams} from "react-router-dom";
import clsx from "clsx";

import {ExpensesContext} from "../../contextProvider/ExpensesContextProvider";

import Checkbox from "../../../../components/ui/Checkbox/Checkbox";
import {Input, PageHeader, Chip} from "../../../../components/ui";
import Container from "../../../../components/Container/Container";
import Button from "../../../../components/ui/Button/Button";
import Select from "../../../../components/ui/Select/Select";

import {defaultFilterValue} from "../../static/vars";

import useExpense from "../../hooks/useExpense";
import handleEditExpense from "./handleEditExpense";
import handleAddExpense from "./handleAddExpense";
import {pushAlertMessage} from "../../../../components/Alerts/Alerts";
import currencyToFixedFormat from "../../../../utils/currencyToFixedFormat";

import '../../css/Expenses.css'
import {UserContext} from "../../../../contexts/UserContextProvider.jsx";
import {updateLimits} from "../../helpers/updateLimits";
import constants, {reducerConstants} from "../../../../static/constants";
import updateExpenses from "../../helpers/updateExpenses";
import expensesDB from "../../../../db/expensesDB/expensesDB";


/**
 * страница жобавления расходов
 *
 * в зависимости от expensesType добавляются либо плановые либо текущие
 * @param {string} primary_entity_type
 * @param {'actual' | 'plan'} expensesType - default =  actual
 * @param {boolean} edit - default =  false
 * @returns {JSX.Element}
 * @constructor
 */
export default function ExpensesAdd({
                                        primary_entity_type,
                                        expensesType = 'plan', // 'actual' | 'plan'
                                        edit = false
                                    }) {
    const {travelCode: primary_entity_id, expenseCode} = useParams()
    const {controller, defaultSection, sections, currency, dispatch} = useContext(ExpensesContext)
    const navigate = useNavigate()

    const [expName, setExpName] = useState('')
    const [expSum, setExpSum] = useState('')
    const [expCurr, setExpCurr] = useState(currency[0])

    const [section_id, setSectionId] = useState(null)
    const [personal, setPersonal] = useState(() => defaultFilterValue() === 'personal')

    const inputNameRef = useRef()
    const inputSumRef = useRef()

    const expense = useExpense(controller, expenseCode, expensesType)

    const isPlan = expensesType === 'plan'

    const expNameTitle = isPlan ? 'На что планируете потратить' : 'На что потратили'
    const buttonTitle = edit ? 'Сохранить' : 'Добавить'

    const {user} = useContext(UserContext)

    const user_id = user.id


    useEffect(() => {
        if (defaultSection) {
            setSectionId(defaultSection.id)
        }
    }, [defaultSection])


    useEffect(() => {
        if (expense) {
            const cur = currency.find(cr => cr.char_code === expense.currency) || currency[0]
            setExpName(expense.title)
            setExpSum(expense.value.toString())
            setSectionId(expense.section_id)
            setPersonal(expense.personal === 1)
            expense.currency && setExpCurr(cur)
        }
    }, [expense, currency])


    function onChipSelect(section) {
        setSectionId(section)
    }

    function handleCurrencyChange(c) {
        const value = currency.find(cr => cr.symbol === c)
        value && setExpCurr(value)
    }

    function handleExpense() {
        if (!expName) {
            pushAlertMessage({type: 'warning', message: 'Укажите ' + expNameTitle.toLowerCase()})
            inputNameRef.current?.focus()
            return
        }
        if (!expSum) {
            pushAlertMessage({type: 'warning', message: 'Укажите сумму'})
            inputSumRef.current?.focus()
            return
        }

        const value = currencyToFixedFormat(expSum)

        if (!value) {
            pushAlertMessage({type: 'warning', message: 'Сумма не корректна.'})
            inputSumRef.current?.focus()
            return
        }

        if (!user_id) {
            pushAlertMessage({type: 'danger', message: 'Необходимо авторизоваться.'})
            return
        }

        (edit
            ? handleEditExpense(controller, isPlan, user_id, primary_entity_type, primary_entity_id, expName, value, expCurr, personal, section_id, navigate, expense)
            : handleAddExpense(controller, isPlan, user_id, primary_entity_type, primary_entity_id, expName, value, expCurr, personal, section_id, navigate))
            .then(() => updateLimits(primary_entity_id, user_id, currency)(controller)
                .then(items => dispatch({type: reducerConstants.UPDATE_EXPENSES_LIMIT, payload: items}))
            )
            .then(() => {
                const store = isPlan ? constants.store.EXPENSES_PLAN : constants.store.EXPENSES_ACTUAL
                const reducerAction = isPlan ? reducerConstants.UPDATE_EXPENSES_PLAN : reducerConstants.UPDATE_EXPENSES_ACTUAL

                expensesDB.getManyFromIndex(store, constants.indexes.PRIMARY_ENTITY_ID, primary_entity_id)
                    .then(items => dispatch({type: reducerAction, payload: items}))

            })
    }

    return (
        <div className='wrapper'>
            <div className='content'>
                <div className='expenses-wrapper'>
                    <Container className='bb-2-grey'>
                        <PageHeader arrowBack title={'Добавить расходы'}/>
                        <div className='column gap-1'>
                            <div className='title'>Категория</div>
                            <div className={clsx('row flex-wrap gap-0.75 bb-2-grey pb-20')}>
                                {
                                    sections && !!sections.length && sections.map(
                                        (section) => (
                                            <Chip
                                                key={section.id}
                                                rounded
                                                color={section_id === section.id ? 'orange' : 'grey'}
                                                onClick={() => onChipSelect(section.id)}
                                                pointer={section_id !== section.id}
                                            >
                                                {section.title}
                                            </Chip>
                                        )
                                    )
                                }
                            </div>
                            <div className='column gap-1'>
                                <div className='column gap-0.25'>
                                    <div className='title'>{expNameTitle}</div>
                                    <div className='expenses-input'>
                                        <Input
                                            ref={inputNameRef}
                                            type={'text'}
                                            value={expName}
                                            onChange={e => setExpName(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className='column gap-0.25'>
                                    <div className='title'>Сумма расходов:</div>
                                    <div className='relative'>
                                        <Input
                                            ref={inputSumRef}
                                            className='expenses-currency-value number-hide-arrows'
                                            type="text"
                                            inputMode={'numeric'}
                                            min={0}
                                            step={0.01}
                                            value={expSum}
                                            lang={navigator.language}
                                            onInput={e => setExpSum(e.target.value)}

                                        />
                                        <Select
                                            className='expenses-currency no-resize'
                                            value={expCurr ? expCurr.symbol : ''}
                                            defaultValue=''
                                            options={currency.map(c => c.symbol)}
                                            onChange={handleCurrencyChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            <Checkbox checked={personal}
                                      onChange={e => setPersonal(e)} left>Личные</Checkbox>
                        </div>
                    </Container>
                </div>
            </div>

            <div className='footer-btn-container footer'>
                <Button onClick={handleExpense}>{buttonTitle}</Button>
            </div>
        </div>
    )
}
