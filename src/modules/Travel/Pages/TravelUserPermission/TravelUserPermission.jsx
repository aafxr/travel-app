import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";

import Container from "../../../../components/Container/Container";
import Checkbox from "../../../../components/ui/Checkbox/Checkbox";
import TrashIcon from "../../../../components/svg/TrashIcon";
import Button from "../../../../components/ui/Button/Button";
import useTravel from "../../hooks/useTravel";

import './TravelUserPermission.css'

/**@type {MovementType[]} */
const defaultMovementTypes = [
    {id: 1, title: 'На авто'},
    {id: 2, title: 'В самолете'}
]
/**@type {PermissionType[]} */
const defaultMemberAccessTypes = [
    {id: 1, title: 'Редактор'},
    {id: 2, title: 'Просмотр'}
]

export default function TravelUserPermission() {
    const navigate = useNavigate()
    const {userCode} = useParams()
    const {travel, errorMessage} = useTravel()
    const [member, setMember] = useState(/**@type{MemberType| null} */null)

    useEffect(() => {
        if (travel) {
            const m = travel.members.find(m => m.id === userCode)
            if (m) setMember(m)
        }
    }, [travel])

    /**
     * обработчик добавления / удаления способа передвижения участника путешествия
     * @param {MovementType} item
     */
    function handleMemberMovementType(item) {
        console.log(item)
    }

    /**
     * обработчик добавления / удаления прав участника путешествия на редактирование путешествия
     * @param {PermissionType} item
     */
    function handleMemberAccessRules(item) {
        console.log(item)
    }


    return (
        <div className='wrapper'>
            <Container className='content pt-20 pb-20 column gap-0.5'>
                {
                    !!member && !!member.movementType && (
                        <>
                            <div className='member-title title-semi-bold'>В поездке</div>
                            <ul className='title-semi-bold'>
                                {
                                    defaultMovementTypes.map(mt => (
                                        <li key={mt.id}>
                                            <Checkbox
                                                checked={member.movementType.find(m => m.id === mt.id)}
                                                onChange={() => handleMemberMovementType(mt)}
                                            >
                                                {mt.title}
                                            </Checkbox>
                                        </li>
                                    ))
                                }
                            </ul>
                        </>
                    )
                }
                {
                    !!member && !!member.permissions && (
                        <>
                            <div className='member-title title-semi-bold '>Права</div>
                            <ul className='member-access-rules'>
                                {
                                    defaultMemberAccessTypes.map(mt => (
                                        <li key={mt.id}>
                                            <Checkbox
                                                checked={member.permissions.find(p => p.id === mt.id)}
                                                onChange={() => handleMemberAccessRules(mt)}
                                            >
                                                {mt.title}
                                            </Checkbox>
                                        </li>
                                    ))
                                }
                            </ul>
                        </>
                    )
                }
                {
                    member
                        ? <button className='member-remove-btn'>Удалить <TrashIcon className='icon'/></button>
                        : <div>Загрузка информации о пользователе</div>
                }
                <Button
                    className='close-button'
                    onClick={() => navigate(-1)}
                >
                    Закрыть
                </Button>

                {/*<RadioButtonGroup*/}
                {/*    title={'В поездке'}*/}
                {/*    checklist={defaultMovementTypes}*/}
                {/*    multy*/}
                {/*    position='right'*/}
                {/*    onChange={handleMemberMovementType}*/}
                {/*/>*/}

                {/*<RadioButtonGroup*/}
                {/*    title={'Права'}*/}
                {/*    checklist={defaultMemberAccessTypes}*/}
                {/*    multy*/}
                {/*    position='right'*/}
                {/*    onChange={handleMemberAccessRules}*/}
                {/*/>*/}

                {/*<IconButton*/}
                {/*    title='Удалить'*/}
                {/*    shadow={false}*/}
                {/*    icon={<TrashIcon/>}*/}
                {/*    border={false}*/}

                {/*/>*/}

            </Container>
        </div>
    )
}