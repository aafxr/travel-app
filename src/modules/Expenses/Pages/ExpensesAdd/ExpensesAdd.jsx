import React, {useContext, useEffect, useState} from 'react'
import {useNavigate, useParams} from "react-router-dom";
import clsx from "clsx";

import createId from "../../../../utils/createId";
import {ExpensesContext} from "../../contextProvider/ExpensesContextProvider";

import Checkbox from "../../../../components/ui/Checkbox/Checkbox";
import {Input, PageHeader, Chip} from "../../../../components/ui";
import Container from "../../components/Container/Container";
import Button from "../../components/Button/Button";

import constants from "../../db/constants";

import '../../css/Expenses.css'
import updateLimit from "../../utils/updateLimit";
import {defaultFilterValue} from "../../static/vars";


/**
 * страница жобавления расходов
 *
 * в зависимости от expensesType добавляются либо плановые либо текущие
 * @param {string} user_id
 * @param {string} primary_entity_type
 * @param {'actual' | 'plan'} expensesType - default =  actual
 * @returns {JSX.Element}
 * @constructor
 */
export default function ExpensesAdd({
                                        user_id,
                                        primary_entity_type,
                                        expensesType = 'actual' // 'actual' | 'plan'
                                    }) {
    const {travelCode: primary_entity_id} = useParams()
    const {controller, defaultSection, sections} = useContext(ExpensesContext)
    const navigate = useNavigate()

    const [expName, setExpName] = useState('')
    const [expSum, setExpSum] = useState('')

    const [section_id, setSectionId] = useState(null)
    const [personal, setPersonal] = useState(() => defaultFilterValue() === 'personal')


    const isPlan = expensesType === 'plan'

    const expNameTitle = isPlan ? 'На что планируете потратить:' : 'На что потратили:'


    useEffect(() => {
        if (defaultSection) {
            setSectionId(defaultSection.id)
        }
    }, [defaultSection])

    function handler() {
        if (user_id && primary_entity_type) {
            const storeName = isPlan ? constants.store.EXPENSES_PLAN : constants.store.EXPENSES_ACTUAL

            controller.write({
                storeName,
                action: 'edit',
                user_id,
                data: {
                    user_id,
                    primary_entity_type: primary_entity_type,
                    primary_entity_id,
                    entity_type: '',
                    entity_id: '',
                    title: expName,
                    value: Number(expSum),
                    personal: personal ? 1 : 0,
                    section_id,
                    datetime: new Date().toISOString(),
                    created_at: new Date().toISOString(),
                    id: createId(user_id)
                }
            })

            isPlan && updateLimit(controller, primary_entity_type, primary_entity_id, section_id, user_id, personal)

            navigate(-1)
        } else {
            console.warn('need add user_id & primary_entity_type')
        }
    }

    function onChipSelect(section) {
        setSectionId(section.id)
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
                                                onClick={() => onChipSelect(section)}
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
                </div>
            </div>

            <div className='footer-btn-container footer'>
                <Button onClick={handler}
                        disabled={!section_id || !expName || !expSum}>Добавить</Button>
            </div>
        </div>
    )
}
