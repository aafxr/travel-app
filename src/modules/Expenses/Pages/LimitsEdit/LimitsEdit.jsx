import React, {useContext, useEffect, useMemo, useState} from 'react'
import {Link, useLocation, useNavigate, useParams} from "react-router-dom";

import {ExpensesContext} from "../../contextProvider/ExpensesContextProvider";
import {Chip, Input, PageHeader} from "../../../../components/ui";
import Container from "../../components/Container/Container";
import createId from "../../../../utils/createId";
import Button from "../../components/Button/Button";

import useExpenses from "../../hooks/useExpenses";
import useSections from "../../hooks/useSections";

import constants from "../../db/constants";

import '../../css/Expenses.css'
import useLimits from "../../hooks/useLimits";
import distinctValues from "../../../../utils/distinctValues";
import Checkbox from "../../../../components/ui/Checkbox/Checkbox";

/**
 * страница редактиррования лимитов
 * @param {string} user_id
 * @param {string} primary_entity_type
 * @returns {JSX.Element}
 * @constructor
 */
export default function LimitsEdit({
                                       user_id,
                                       primary_entity_type
                                   }) {
    const {travelCode: primary_entity_id, sectionId} = useParams()
    const {pathname} = useLocation()
    const {controller, defaultSection, sections, limits} = useContext(ExpensesContext)
    const navigate = useNavigate()

    const [expenses, updateExpenses] = useExpenses(controller, primary_entity_id, 'plan')

    const [limitObj, setLimitObj] = useState(null)
    const [personal, setPersonal] = useState(false)

    const [section_id, setSectionId] = useState(null)
    const [limitValue, setLimitValue] = useState('')

    const [message, setMessage] = useState('')

    const url = pathname.split('/')
    url.pop()
    url.pop()
    const backUrl = url.join('/') + '/'

    const minLimit = useMemo(() => {
        if (expenses && expenses.length && section_id) {
            return expenses
                .filter(e => (
                    e.section_id === section_id
                    && (personal
                        ? e.personal === 1 && e.user_id === user_id
                        : e.personal === 0)
                ))
                .reduce((acc, e) => e.value + acc, 0)
        }
        return 0
    }, [expenses, section_id, personal])


    //получаем все расходы (планы) за текущую поездку
    useEffect(() => {
        if (controller) {
            updateExpenses()
        }
    }, [controller])

    useEffect(() => {
        if (defaultSection) {
            setSectionId(sectionId || defaultSection.id)
        }
    }, [defaultSection])


    // если в бд уже был записан лимит записываем его в limitObj (либо null)
    useEffect(() => {
        if (section_id && limits && limits.length) {
            const limit = limits
                .filter(l => l.section_id === section_id)
                .find(l => personal
                    ? l.personal === 1 && l.user_id === user_id
                    : l.personal === 0
                )
            limit ? setLimitObj(limit) : setLimitObj(null)
        }
    }, [section_id, limits,  personal])


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
                        personal: personal ? 1: 0,
                        value: +limitValue,
                        user_id,
                        primary_entity_id,
                        primary_entity_type,
                        id: createId(user_id)
                    }
                })
                    .catch(console.error)
            }
        } else {
            console.warn('need add user_id')
        }
        navigate(backUrl || '/')
    }


    return (
        <>
            <div className='wrapper'>
                <div className='content'>
                    <Container>
                        <PageHeader arrowBack title={'Редактировать лимит'} to={backUrl}/>
                        <div className='column gap-1'>
                            <div className='row gap-0.75'>
                                {
                                    sections && !!sections.length && sections.map(
                                        ({id, title}) => (
                                            <Link key={id} to={`/travel/${primary_entity_id}/expenses/limit/${id}`}>
                                                <Chip
                                                    rounded
                                                    color={section_id === id ? 'orange' : 'grey'}
                                                    onClick={() => setSectionId(id)}
                                                >
                                                    {title}
                                                </Chip>
                                            </Link>
                                        )
                                    )
                                }
                            </div>
                            <div className='column gap-1'>
                                <div className='column gap-0.25'>
                                    <Input
                                        value={limitValue}
                                        onChange={e => /^[0-9]*$/.test(e.target.value) && setLimitValue(e.target.value)}
                                        type={'text'}
                                        placeholder='Лимит'
                                    />
                                    {!!message && <div className='expenses-message'>{message}</div>}
                                </div>
                                <Checkbox onChange={() => setPersonal(!personal)} checked={personal} left> Личный лимит</Checkbox>
                            </div>
                        </div>

                    </Container>
                </div>
                <div className='footer-btn-container'>
                    <Button className='footer' onClick={handler}>Добавить</Button>
                </div>
            </div>
        </>
    )
}
