import React, {useEffect, useState} from 'react'
import {Link, useNavigate, useParams} from "react-router-dom";

import {ExpenseService, LimitService, SectionService} from "../../../../classes/services";
import defaultHandleError from "../../../../utils/error-handlers/defaultHandleError";
import {Limit, Section, Travel, User} from "../../../../classes/StoreEntities";
import {useTravel, useUser} from "../../../../contexts/AppContextProvider";
import {pushAlertMessage} from "../../../../components/Alerts/Alerts";
import Checkbox from "../../../../components/ui/Checkbox/Checkbox";
import Container from "../../../../components/Container/Container";
import {Chip, Input, PageHeader} from "../../../../components/ui";
import Button from "../../../../components/ui/Button/Button";
import {formatter} from "../../../../utils/currencyFormat";
import {StoreName} from "../../../../types/StoreName";
import {DB} from "../../../../classes/db/DB";

import '../../css/Expenses.css'

/**
 * страница редактиррования лимитов
 */
export default function LimitsEdit() {
    const {sectionId} = useParams()
    const user = useUser()
    const travel = useTravel()
    const navigate = useNavigate()

    const [limit, setLimit] = useState<Limit>()
    const [personal, setPersonal] = useState(false)
    const [total, setTotal] = useState(0)
    const [change, setChange] = useState(false)

    const [sections, setSections] = useState<Section[]>([])

    //  `/travel/${primary_entity_id}/expenses/plan/`

    const [message, setMessage] = useState('')


    useEffect(() => {
        if (!travel || !user || !sectionId) return
        const isPersonal = User.getSetting(user, "expensesFilter") === "personal"
        setPersonal(isPersonal)

        getLimit(user, travel, sectionId, isPersonal)
            .then(setLimit)
            .then(() => setChange(false))
            .catch(defaultHandleError)
    }, [ sectionId])


    useEffect(() => {
        if (!travel || !user || !sectionId) return
        ExpenseService.getTotal(user, travel, sectionId, personal)
            .then(setTotal)
            .catch(defaultHandleError)
    }, [sectionId, personal])


    useEffect(() => {
        SectionService.getAll()
            .then(setSections)
            .catch(defaultHandleError)
    }, [sectionId])


    // обновляем данные в бд либо выволим сообщение о некоректно заданном лимите
    async function handleSave() {
        if (!limit || !user || !travel) return

        if (limit.value < total) {
            setMessage(`Лимит должен быть больше ${formatter.format(total)}`)
            pushAlertMessage({
                type: 'warning',
                message: `Лимит должен быть больше ${formatter.format(total)}`
            })
            return
        }

        const l = await DB.getOne<Limit>(StoreName.LIMIT, limit.id)

        if(l) {
            LimitService.update(limit, user)
                .then(() => navigate(`/travel/${travel.id}/expenses/plan/`))
                .catch(defaultHandleError)
        } else {
            LimitService.create(limit, user)
                .then(() => navigate(`/travel/${travel.id}/expenses/plan/`))
                .catch(defaultHandleError)
        }
    }


    function handleSectionsChange(section: Section) {
        if (!travel) return

        if (section.id !== sectionId)
            navigate(`/travel/${travel.id}/expenses/limit/${section.id}/`)
    }

    function handleLimitChange(str: string){
        if(!limit || !user) return
        if(/^[0-9.,]*$/.test(str)){
            const value = str.replace(/\s+/g, '').replace('[-,]', '.')
            limit.value = Number.parseFloat(value)
            setLimit(new Limit(limit, user))
            setChange(true)
        }
    }

    if (!travel || !limit) return null


    return (
        <>
            <div className='wrapper'>
                <div className='content'>
                    <Container>
                        <PageHeader arrowBack title={'Редактировать лимит'} to={`/travel/${travel.id}/expenses/plan/`}/>
                        <div className='column gap-1'>
                            <div className='row flex-wrap gap-0.75'>
                                {
                                    sections.map(
                                        (s) => (
                                            <Link key={s.id} to={`/travel/${travel.id}/expenses/limit/${s.id}`}>
                                                <Chip
                                                    rounded
                                                    color={sectionId === s.id ? 'orange' : 'grey'}
                                                    onClick={() => handleSectionsChange(s)}
                                                >
                                                    {s.title}
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
                                            value={'' + limit.value}
                                            onChange={handleLimitChange}
                                            type={'text'}
                                            inputMode={'numeric'}
                                            step={0.01}
                                            min={total}
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
                    <Button onMouseUp={handleSave} disabled={!change}>Добавить</Button>
                </div>
            </div>
        </>
    )
}


async function getLimit(user: User, travel: Travel, sectionId: string, personal: boolean) {
    const limitID = personal
        ? `${user.id}:${sectionId}:${travel.id}`
        : `${sectionId}:${travel.id}`

    let limit = await LimitService.getByID(user, limitID)
    if (limit) return limit

    const value = await ExpenseService.getTotal(user, travel, sectionId, personal)

    limit = new Limit({
        id: limitID,
        personal: personal ? 1 : 0,
        value,
        primary_entity_id: travel.id,
        section_id: sectionId
    }, user)

    // await LimitService.create(limit, user)

    return limit
}
