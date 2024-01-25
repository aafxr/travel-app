import clsx from "clsx";
import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useRef, useState} from 'react'


import defaultHandleError from "../../../../utils/error-handlers/defaultHandleError";
import currencyToFixedFormat from "../../../../utils/currencyToFixedFormat";
import {pushAlertMessage} from "../../../../components/Alerts/Alerts";
import Container from "../../../../components/Container/Container";
import Checkbox from "../../../../components/ui/Checkbox/Checkbox";
import useTravelContext from "../../../../hooks/useTravelContext";
import {Input, PageHeader, Chip} from "../../../../components/ui";
import useUserSelector from "../../../../hooks/useUserSelector";
import Select from "../../../../components/ui/Select/Select";
import Button from "../../../../components/ui/Button/Button";
import constants from "../../../../static/constants";
import storeDB from "../../../../classes/db/storeDB/storeDB";
import {defaultFilterValue} from "../../static/vars";
import {Expense} from "../../../../classes/StoreEntities/Expense";
import useExpense from "../../hooks/useExpense";

import '../../css/Expenses.css'


/**
 * страница добавления расходов <br/>
 * в зависимости от expensesType добавляются либо плановые либо текущие
 * @function
 * @name ExpensesAdd
 * @param {'actual' | 'planned'} expensesType - default =  actual
 * @param {boolean} edit - default =  false
 * @returns {JSX.Element}
 * @category Pages
 */
export default function ExpensesAdd({
                                        expensesType = 'planned',
                                        edit = false
                                    }) {
    const {expenseCode} = useParams()
    const {travel, travelObj} = useTravelContext()
    // const {defaultSection, sections} = useSelector(state => state[constants.redux.EXPENSES])
    const user = useUserSelector()
    const navigate = useNavigate()

    const [expName, setExpName] = useState('')
    const [expSum, setExpSum] = useState('')
    const [expCurr, setExpCurr] = useState('')
    const [currency, setCurrency] = useState(/**@type{CurrencyType[]}*/[])

    const [section_id, setSectionId] = useState(null)
    const [personal, setPersonal] = useState(() => travelObj.members_count === 1 ? true : defaultFilterValue() === 'personal')

    const inputNameRef = useRef()
    const inputSumRef = useRef()

    const expense = useExpense(expenseCode, expensesType)

    const isPlan = expensesType === 'planned'

    const expNameTitle = isPlan ? 'На что планируете потратить' : 'На что потратили'
    const buttonTitle = edit ? 'Сохранить' : 'Добавить'

    const user_id = user.id


    useEffect(() => {
        if (travel) {
            setSectionId(travel.defaultSections.find(s => s.id === 'misc')?.id)
        }
    }, [travel])


    useEffect(() => {
        (async function () {
            if (expense) {
                const key = new Date(expense.datetime).getTime()
                /**@type{ExchangeType}*/
                let res = await storeDB.getOne(constants.store.CURRENCY, IDBKeyRange.upperBound(key))
                let cr = res && res.value

                const cur = cr?.find(c => c.symbol === expense.currency) || (cr && cr[0]) || []
                setExpName(expense.title)
                setExpSum(expense.value.toString())
                setSectionId(expense.section_id)
                setPersonal(expense.personal === 1)
                expense.currency && setExpCurr(cur.symbol || '₽')
                setCurrency(cr)
            } else {
                const key = Date.now()
                /**@type{ExchangeType}*/
                let res = await storeDB.getOne(constants.store.CURRENCY, IDBKeyRange.upperBound(key))
                setCurrency(res && res.value)
            }
        })()
    }, [expense])


    /**@param {string} section*/
    function onChipSelect(section) {
        setSectionId(section)
    }

    function handleCurrencyChange(c) {
        const value = currency.find(cr => cr.symbol === c)
        value && setExpCurr(value.symbol)
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

        /**@type{Expense}*/
        let _ex
        if (expense) _ex = expense
        else _ex = new Expense(travel, undefined, user.id, expensesType)


        _ex
            .setTitle(expName)
            .setValue(value)
            .setPersonal(personal ? 1 : 0)
            .setCurrency(expCurr)
            .setCreatedAt(new Date().toISOString())
            .setSectionId(section_id)
            .setPrimaryEntityID(travelObj.id)
            .save()
            .then(e => travel.addExpense(e, isPlan ? 'planned' : 'actual'))
            .catch(defaultHandleError)
            .finally(() => navigate(-1))
    }


    return (
        <div className='wrapper'>
            <div className='content'>
                <div className='expenses-wrapper'>
                    <Container className='bb-2-grey pb-20'>
                        <PageHeader arrowBack title={'Добавить расходы'}/>
                        <div className='column gap-1'>
                            <div className='title'>Категория</div>
                            <div className={clsx('row flex-wrap gap-0.75 bb-2-grey pb-20')}>
                                {
                                    !!travel.defaultSections.length && travel.defaultSections.map(
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
                                            className='expenses-currency flex-0'
                                            value={expCurr ? expCurr : '₽'}
                                            defaultValue=''
                                            options={currency?.map(c => c.symbol)}
                                            onChange={handleCurrencyChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            {
                                travelObj.members_count > 1 && (
                                    <Checkbox checked={personal}
                                              onChange={e => setPersonal(e)} left>Личные</Checkbox>
                                )
                            }
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
