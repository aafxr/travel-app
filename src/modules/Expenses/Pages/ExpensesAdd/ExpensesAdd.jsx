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


/**
 * страница жобавления расходов
 *
 * в зависимости от expensesType добавляются либо плановые либо текущие
 * @param {string} user_id
 * @param {string} primaryEntityType
 * @param {'actual' | 'plan'} expensesType - default =  actual
 * @returns {JSX.Element}
 * @constructor
 */
export default function ExpensesAdd({
                                        user_id,
                                        primaryEntityType,
                                        expensesType = 'actual' // 'actual' | 'plan'
                                    }) {
    const {travelCode: primary_entity_id} = useParams()
    const {controller, defaultSectionId} = useContext(ExpensesContext)
    const navigate = useNavigate()

    const [expName, setExpName] = useState('')
    const [expSum, setExpSum] = useState('')

    const [sections, setSections] = useState(null)
    const [section_id, setSectionId] = useState(null)
    const [personal, setPersonal] = useState(false)

    const isPlan = expensesType === 'plan'

    useEffect(() => {
        if (defaultSectionId) {
            setSectionId(defaultSectionId)
        }
    }, [defaultSectionId])

    useEffect(() => {
        controller.read({
            storeName: constants.store.SECTION,
            action: 'get',
            query: 'all'
        })
            .then(s => {
                s && setSections(s)
            })
            .catch(console.error)
    }, [controller])

    function handler() {
        if (user_id && primaryEntityType) {
            const data = {
                user_id,
                primary_entity_type: primaryEntityType,
                primary_entity_id,
                entity_type: '####',
                entity_id: '####',
                title: expName,
                value: Number(expSum),
                personal: personal ? 1 : 0,
                section_id,
                datetime: new Date().toISOString(),
                created_at: new Date().toISOString(),
                id: createId(user_id)
            }

            const storeName = isPlan ? constants.store.EXPENSES_PLAN : constants.store.EXPENSES_ACTUAL
            controller.write({
                storeName,
                action: 'edit',
                user_id,
                data
            })
                .then((res) => {
                    console.log('Ответ ', res)
                    console.log('Расход добавлен ', expName)
                })
                .catch(console.error)

            navigate(-1)
        } else {
            console.warn('need add user_id & primaryEntityType')
        }
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
                                        ({id, title}) => (
                                            <Chip
                                                key={id}
                                                rounded
                                                color={section_id === id ? 'orange' : 'grey'}
                                                onClick={() => setSectionId(id)}
                                            >
                                                {title}
                                            </Chip>
                                        ))
                                }
                            </div>
                            <div className='title'>Записать расходы</div>
                            <div className='column gap-0.25'>
                                <Input
                                    type={'text'}
                                    value={expName}
                                    onChange={e => setExpName(e.target.value)}
                                    placeholder='Название'
                                />
                                <Input
                                    type={'text'}
                                    value={expSum}
                                    onChange={e => /^[0-9]*$/.test(e.target.value) && setExpSum(e.target.value)}
                                    placeholder='Сумма'
                                />
                            </div>

                            <Checkbox checked={personal}
                                      onChange={e => setPersonal(e)} left>Личные</Checkbox>
                        </div>
                    </Container>
                </div>
            </div>

            <Button className='footer' onClick={handler}
                    disabled={!section_id || !expName || !expSum}>Добавить</Button>
        </div>
    )
}
