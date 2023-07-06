import React, {useContext, useEffect, useMemo, useState} from 'react'
import {useNavigate, useParams} from "react-router-dom";

import {ExpensesContext} from "../../contextProvider/ExpensesContextProvider";
import {Chip, Input, PageHeader} from "../../../../components/ui";
import Container from "../../components/Container/Container";
import createId from "../../../../utils/createId";
import Button from "../../components/Button/Button";

import useExpenses from "../../hooks/useExpenses";
import useSections from "../../hooks/useSections";

import useLimit from "../../hooks/useLimit";

import constants from "../../db/constants";

import '../../css/Expenses.css'
import useLimits from "../../hooks/useLimits";
import distinctValues from "../../../../utils/distinctValues";

/**
 * страница редактиррования лимитов
 * @param {string} user_id
 * @param {string} primaryEntityType
 * @returns {JSX.Element}
 * @constructor
 */
export default function LimitsEdit({
                                       user_id,
                                       primaryEntityType
                                   }) {
    const {travelCode: primary_entity_id} = useParams()
    const {controller} = useContext(ExpensesContext)
    const navigate = useNavigate()

    const [expenses, updateExpenses] = useExpenses(controller, primary_entity_id, 'plan')
    const sectionsList = distinctValues(expenses, e => e.section_id)
    const [sections, updateSections] = useSections(controller, sectionsList)
    const [limits, updateLimits] = useLimits(controller, primary_entity_id, sectionsList)

    const [limitObj, setLimitObj] = useState(null)

    const [section_id, setSectionId] = useState(null)
    const [limitValue, setLimitValue] = useState('')

    const [message, setMessage] = useState('')

    const minLimit = useMemo(() => {
        if (expenses && expenses.length && section_id) {
            return expenses
                .filter(e => e.section_id === section_id)
                .reduce((acc, e) => e.value + acc, 0)
        }
        return 0
    }, [expenses, section_id])


    //получаем все расходы (планы) за текущую поездку
    useEffect(() => {
        if (controller) {
            updateExpenses()
        }
    }, [controller])

    //получаем все секции и лимиты в зависимости от наличия расходов
    useEffect(() => {
        if (expenses && expenses.length) {
            updateSections()
            updateLimits()
        }
    }, [expenses])


    // если в бд уже был записан лимит записываем его в limitObj (либо null)
    useEffect(() => {
        if (section_id && limits && limits.length) {
            const limit = limits.find(l => l.section_id === section_id)
            limit ? setLimitObj(limit) : setLimitObj(null)
        }
    }, [section_id])


    useEffect(() => {
        limitObj ? setLimitValue(limitObj.value) : setLimitValue(minLimit)
    }, [minLimit, limitObj])


    // обновляем данные в бд либо выволим сообщение о некоректно заданном лимите
    function handler() {
        if (+limitValue < minLimit) {
            setMessage(`Лимит должен быть больше ${minLimit}`)
            return
        }

        if (user_id) {
            if (limitObj) {
                controller.write({
                    storeName: constants.store.LIMIT,
                    action: 'edit',
                    user_id,
                    data: {...limitObj, value: +limitValue}
                })
            } else {
                controller.write({
                    storeName: constants.store.LIMIT,
                    action: 'add',
                    user_id,
                    data: {
                        section_id,
                        personal: 1,
                        value: +limitValue,
                        primary_entity_id,
                        id: createId(user_id)
                    }
                })
                    .catch(console.error)
            }
        } else {
            console.warn('need add user_id')
        }
        navigate('/')
    }


    return (
        <>
            <div className='wrapper'>
                <div className='content'>
                    <PageHeader arrowBack title={'Редактировать лимит'}/>
                    <Container className='expenses-pt-20'>
                        <div className='column gap-1'>
                            <div className='flex-gap-row'>
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
                                        )
                                    )
                                }
                            </div>
                            <div className='column gap-0.25'>
                                <Input
                                    value={limitValue}
                                    onChange={e => /^[0-9]*$/.test(e.target.value) && setLimitValue(e.target.value)}
                                    type={'text'}
                                    placeholder='Лимит'
                                />
                                {!!message && <div className='expenses-message'>{message}</div>}
                            </div>
                        </div>

                    </Container>
                </div>
                <Button className='footer'
                        onClick={handler}>Добавить</Button>{/*disabled={(+limitValue) === 0 || !section_id}*/}
            </div>
        </>
    )
}
