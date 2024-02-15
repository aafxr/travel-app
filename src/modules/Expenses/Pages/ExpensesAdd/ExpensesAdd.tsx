import clsx from "clsx";
import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useRef, useState} from 'react'


import defaultHandleError from "../../../../utils/error-handlers/defaultHandleError";
import {useTravel, useUser} from "../../../../contexts/AppContextProvider";
import {ExpenseService, SectionService} from "../../../../classes/services";
import {pushAlertMessage} from "../../../../components/Alerts/Alerts";
import NumberInput from "../../../../components/ui/Input/NumberInput";
import {Expense, Section} from "../../../../classes/StoreEntities";
import Container from "../../../../components/Container/Container";
import Checkbox from "../../../../components/ui/Checkbox/Checkbox";
import {Input, PageHeader, Chip} from "../../../../components/ui";
import Select from "../../../../components/ui/Select/Select";
import Button from "../../../../components/ui/Button/Button";
import {currencySymbol, symbols} from "../../static/vars";

import '../../css/Expenses.css'





/**
 * страница добавления расходов <br/>
 * в зависимости от expensesType добавляются либо плановые либо текущие
 * @function
 * @category Pages
 */
export default function ExpensesAdd() {
    const {expenseCode} = useParams()
    const navigate = useNavigate()

    const travel = useTravel()
    const user = useUser()

    const [expense, setExpense] = useState<Expense>()
    const [sections, setSection] = useState<Section[]>([])

    const [selectedSection, setSelectedSection] = useState<Section>()
    const [loading, setLoading] = useState(false)

    const inputNameRef = useRef<HTMLInputElement>(null)
    const inputSumRef = useRef<HTMLInputElement>(null)

    const isPlan = location.pathname.includes('/plan/')

    let cs = Array.from(currencySymbol.entries()).find(([k,v]) => v === expense?.currency)


    useEffect(() => {
        if (!travel) return
        if (!user) return

        const defaultExpenseValue= new Expense({
            section_id: 'misc',
            variant: isPlan ? "expenses_plan" : "expenses_actual",
            primary_entity_id: travel.id
        }, user)

        if (expenseCode) {
            setLoading(true)
            ExpenseService.getById(expenseCode, user)
                .then(e =>  {
                    e && setExpense(e)
                } )
                .catch(defaultHandleError)
                .finally(() => setLoading(false))
        } else if (expenseCode === undefined){
            setExpense(defaultExpenseValue)
        }
    }, [])


    useEffect(() => {
        SectionService.getAll()
            .then((list )=> {
                setSection(list)
            })
            .catch(defaultHandleError)
    }, [])


    const expNameTitle = isPlan ? 'На что планируете потратить' : 'На что потратили'
    const buttonTitle = expenseCode ? 'Сохранить' : 'Добавить'


    function onChipSelect(section: Section) {
        if (!user) return
        if (!expense) return
        Expense.setSection_id(expense, section.id)
        setSelectedSection(section)
        setExpense(new Expense(expense, user))
    }


    function handleCurrencyChange(c: string) {
        if (!user) return
        if (!expense) return
        Expense.setCurrency(expense, currencySymbol.get(c)!)
        setExpense(new Expense(expense, user))
    }


    function handleNameChange(text: string) {
        if (!expense) return
        if (!user) return
        Expense.setTitle(expense, text)
        setExpense(new Expense(expense, user))
    }


    function handleValueChange(value: number) {
        if (!expense) return
        if (!user) return
        Expense.setValue(expense, value)
        setExpense(new Expense(expense, user))
    }

    function handlePersonalFlagChangge(value: boolean) {
        if (!expense) return
        Expense.setPersonal(expense, value ? 1 : 0)
        setExpense(expense)
    }


    async function handleExpense() {
        if (!expense) return
        if (!expense.title) {
            pushAlertMessage({type: 'warning', message: 'Укажите ' + expNameTitle.toLowerCase()})
            inputNameRef.current?.focus()
            return
        }
        if (!expense.value) {
            pushAlertMessage({type: 'warning', message: 'Укажите сумму'})
            inputSumRef.current?.focus()
            return
        }

        if (!user) {
            pushAlertMessage({type: 'danger', message: 'Необходимо авторизоваться.'})
            return
        }


        if (expenseCode)
            ExpenseService.update(expense, user)
                .then(() => navigate(-1))
                .catch(defaultHandleError)
        else
            ExpenseService.create(expense, user)
                .then(() => navigate(-1))
                .catch(defaultHandleError)
    }


    if (!travel || !user || !expense) return null


    return (
        <div className='wrapper'>
            <div className='content'>
                <div className='expenses-wrapper'>
                    <Container className='bb-2-grey pb-20' loading={loading}>
                        <PageHeader arrowBack title={'Добавить расходы'}/>
                        <div className='column gap-1'>
                            <div className='title'>Категория</div>
                            <div className={clsx('row flex-wrap gap-0.75 bb-2-grey pb-20')}>
                                {sections.map(
                                    (section) => (
                                        <Chip
                                            key={section.id}
                                            rounded
                                            color={section.id === expense.section_id ? 'orange' : 'grey'}
                                            onClick={() => onChipSelect(section)}
                                            pointer={selectedSection !== section}
                                        >
                                            {section.title}
                                        </Chip>
                                    )
                                )}
                            </div>
                            <div className='column gap-1'>
                                <div className='column gap-0.25'>
                                    <div className='title'>{expNameTitle}</div>
                                    <div className='expenses-input'>
                                        <Input
                                            ref={inputNameRef}
                                            type={'text'}
                                            value={expense.title}
                                            onChange={handleNameChange}
                                        />
                                    </div>
                                </div>
                                <div className='column gap-0.25'>
                                    <div className='title'>Сумма расходов:</div>
                                    <div className='relative'>
                                        <NumberInput
                                            ref={inputSumRef}
                                            className='expenses-currency-value number-hide-arrows'
                                            type="text"
                                            inputMode={'numeric'}
                                            min={0}
                                            step={0.01}
                                            value={expense?.value || 0}
                                            lang={navigator.language}
                                            onChange={handleValueChange}
                                        />
                                        <Select
                                            className='expenses-currency flex-0'
                                            value={cs ?cs[0]: '₽'}
                                            defaultValue=''
                                            options={[...symbols]}
                                            onChange={handleCurrencyChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            {
                                travel.members_count > 1 && (
                                    <Checkbox checked={Expense.isPersonal(expense, user)}
                                              onChange={handlePersonalFlagChangge} left>Личные</Checkbox>
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
