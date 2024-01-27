import {useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";

import {useTravel, useUser} from "../../../../contexts/AppContextProvider";
import Container from "../../../../components/Container/Container";
import Checkbox from "../../../../components/ui/Checkbox/Checkbox";
import Button from "../../../../components/ui/Button/Button";
import {MovementType} from "../../../../types/MovementType";
import {useMember} from "../../../../hooks/useMember";
import {TrashIcon} from "../../../../components/svg";

import './TravelUserPermission.css'


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

    /** обработчик добавления / удаления способа передвижения участника путешествия */
    function handleMovementType(mt: MovementType) {
        console.log(MovementType[mt])
    }


    function handleEditePermit() {
    }

    function handleShowPermit() {
    }

    function handleClose(){
        navigate(`/travel/${travel.id}/`)
    }


    if (!loading && !member)
        return (
            <div className='wrapper'>
                <Container className='content pt-20 pb-20 column gap-0.5' loading={loading}>
                    <div>Пользователь с id="{userCode}" не найден</div>
                </Container>
                <Button
                    className='close-button'
                    onClick={handleClose}
                >
                    Закрыть
                </Button>
            </div>
        )

    if(user && !travel.isAdmin(user))
        return (
            <div className='wrapper'>
                <Container className='content pt-20 pb-20 column gap-0.5' loading={loading}>
                    <div>У вас не достаточно прав</div>
                </Container>
                <Button
                    className='close-button'
                    onClick={handleClose}
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
                            <li>
                                <Checkbox
                                    checked={false}
                                    onChange={() => handleMovementType(MovementType.CAR)}
                                >
                                    На авто
                                </Checkbox>
                            </li>
                            <li>
                                <Checkbox
                                    checked={false}
                                    onChange={() => handleMovementType(MovementType.FLIGHT)}
                                >
                                    В самолете
                                </Checkbox>
                            </li>
                        </ul>
                    </>
                    <>
                        <div className='member-title title-semi-bold '>Права</div>
                        <ul className='member-access-rules'>
                            <li>
                                <Checkbox checked={travel.permitChange(member)} onChange={handleEditePermit}>
                                    Редактирование
                                </Checkbox>
                            </li>
                            <li>
                                <Checkbox checked={travel.permitChange(member)} onChange={handleShowPermit}>
                                    Просмотр
                                </Checkbox>
                            </li>
                        </ul>
                    </>
                    <button className='member-remove-btn'>Удалить <TrashIcon className='icon'/></button>
                    <Button
                        className='close-button'
                        onClick={handleClose}
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
    return <></>
}