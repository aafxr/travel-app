import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";

import Container from "../../../../components/Container/Container";
import Checkbox from "../../../../components/ui/Checkbox/Checkbox";
import TrashIcon from "../../../../components/svg/TrashIcon";
import Button from "../../../../components/ui/Button/Button";
import useTravel from "../../hooks/useTravel";

import './TravelUserPermission.css'


const defaultMovementTypes = [
    {id: 1, title: 'На авто'},
    {id: 2, title: 'В самолете'}
]
const defaultMemberAccessTypes = [
    {id: 1, title: 'Редактор'},
    {id: 2, title: 'Просмотр'}
]

export default function TravelUserPermission() {
    const {travelCode, userCode} = useParams()
    const travel = useTravel()
    const [member, setMember] = useState(/**@type{MemberType| null} */null)

    useEffect(() => {
        if (travel) {
            const m = travel.members.find(m => m.id === userCode)
            if (m) setMember(m)
        }
    }, [travel])

    function handleMemberMovementType(items) {
        console.log(items)
    }

    function handleMemberAccessRules(items) {
        console.log(items)
    }


    return (
        <div className='wrapper'>
            <Container className='content pt-20 pb-20 column gap-0.5'>
                <div className='member-title title-semi-bold'>В поездке</div>
                <ul className='title-semi-bold'>
                    {
                        defaultMovementTypes.map(mt => (
                            <li key={mt.id}>
                                <Checkbox >{mt.title}</Checkbox>
                            </li>
                        ))
                    }
                </ul>
                <div className='member-title title-semi-bold '>Права</div>
                <ul className='member-access-rules'>
                    {
                        defaultMovementTypes.map(mt => (
                            <li key={mt.id}>
                                <Checkbox >{mt.title}</Checkbox>
                            </li>
                        ))
                    }
                </ul>
                <button className='member-remove-btn' >Удалить <TrashIcon className='icon'/></button>
                <Button className='close-button' >Закрыть</Button>

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