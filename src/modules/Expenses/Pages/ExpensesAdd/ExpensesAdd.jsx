import React, {useContext, useEffect, useRef, useState} from 'react'
import {useNavigate, useParams} from "react-router-dom";
import clsx from "clsx";

import {ExpensesContext} from "../../contextProvider/ExpensesContextProvider";

import Checkbox from "../../../../components/ui/Checkbox/Checkbox";
import {Input, PageHeader, Chip} from "../../../../components/ui";
import Container from "../../components/Container/Container";
import Button from "../../components/Button/Button";
import Select from "../../../../components/ui/Select/Select";

import {defaultFilterValue, currency} from "../../static/vars";

import '../../css/Expenses.css'
import useExpense from "../../hooks/useExpense";
import handleEditExpense from "./handleEditExpense";
import handleAddExpense from "./handleAddExpense";
import {pushAlertMessage} from "../../../../components/Alerts/Alerts";


/**
 * страница жобавления расходов
 *
 * в зависимости от expensesType добавляются либо плановые либо текущие
 * @param {string} user_id
 * @param {string} primary_entity_type
 * @param {'actual' | 'plan'} expensesType - default =  actual
 * @param {boolean} edit - default =  false
 * @returns {JSX.Element}
 * @constructor
 */
export default function ExpensesAdd({
                                        user_id,
                                        primary_entity_type,
                                        expensesType = 'actual', // 'actual' | 'plan'
                                        edit = false
                                    }) {
    const {travelCode: primary_entity_id, expenseCode} = useParams()
    const {controller, defaultSection, sections} = useContext(ExpensesContext)
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


    useEffect(() => {
        if (defaultSection) {
            setSectionId(defaultSection.id)
        }
    }, [defaultSection])


    useEffect(() => {
        if (expense) {
            const cur = currency.find(cr => cr.code === expense.currency)
            setExpName(expense.title)
            setExpSum(expense.value.toString())
            setSectionId(expense.section_id)
            setPersonal(expense.personal === 1)
            expense.currency && setExpCurr(cur)
        }
    }, [expense])


    function onChipSelect(section) {
        setSectionId(section)
    }

    function handleCurrencyChange(c) {
        const value = currency.find(cr => cr.symbol === c)
        value && setExpCurr(value)
    }

    function handleExpense(){
        if (!expName ){
            pushAlertMessage({type: 'warning', message: 'Укажите ' + expNameTitle.toLowerCase()})
            inputNameRef.current?.focus()
            return
        }
        if (!expSum){
            pushAlertMessage({type: 'warning', message: 'Укажите сумму'})
            inputSumRef.current?.focus()
            return
        }
        edit
            ? handleEditExpense(controller, isPlan,user_id,primary_entity_type,primary_entity_id,expName,expSum, expCurr, personal,section_id,navigate, expense)
            : handleAddExpense(controller, isPlan,user_id,primary_entity_type,primary_entity_id,expName,expSum, expCurr, personal,section_id,navigate)

    }

    return (
        <div className='wrapper'>
            <div className='content'>
                <div className='expenses-wrapper'>
                    <Container className='bb-2-grey'>
                        <PageHeader arrowBack title={'Добавить расходы'}/>
                        <div className='column gap-1'>
                            <div className='title'>Категория</div>
                            <div className={clsx('row flex-wrap gap-0.75 bb-2-grey expenses-pb-20')}>
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
                                    <div className='relative column'>
                                        <Input
                                            ref={inputSumRef}
                                            className='expenses-currency-value'
                                            type={'text'}
                                            value={expSum}
                                            onChange={e => /^[0-9]*$/.test(e.target.value) && setExpSum(e.target.value)}
                                        />
                                        <Select
                                            className='expenses-currency'
                                            value={expCurr ? expCurr.symbol : ''}
                                            defaultValue={currency[0].symbol}
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
                <Button onClick={handleExpense} >{buttonTitle}</Button>
            </div>
        </div>
    )
}
