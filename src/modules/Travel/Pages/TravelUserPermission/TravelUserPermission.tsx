import {useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";

import {useTravel, useUser} from "../../../../contexts/AppContextProvider";
import Container from "../../../../components/Container/Container";
import Checkbox from "../../../../components/ui/Checkbox/Checkbox";
import Button from "../../../../components/ui/Button/Button";
import {useMember} from "../../../../hooks/useMember";
import {TrashIcon} from "../../../../components/svg";

import './TravelUserPermission.css'

/**@type {MovementType[]} */
const defaultMovementTypes = [
    {id: 1, title: 'На авто'},
    {id: 2, title: 'В самолете'}
]


/**
 * @function
 * @name TravelUserPermission
 * @returns {JSX.Element}
 * @category Pages
 */
export default function TravelUserPermission() {
    const navigate = useNavigate()
    const {userCode} = useParams()
    const {member, loading} = useMember(userCode)
    const travel = useTravel()!
    const user = useUser()

    useEffect(() => {
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


    if (!loading && !member)
        return (
            <div className='wrapper'>
                <Container className='content pt-20 pb-20 column gap-0.5' loading={loading}>
                    <div>Пользователь с id="{userCode}" не найден</div>
                </Container>
                <Button
                    className='close-button'
                    onClick={() => navigate(-1)}
                >
                    Закрыть
                </Button>
            </div>
        )


    if (member)
        return (
            <div className='wrapper'>
                <Container className='content pt-20 pb-20 column gap-0.5' loading={loading}>
                    <>
                        <div className='member-title title-semi-bold'>В поездке</div>
                        <ul className='title-semi-bold'>
                            {
                                defaultMovementTypes.map(mt => (
                                    <li key={mt.id}>
                                        <Checkbox
                                            checked={!!member.movementType.find(m => m === mt.id)}
                                            onChange={() => handleMemberMovementType(mt.id)}
                                        >
                                            {mt.title}
                                        </Checkbox>
                                    </li>
                                ))
                            }
                        </ul>
                    </>
                    <>
                        <div className='member-title title-semi-bold '>Права</div>
                        <ul className='member-access-rules'>
                            <li>
                                <Checkbox checked={travel.permitChange(member)}>
                                    Редактирование
                                </Checkbox>
                            </li>
                            <li>
                                <Checkbox checked={travel.permitChange(member)}>
                                    Просмотр
                                </Checkbox>
                            </li>
                        </ul>
                    </>
                    <button className='member-remove-btn'>Удалить <TrashIcon className='icon'/></button>
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