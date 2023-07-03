import React, {useContext, useEffect, useState} from 'react'
import {useNavigate, useParams} from "react-router-dom";
import {Chip, Input, PageHeader} from "../../../../components/ui";
import {ExpensesContext} from "../../contextProvider/ExpensesContextProvider";
import Container from "../../components/Container/Container";
import createId from "../../../../utils/createId";
import Button from "../../components/Button/Button";
import constants from "../../db/constants";

import '../../css/Expenses.css'


export default function LimitsEdit({
                                       user_id,
                                       primaryEntityType
                                   }) {
    const {travelCode: primary_entity_id} = useParams()
    const {controller} = useContext(ExpensesContext)
    const navigate = useNavigate()

    const [sections, setSections] = useState(null)
    const [section_id, setSectionId] = useState(null)
    const [limitValue, setLimitValue] = useState('')


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

    useEffect(() => {
        if (section_id) {
            controller.read({
                storeName: constants.store.LIMIT,
                index: constants.indexes.SECTION_ID,
                query: section_id
            })
                .then((limit) => {
                    console.log('limit -> ', limit)
                    if (limit) {
                        setLimitValue(limit.value)
                    } else {
                        setLimitValue(0)
                    }
                })
                .catch(console.error)
        }
    }, [section_id])


    function handler() {
        if (user_id) {
            controller.read({
                storeName: constants.store.LIMIT,
                index: constants.indexes.SECTION_ID,
                query: section_id
            })
                .then(limit => {
                    console.log('limit -> ', limit)
                    if (limit) {
                        const data = {...limit, value: +limitValue}
                        controller.write({
                            storeName: constants.store.LIMIT,
                            action: 'edit',
                            user_id,
                            data
                        })
                    } else {
                        const data = {
                            section_id,
                            personal: 1,
                            value: +limitValue,
                            primary_entity_id,
                            id: createId(user_id)
                        }


                        controller.write({
                            storeName: constants.store.LIMIT,
                            action: 'add',
                            user_id,
                            data
                        })
                            .catch(console.error)
                    }
                    console.log('limit создан')
                })

            navigate('/')
        } else {
            console.warn('need add user_id')
        }
    }


    return (
        <>
            <div className='wrapper'>
                <div className='content'>
                    <PageHeader arrowBack title={'Редактировать лимит'}/>
                    <Container className='expenses-pt-20'>
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
                                    ))
                            }
                        </div>
                        <Input
                            className='expenses-mt-20'
                            type={'text'}
                            value={limitValue || ''}
                            onChange={e => /^[0-9]*$/.test(e.target.value) && setLimitValue(e.target.value)}
                            placeholder='Лимит'
                        />

                    </Container>
                </div>
                <Button className='footer' onClick={handler}
                        disabled={(+limitValue) === 0 || !section_id}>Добавить</Button>
            </div>
        </>
    )
}