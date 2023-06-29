import React, {useContext, useEffect, useState} from 'react'
import {useNavigate, useParams} from "react-router-dom";
import {Chip, Input, PageHeader} from "../../../../components/ui";
import {ExpensesContext} from "../../components/ExpensesContextProvider";
import Container from "../../components/Container/Container";
import createId from "../../../../utils/createId";
import Button from "../../components/Button/Button";

export default function LimitsEdit({
                                         user_id,
                                         primaryEntityType
                                     }) {
    const {travelCode: primary_entity_id} = useParams()
    const {controller} = useContext(ExpensesContext)
    const navigate = useNavigate()

    const [sections, setSections] = useState(null)
    const [section_id, setSectionId] = useState(null)
    const [limitValue, setLimitValue] = useState(0)



    useEffect(() => {
        controller.sectionModel.get('all')
            .then(s => {
                s && setSections(s)
                console.log(s)
            })
            .catch(console.error)
    }, [controller])

    useEffect(() =>{
        controller.limitModel.getFromIndex('section_id', section_id)
            .then((limit)=>{
                console.log('limit -> ', limit)
                if (limit){
                    setLimitValue(limit.value)
                }else {
                    setLimitValue(0)
                }
            })
            .catch(console.error)
    }, [section_id])



    function handler() {
        if (user_id) {
            controller.limitModel.getFromIndex('section_id', section_id)
                .then(limit => {
                    console.log('limit -> ', limit)
                    if (limit){
                        controller.limitModel.edit({...limit, value: +limitValue})
                    } else{
                        controller.limitModel.add({
                            section_id,
                            personal: 1,
                            value: +limitValue,
                            primary_entity_id,
                            id: createId(user_id)
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
            <PageHeader arrowBack title={'Редактировать лимит'}/>
            <Container>
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
                <Input
                    type={'text'}
                    value={limitValue}
                    onChange={e => setLimitValue(e.target.value)}
                    placeholder='Название'
                />

            </Container>
            <Button onClick={handler} disabled={(+limitValue) === 0 || !section_id}>Добавить</Button>
        </>
    )
}