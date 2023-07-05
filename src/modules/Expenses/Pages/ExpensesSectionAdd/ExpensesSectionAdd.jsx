import React, {useContext,  useState} from 'react'
import {useNavigate, useParams} from "react-router-dom";
import {Input, PageHeader} from "../../../../components/ui";
import Container from "../../components/Container/Container";
import {ExpensesContext} from "../../contextProvider/ExpensesContextProvider";
import Button from "../../components/Button/Button";
import createId from "../../../../utils/createId";
import constants from "../../db/constants";

import '../../css/Expenses.css'


export default function ExpensesActualAdd({
                                              user_id,
                                              primaryEntityType
                                          }) {
    const {travelCode: primary_entity_id} = useParams()
    const {controller} = useContext(ExpensesContext)
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

            controller.write({
                storeName: constants.store.SECTION,
                action: 'add',
                user_id,
                data
            })
                .then((res) => {
                    console.log('Ответ ', res)
                    console.log('section created ', sectionName)
                })
                .catch(console.error)

            navigate('/')
        } else {
            console.warn('need add user_id')
        }
    }


    return (
        <>
            <div className='wrapper'>
                <div className='content'>
                    <PageHeader arrowBack title={'Добавить секцию'}/>
                    <Container>
                        <div className='title'>Записать расходы</div>
                        <Input
                            type={'text'}
                            value={sectionName}
                            onChange={e => setSectionName(e.target.value)}
                            placeholder='Название'
                        />

                    </Container>
                </div>
                <Button className='footer' onClick={handler} disabled={sectionName.length === 0}>Добавить</Button>
            </div>

        </>
    )
}