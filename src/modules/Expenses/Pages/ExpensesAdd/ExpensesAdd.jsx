import React, {useContext, useEffect, useRef, useState} from 'react'
import {useNavigate, useParams} from "react-router-dom";
import clsx from "clsx";


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

import constants from "../../../../static/constants";
import {useDispatch, useSelector} from "react-redux";
import {actions} from "../../../../redux/store";
import storeDB from "../../../../db/storeDB/storeDB";

import '../../css/Expenses.css'
import {updateLimits} from "../../helpers/updateLimits";


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
    const {defaultSection, sections} = useSelector(state => state[constants.redux.EXPENSES])
    const {user} = useSelector(state => state[constants.redux.USER])
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [expName, setExpName] = useState('')
    const [expSum, setExpSum] = useState('')
    const [expCurr, setExpCurr] = useState('')
    const [currency, setCurrency] = useState([])

    const [section_id, setSectionId] = useState(null)
    const [personal, setPersonal] = useState(() => defaultFilterValue() === 'personal')

    const inputNameRef = useRef()
    const inputSumRef = useRef()

    const expense = useExpense(expenseCode, expensesType)

    const isPlan = expensesType === 'plan'

    const expNameTitle = isPlan ? 'На что планируете потратить' : 'На что потратили'
    const buttonTitle = edit ? 'Сохранить' : 'Добавить'

    const user_id = user.id


    useEffect(() => {
        if (defaultSection) {
            setSectionId(defaultSection.id)
        }
    }, [defaultSection])


    useEffect(() => {
        (async function () {
            if (expense) {
                const key = new Date(expense.datetime).toLocaleDateString()
                let res = await storeDB.getOne(constants.store.CURRENCY, IDBKeyRange.lowerBound(key))
                let cr = res && res.value

                // здес должен быть запрос на добавление курса валют
                // if(!res) {
                //     res = await aFetch.get('/main/currency/getList/')
                // }

                const cur = cr.find(c => c.symbol === expense.currency) || cr[0]
                setExpName(expense.title)
                setExpSum(expense.value.toString())
                setSectionId(expense.section_id)
                setPersonal(expense.personal === 1)
                expense.currency && setExpCurr(cur)
                setCurrency(cr)
            } else{
                const key = new Date().toLocaleDateString()
                let res = await storeDB.getOne(constants.store.CURRENCY, IDBKeyRange.lowerBound(key))
                setCurrency(res && res.value)
            }
        })()
    }, [expense])


    function onChipSelect(section) {
        setSectionId(section)
    }

    function handleCurrencyChange(c) {
        const value = currency.find(cr => cr.symbol === c)
        value && setExpCurr(value)
    }

    async function handleExpense() {
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

        if (edit) {
            await handleEditExpense(isPlan, user_id, primary_entity_type, primary_entity_id, expName, value, expCurr, personal, section_id, expense)
                .then(item => {
                    const action = isPlan
                        ? actions.expensesActions.updateExpensePlan
                        : actions.expensesActions.updateExpenseActual
                    dispatch(action(item))
                })
        } else {
            await handleAddExpense(isPlan, user_id, primary_entity_type, primary_entity_id, expName, value, expCurr, personal, section_id)
                .then(item => {
                    const action = isPlan
                        ? actions.expensesActions.addExpensePlan
                        : actions.expensesActions.addExpenseActual
                    dispatch(action(item))
                })
        }

        if(isPlan){
            await updateLimits(primary_entity_id,user_id)()
                .then(items => {
                    console.log(items)
                    dispatch(actions.expensesActions.setExpensesLimit(items))
                })
        }
        navigate(-1)
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
                                            value={expCurr ? expCurr.symbol : '₽'}
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
