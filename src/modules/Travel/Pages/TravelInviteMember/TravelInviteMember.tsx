import {nanoid} from "nanoid";
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

import {ShareLinkIcon, TelegramIcon, WhatsappIcon} from "../../../../components/svg";
import defaultHandleError from "../../../../utils/error-handlers/defaultHandleError";
import {pushAlertMessage} from "../../../../components/Alerts/Alerts";
import Container from "../../../../components/Container/Container";
import Checkbox from "../../../../components/ui/Checkbox/Checkbox";
import {useUser} from "../../../../contexts/AppContextProvider";
import {Member} from "../../../../classes/StoreEntities/Member";
import Button from "../../../../components/ui/Button/Button";
import Counter from "../../../../components/Counter/Counter";
import Input from "../../../../components/ui/Input/Input";

import './TravelInviteMember.css'


type InviteMemberType = {
    member: Member,
    inviteURL: string
    email: string
}

/**
 * Страница для отправки пользователям приглошения присоедениться к путешествию
 * @function
 * @name TravelInviteMember
 * @returns {JSX.Element}
 * @category Pages
 */
export default function TravelInviteMember() {
    const navigate = useNavigate()

    const user = useUser()!
    const [state, setState] = useState<InviteMemberType>()

    const message = `${user.first_name} ${user.last_name} приглашает присоедениться к поездке`


    useEffect(() => {
        const initState = {
            member: new Member({}),
            inviteURL: process.env.REACT_APP_SERVER_URL + `/invite/${nanoid(24)}/`,
            email: ''
        }
        setState(initState)
    }, [])

    const handleNameChange = (name: string) => {
        if (!state) return
        Member.setFirst_name(state.member, name)
        setState({...state})
    }


    /** обработчик устанавливает флаг isChild */
    const handleChildCheckbox = (isChild: boolean) => {
        if (!state) return
        Member.setAge(state.member, isChild ? 7 : 18)
        setState({...state})
    }

    /**
     * обработчик устанавливает возраст ребенка
     * @param {number} age 1 - 17
     */
    const handleChildAgeChange = (age: number) => {
        if (!state) return
        Member.setAge(state.member, age)
    }

    /** обработчик записи EMail */
    const handleEMailChange = (e: string) => state && setState({...state, email: e})

    /** обработчик для отправки приглошения */
    function handleInviteButtonClick() {
        pushAlertMessage({type: "info", message: 'Отправка приглошения в процессе разработки'})
    }


    /** обработчик копирует */
    function handleCopyInviteLink(e: React.FocusEvent<HTMLInputElement>) {
        navigator.clipboard.writeText(e.target.value)
            .then(() => {
                e.target.classList.add('input-highlight')
                pushAlertMessage({type: 'success', message: "Ссылка скопирована"})
            })
            .catch(defaultHandleError)
    }

    if (!state) return null

    return (
        <div className='wrapper'>
            <Container className='content pt-20 pb-20 column gap-1'>
                <h2 className='invite-title'>Добавить в поедку</h2>
                <Input
                    value={state.member.first_name}
                    onChange={handleNameChange}
                    placeholder='Имя'
                />
                <Checkbox checked={Member.isChild(state.member)} onChange={handleChildCheckbox}>Ребенок</Checkbox>
                {
                    Member.isChild(state.member) && (
                        <div className='invite-child'>
                            <Counter min={1} max={17} init={7} onChange={handleChildAgeChange}/>
                            <span>лет</span>
                        </div>
                    )
                }
                <div className='flex-stretch'>
                    <Input
                        className='br-right-0'
                        value={state.email}
                        onChange={handleEMailChange}
                        placeholder='E-mail'
                    />
                    <button className='invite-button flex-0' onClick={handleInviteButtonClick}>Пригласить</button>
                </div>
                <Input
                    value={state.inviteURL}
                    onChange={() => {
                    }}
                    onFocus={handleCopyInviteLink}
                    placeholder='URL'
                />
                <div>
                    <div className='invite-share-title'>Поделиться ссылкой</div>
                    <div className='flex-nowrap gap-0.25'>
                        <a
                            href={`whatsapp://send?text=${message} ${state.inviteURL}`}
                            className='share-link whatsapp-bg'
                        ><WhatsappIcon/></a>
                        <a
                            href={`https://telegram.me/share/url?url=${state.inviteURL}&text=${message}`}
                            className='share-link telegram-bg'
                        ><TelegramIcon/></a>
                        <div
                            className='share-link share-link-bg'
                            // onClick={handleCopyInviteLink}
                        ><ShareLinkIcon/></div>
                    </div>
                </div>

                <Button className='close-button' onClick={() => navigate(-1)}>Закрыть</Button>
            </Container>
        </div>
    )
}