import React, {useContext, useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import clsx from "clsx";

import {Chip, Input, PageHeader} from "../../../../components/ui";
import Container from "../../components/Container/Container";
import Button from "../../components/Button/Button";
import {ExpensesContext} from "../../contextProvider/ExpensesContextProvider";
import Checkbox from "../../../../components/ui/Checkbox/Checkbox";
import Select from "../../../../components/ui/Select/Select";

import useExpense from "../../hooks/useExpense";

import {currency, defaultFilterValue} from "../../static/vars";
import constants from "../../db/constants";




export default function ExpensesEdit({user_id, primary_entity_type, expensesType = 'plan'}) {
    const {controller, sections} = useContext(ExpensesContext)
    const {expenseCode} = useParams()
    const navigate = useNavigate()

    const expense = useExpense(controller, expenseCode, expensesType)
    const [expName, setExpName] = useState('')
    const [expSum, setExpSum] = useState('')
    const [expCurr, setExpCurr] = useState(currency[0])
    const [section_id, setSectionId] = useState(null)
    const [personal, setPersonal] = useState(() => defaultFilterValue() === 'personal')

    const isPlan = expensesType === 'plan'

    const expNameTitle = isPlan ? 'На что планируете потратить:' : 'На что потратили:'


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


    function handler() {
        if (expense && user_id
            && (
                expense.title !== expName
                || expense.value !== +expSum
                || expense.personal  !== (personal ? 1: 0)
                || expense.section_id !== section_id
                || expense.currency !== expCurr.code
            )

        ) {
            const storeName = isPlan ? constants.store.EXPENSES_PLAN : constants.store.EXPENSES_ACTUAL

            controller.write({
                storeName,
                action: 'edit',
                user_id,
                data: {
                    ...expense,
                    personal: personal ? 1 : 0,
                    title: expName,
                    value: +expSum,
                    currency: expCurr.code,
                    section_id
                }
            })

            navigate(-1)
        } else {
            console.warn('need add user_id & primary_entity_type')
        }
    }


    function handleCurrencyChange(c){
        const value = currency.find(cr => cr.symbol === c)
        value && setExpCurr(value)
    }

    return (
        <div className='wrapper'>
            <Container className='content'>
                <PageHeader arrowBack title={'Редактировать расходы'}/>
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
                                        onClick={() => setSectionId(section.id)}
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
                            <Input
                                type={'text'}
                                value={expName}
                                onChange={e => setExpName(e.target.value)}
                            />
                        </div>
                        <div className='column gap-0.25'>
                            <div className='title'>Сумма расходов:</div>
                            <div className='relative column'>
                                <Input
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
            <div className='footer-btn-container footer'>
                <Button onClick={handler}>Сохранить</Button>
            </div>
        </div>
    )
}
