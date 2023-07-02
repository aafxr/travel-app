import React, {useContext, useEffect, useState} from 'react'
import {useNavigate, useParams} from "react-router-dom";
import {Input, PageHeader, Chip} from "../../../../components/ui";
import Container from "../../components/Container/Container";
import {ExpensesContext} from "../../contextProvider/ExpensesContextProvider";
import Button from "../../components/Button/Button";

import createId from "../../../../utils/createId";
import constants from "../../db/constants";

export default function ExpensesAdd({
                                        user_id,
                                        primaryEntityType,
                                        expensesType = 'actual' // 'actual' | 'plan'
                                    }) {
    const {travelCode: primary_entity_id} = useParams()
    const {controller} = useContext(ExpensesContext)
    const navigate = useNavigate()

    const [expName, setExpName] = useState('')
    const [expSum, setExpSum] = useState(0)

    const [sections, setSections] = useState(null)
    const [section_id, setSectionId] = useState(null)
    const [personal, setPersonal] = useState(false)

    const isPlan = expensesType === 'plan'


    useEffect(() => {
        controller.read({
            storeName: constants.store.SECTION,
            action: 'get',
            query: 'all'
        })
            .then(s => {
                s && setSections(s)
                console.log(s)
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

            navigate('/')
        } else {
            console.warn('need add user_id & primaryEntityType')
        }
    }

    return (
        <>
            <div className='wrapper'>
                <div className='content'>
                    <PageHeader arrowBack title={isPlan ? 'Добавить плановые расходы' : 'Добавить текущие расходы'}/>
                    <Container>
                        <div className='title'>Записать расходы</div>
                        <Input
                            type={'text'}
                            value={expName}
                            onChange={e => setExpName(e.target.value)}
                            placeholder='Название'
                        />
                        <Input
                            type={'number'}
                            value={expSum}
                            onChange={e => setExpSum(e.target.value)}
                            placeholder='Сумма'
                        />
                        <div className='flex-wrap-gap'>
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
                        <label>
                            <input type="checkbox" checked={personal} onChange={e => setPersonal(e.target.checked)}/>
                            Личные
                        </label>
                    </Container>
                </div>

                <Button className='footer' onClick={handler}
                        disabled={!section_id || !expName || !expSum}>Добавить</Button>
            </div>
        </>
    )
}
