import {useSelector} from "react-redux";
import React, {useEffect, useMemo, useState} from 'react'
import {Link, useLocation, useNavigate, useParams} from "react-router-dom";

import defaultHandleError from "../../../../utils/error-handlers/defaultHandleError";
import currencyToFixedFormat from "../../../../utils/currencyToFixedFormat";
import {pushAlertMessage} from "../../../../components/Alerts/Alerts";
import Checkbox from "../../../../components/ui/Checkbox/Checkbox";
import Container from "../../../../components/Container/Container";
import {Chip, Input, PageHeader} from "../../../../components/ui";
import useTravelContext from "../../../../hooks/useTravelContext";
import useUserSelector from "../../../../hooks/useUserSelector";
import Button from "../../../../components/ui/Button/Button";
import {formatter} from "../../../../utils/currencyFormat";
import updateExpenses from "../../helpers/updateExpenses";
import BaseService from "../../../../classes/BaseService";
import {updateLimits} from "../../helpers/updateLimits";
import {defaultFilterValue} from "../../static/vars";
import constants from "../../../../static/constants";
import storeDB from "../../../../db/storeDB/storeDB";
import createId from "../../../../utils/createId";

import '../../css/Expenses.css'

/**
 * страница редактиррования лимитов
 * @function
 * @name LimitsEdit
 * @param {string} primary_entity_type
 * @returns {JSX.Element}
 * @category Pages
 */
export default function LimitsEdit({
                                       primary_entity_type
                                   }) {
    const {currency} = useSelector(state => state[constants.redux.EXPENSES])
    const {travel} = useTravelContext()
    const {travelCode: primary_entity_id, sectionId} = useParams()
    const {pathname} = useLocation()

    const isPlan = pathname.includes('plan')

    // const {defaultSection, sections, limits} = useSelector(state => state[constants.redux.EXPENSES])
    const user = useUserSelector()
    const navigate = useNavigate()

    const user_id = user.id

    const backUrl = isPlan
        ? `/travel/${primary_entity_id}/expenses/plan/`
        : `/travel/${primary_entity_id}/expenses/`


    const [expenses, setExpenses] = useState(/**@type{ExpenseType[]}*/[])

    const [limitObj, setLimitObj] = useState(null)
    const [personal, setPersonal] = useState(() => defaultFilterValue() === 'personal')

    const [section_id, setSectionId] = useState(null)
    const [limitValue, setLimitValue] = useState('')

    const [message, setMessage] = useState('')

    /**@type{number}*/
    const minLimit = useMemo(() => {
        if (expenses && expenses.length && section_id) {
            const date = new Date().toLocaleDateString()
            const curr = currency[date]?.reduce((a, c) => {
                a[c.symbol] = c
                return a
            }, {}) || {}

            return expenses
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
        }
        return 0
    }, [expenses, section_id, personal, user_id, currency])
    console.log(minLimit)
    console.log(expenses)


    //получаем все расходы (планы) за текущую поездку
    useEffect(() => {
        const exp = travel.expenses('planned', personal ? 'Personal' : 'Common')
        setExpenses(exp)
    }, [travel])

    useEffect(() => {
        sectionId && setSectionId(sectionId || 'misc')
    }, [sectionId])


    // если в бд уже был записан лимит записываем его в limitObj (либо null)
    useEffect(() => {
        if (section_id) {
            storeDB.getAllFromIndex(constants.store.LIMIT, constants.indexes.PRIMARY_ENTITY_ID, travel.id)
                .then(/**@param{LimitType[]} limits*/(limits) => {
                    const limit = limits
                        .filter(l => l.section_id === section_id)
                        .find(l => personal
                            ? l.personal === 1 && l.id.startsWith(user_id)
                            : l.personal === 0
                        )
                    limit ? setLimitObj(limit) : setLimitObj(null)
                })

        }
    }, [section_id, personal])


    useEffect(() => {
        limitObj ? setLimitValue(limitObj.value.toString()) : setLimitValue(minLimit)
    }, [minLimit, limitObj])


    // обновляем данные в бд либо выволим сообщение о некоректно заданном лимите
    function handler(_) {
        const limitService = new BaseService(constants.store.LIMIT)
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
                const limit = {...limitObj, value: value}
                limitService.update(limit, user_id)
                    .catch(defaultHandleError)
            } else {
                const limit = {
                    section_id,
                    personal: personal ? 1 : 0,
                    value: value,
                    user_id,
                    primary_entity_id,
                    primary_entity_type,
                    id: createId(user_id)
                }
                limitService.create(limit, user_id)
                    .catch(defaultHandleError)
            }
            updateLimits(primary_entity_id, user_id)()
                .catch(defaultHandleError)
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
                                    !!travel.defaultSections.length && travel.defaultSections.map(
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
