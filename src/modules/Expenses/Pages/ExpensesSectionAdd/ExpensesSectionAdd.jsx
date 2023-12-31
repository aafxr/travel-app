import React, { useState} from 'react'
import {useNavigate, useParams} from "react-router-dom";
import {Input, PageHeader} from "../../../../components/ui";
import Container from "../../../../components/Container/Container";
import Button from "../../../../components/ui/Button/Button";
import createId from "../../../../utils/createId";

import '../../css/Expenses.css'

/**
 * @function
 * @name ExpensesActualAdd
 * @param {string} user_id
 * @param {string} primary_entity_type
 * @returns {JSX.Element}
 * @category Pages
 */
export default function ExpensesActualAdd({
                                              user_id,
                                              primary_entity_type
                                          }) {
    const {travelCode: primary_entity_id} = useParams()
    const navigate = useNavigate()

    const [sectionName, setSectionName] = useState('')

    function handler() {
        if (user_id) {
            const data = {
                title: sectionName,
                color: '#52CF37',
                hidden: 0,
                primary_entity_id,
                id: createId(user_id)
            }

            navigate('/')
        } else {
            console.warn('need add user_id')
        }
    }


    return (
        <>
            <div className='wrapper'>
                <div className='content'>
                    <Container className='column gap-1'>
                        <PageHeader arrowBack title={'Добавить секцию'}/>
                        <div className='title'>Записать расходы</div>
                        <Input
                            type={'text'}
                            value={sectionName}
                            onChange={e => setSectionName(e.target.value)}
                            placeholder='Название'
                        />

                    </Container>
                </div>
                <div className='footer-btn-container'>
                    <Button className='footer' onClick={handler} disabled={sectionName.length === 0}>Добавить</Button>
                </div>
            </div>

        </>
    )
}