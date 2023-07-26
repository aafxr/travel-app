import React, {useContext, useEffect, useMemo, useState} from 'react'
import {Link, useLocation, useNavigate, useParams} from "react-router-dom";

import {ExpensesContext} from "../../contextProvider/ExpensesContextProvider";
import {Chip, Input, PageHeader} from "../../../../components/ui";
import Container from "../../components/Container/Container";
import createId from "../../../../utils/createId";
import Button from "../../../../components/ui/Button/Button";


import constants from "../../db/constants";

import '../../css/Expenses.css'
import Checkbox from "../../../../components/ui/Checkbox/Checkbox";
import {defaultFilterValue} from "../../static/vars";
import {pushAlertMessage} from "../../../../components/Alerts/Alerts";
import updateExpenses from "../../helpers/updateExpenses";
import currencyToFixedFormat from "../../../../utils/currencyToFixedFormat";

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
    const  {pathname} = useLocation()

    const isPlan = pathname.includes('plan')

    const backUrl = isPlan
        ? `/travel/${primary_entity_id}/expenses/plan/`
        : `/travel/${primary_entity_id}/expenses/`

    const {controller, defaultSection, sections, limits} = useContext(ExpensesContext)
    const navigate = useNavigate()

    const [expenses, setExpenses] = useState([])

    const [limitObj, setLimitObj] = useState(null)
    const [personal, setPersonal] = useState(() => defaultFilterValue() === 'personal')

    const [section_id, setSectionId] = useState(null)
    const [limitValue, setLimitValue] = useState('')

    const [message, setMessage] = useState('')



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
    }, [expenses, section_id, personal, user_id])


    //получаем все расходы (планы) за текущую поездку
    useEffect(() => {
        controller && updateExpenses(controller, primary_entity_id, 'plan').then(setExpenses)
    }, [controller])

    useEffect(() => {
            defaultSection && setSectionId(sectionId || defaultSection.id)
    }, [defaultSection])


    // если в бд уже был записан лимит записываем его в limitObj (либо null)
    useEffect(() => {
        if (section_id && limits.length) {
            const limit = limits
                .filter(l => l.section_id === section_id)
                .find(l => personal
                    ? l.personal === 1 && l.user_id === user_id
                    : l.personal === 0
                )
            limit ? setLimitObj(limit) : setLimitObj(null)
        }
    }, [section_id, limits, personal])


    useEffect(() => {
        limitObj ? setLimitValue(limitObj.value.toString()) : setLimitValue(minLimit)
    }, [minLimit, limitObj])


    // обновляем данные в бд либо выволим сообщение о некоректно заданном лимите
    function handler(_) {
        const value = currencyToFixedFormat(limitValue)
        if (!value){
            pushAlertMessage({
                type: 'warning',
                message: `Значение лимита не корректно.`
            })
            return
        }
        if (value < minLimit) {
            setMessage(`Лимит должен быть больше ${minLimit}`)
            pushAlertMessage({
                type: 'warning',
                message: `Лимит должен быть больше ${minLimit}`
            })
            return
        }

        if (user_id) {
            if (limitObj ) {
                controller.write({
                    storeName: constants.store.LIMIT,
                    action: 'edit',
                    user_id,
                    data: {...limitObj, value: value}
                })
            } else {
                controller.write({
                    storeName: constants.store.LIMIT,
                    action: 'add',
                    user_id,
                    data: {
                        section_id,
                        personal: personal ? 1 : 0,
                        value: value,
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
        navigate(-1)
    }

    console.log(limitValue)

    return (
        <>
            <div className='wrapper'>
                <div className='content'>
                    <Container>
                        <PageHeader arrowBack title={'Редактировать лимит'} to={backUrl} />
                        <div className='column gap-1'>
                            <div className='row flex-wrap gap-0.75'>
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
                                        className={'number-hide-arrows'}
                                        value={limitValue}
                                        onChange={e => /^[0-9.,]*$/.test(e.target.value) && setLimitValue(e.target.value)}
                                        type={'text'}
                                        inputMode={'numeric'}
                                        step={0.01}
                                        min={(limitObj && limitObj.value) || 0}
                                        placeholder='Лимит'
                                    />
                                    {!!message && <div className='expenses-message'>{message}</div>}
                                </div>
                                <Checkbox onChange={() => setPersonal(!personal)} checked={personal} left> Личный
                                    лимит</Checkbox>
                            </div>
                        </div>

                    </Container>
                </div>
                <div className='footer-btn-container footer' >
                    <Button onMouseUp={() => handler()}>Добавить</Button>
                </div>
            </div>
        </>
    )
}
