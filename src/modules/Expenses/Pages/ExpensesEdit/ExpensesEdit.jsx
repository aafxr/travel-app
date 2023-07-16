import {Chip, Input, PageHeader} from "../../../../components/ui";
import Container from "../../components/Container/Container";
import Button from "../../components/Button/Button";
import useExpense from "../../hooks/useExpense";
import React, {useContext, useEffect, useState} from "react";
import {ExpensesContext} from "../../contextProvider/ExpensesContextProvider";
import {useNavigate, useParams} from "react-router-dom";
import constants from "../../db/constants";
import updateLimit from "../../utils/updateLimit";
import clsx from "clsx";
import Checkbox from "../../../../components/ui/Checkbox/Checkbox";
import {defaultFilterValue} from "../../static/vars";

export default function ExpensesEdit({user_id, primary_entity_type, expensesType = 'plan'}) {
    const {controller, sections} = useContext(ExpensesContext)
    const {travelCode: primary_entity_id, expenseCode} = useParams()
    const navigate = useNavigate()

    const expense = useExpense(controller, expenseCode, expensesType)
    const [expName, setExpName] = useState('')
    const [expSum, setExpSum] = useState('')
    const [section_id, setSectionId] = useState(null)
    const [personal, setPersonal] = useState(() => defaultFilterValue() === 'personal')

    const isPlan = expensesType === 'plan'


    useEffect(() => {
        if (expense) {
            setExpName(expense.title)
            setExpSum(expense.value.toString())
            setSectionId(expense.section_id)
            setPersonal(expense.personal === 1)
        }
    }, [expense])


    function handler() {
        if (expense && user_id && primary_entity_type
            && (
                expense.title !== expName
                || expense.value !== +expSum
                || (expense.personal === 1) !== personal
                || expense.section_id !== section_id
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
                    section_id
                }
            })

            isPlan && updateLimit(controller, primary_entity_type, primary_entity_id, section_id, user_id, personal)

            navigate(-1)
        } else {
            console.warn('need add user_id & primary_entity_type')
        }
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
                                        onClick={() => setSectionId(section)}
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
                            <div className='title'>На что планируете потратить:</div>
                            <Input
                                type={'text'}
                                value={expName}
                                onChange={e => setExpName(e.target.value)}
                            />
                        </div>
                        <div className='column gap-0.25'>
                            <div className='title'>Сумма расходов:</div>
                            <Input
                                type={'text'}
                                value={expSum}
                                onChange={e => /^[0-9]*$/.test(e.target.value) && setExpSum(e.target.value)}
                            />
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
