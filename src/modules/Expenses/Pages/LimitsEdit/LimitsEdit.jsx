import React, {useContext, useEffect, useMemo, useState} from 'react'
import {Link, useLocation, useNavigate, useParams} from "react-router-dom";

import {Chip, Input, PageHeader} from "../../../../components/ui";
import Container from "../../../../components/Container/Container";
import createId from "../../../../utils/createId";
import Button from "../../../../components/ui/Button/Button";


import constants, {reducerConstants} from "../../../../static/constants";

import '../../css/Expenses.css'
import Checkbox from "../../../../components/ui/Checkbox/Checkbox";
import {defaultFilterValue} from "../../static/vars";
import {pushAlertMessage} from "../../../../components/Alerts/Alerts";
import updateExpenses from "../../helpers/updateExpenses";
import currencyToFixedFormat from "../../../../utils/currencyToFixedFormat";
import {formatter} from "../../../../utils/currencyFormat";
import {updateLimits} from "../../helpers/updateLimits";
import {useDispatch, useSelector} from "react-redux";
import storeDB from "../../../../db/storeDB/storeDB";
import createAction from "../../../../utils/createAction";
import {actions} from "../../../../redux/store";

/**
 * страница редактиррования лимитов
 * @param {string} primary_entity_type
 * @returns {JSX.Element}
 * @constructor
 */
export default function LimitsEdit({
                                       primary_entity_type
                                   }) {
    const dispatch = useDispatch()
    const {currency} = useSelector(state => state[constants.redux.EXPENSES])
    const {travelCode: primary_entity_id, sectionId} = useParams()
    const {pathname} = useLocation()

    const isPlan = pathname.includes('plan')

    const {defaultSection, sections, limits} = useSelector(state => state[constants.redux.EXPENSES])
    const {user} = useSelector(state => state[constants.redux.USER])
    const navigate = useNavigate()

    const user_id = user.id

    const backUrl = isPlan
        ? `/travel/${primary_entity_id}/expenses/plan/`
        : `/travel/${primary_entity_id}/expenses/`


    const [expenses, setExpenses] = useState([])

    const [limitObj, setLimitObj] = useState(null)
    const [personal, setPersonal] = useState(() => defaultFilterValue() === 'personal')

    const [section_id, setSectionId] = useState(null)
    const [limitValue, setLimitValue] = useState('')

    const [message, setMessage] = useState('')

    //
    //
    const minLimit = useMemo(() => {
        if (expenses && expenses.length && section_id) {
            const date = new Date().toLocaleDateString()
            const curr = currency[date].reduce((a, c) => {
                a[c.symbol] = c
                return a
            }, {}) || {}

            const result = expenses
                .filter(e => (
                    e.section_id === section_id
                    && (personal
                        ? e.personal === 1 && e.user_id === user_id
                        : e.personal === 0)
                ))
                .reduce((acc, e) => {
                    const coef = curr[e.currency]?.value || 1
                    return e.value * coef + acc
                }, 0)

            return result
        }
        return 0
    }, [expenses, section_id, personal, user_id, currency])


    //получаем все расходы (планы) за текущую поездку
    useEffect(() => {
        updateExpenses(primary_entity_id, 'plan').then(setExpenses)
    }, [])

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
        if (!value) {
            pushAlertMessage({
                type: 'warning',
                message: `Значение лимита не корректно.`
            })
            return
        }
        if (value < minLimit) {
            setMessage(`Лимит должен быть больше ${formatter.format(minLimit)}`)
            pushAlertMessage({
                type: 'warning',
                message: `Лимит должен быть больше ${formatter.format(minLimit)}`
            })
            return
        }

        if (!user_id) {
            pushAlertMessage({type: 'danger', message: 'Необходимо авторизоваться.'})
            return
        }

        if (user_id) {
            if (limitObj) {
                const data = {...limitObj, value: value}
                Promise.all([
                    storeDB.editElement(constants.store.LIMIT, data),
                    storeDB.addElement(
                        constants.store.EXPENSES_ACTIONS,
                        createAction(constants.store.LIMIT, user_id, 'update', data)
                    )
                ]).then(() => dispatch(actions.expensesActions.updateLimit(data)))
            } else {
                const data = {
                    section_id,
                    personal: personal ? 1 : 0,
                    value: value,
                    user_id,
                    primary_entity_id,
                    primary_entity_type,
                    id: createId(user_id)
                }
                Promise.all([
                    storeDB.editElement(constants.store.LIMIT, data),
                    storeDB.addElement(
                        constants.store.EXPENSES_ACTIONS,
                        createAction(constants.store.LIMIT, user_id, 'add', data)
                    )
                ])
                    .then(() => dispatch(actions.expensesActions.addLimit(data)))
                    .catch(console.error)
            }
            updateLimits(primary_entity_id, user_id, currency)()
                .then(items => dispatch({type: reducerConstants.UPDATE_EXPENSES_LIMIT, payload: items}))
        } else {
            console.warn('need add user_id')
        }
        navigate(-1)
    }


    return (
        <>
            <div className='wrapper'>
                <div className='content'>
                    <Container>
                        <PageHeader arrowBack title={'Редактировать лимит'} to={backUrl}/>
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
                                    <div className='limit-input' data-cur='₽'>
                                        <Input
                                            className={'number-hide-arrows '}
                                            value={limitValue}
                                            onChange={e => /^[0-9.,]*$/.test(e.target.value) && setLimitValue(e.target.value)}
                                            type={'text'}
                                            inputMode={'numeric'}
                                            step={0.01}
                                            min={(limitObj && limitObj.value) || 0}
                                            placeholder='Лимит'
                                        />
                                    </div>
                                    {!!message && <div className='expenses-message'>{message}</div>}
                                </div>
                                <Checkbox onChange={() => setPersonal(!personal)} checked={personal} left> Личный
                                    лимит</Checkbox>
                            </div>
                        </div>

                    </Container>
                </div>
                <div className='footer-btn-container footer'>
                    <Button onMouseUp={() => handler()}>Добавить</Button>
                </div>
            </div>
        </>
    )
}
