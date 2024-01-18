import {nanoid} from "nanoid";
import {useState} from "react";
import {useNavigate} from "react-router-dom";

import {ShareLinkIcon, TelegramIcon, WhatsappIcon} from "../../../../components/svg";
import {pushAlertMessage} from "../../../../components/Alerts/Alerts";
import Container from "../../../../components/Container/Container";
import Checkbox from "../../../../components/ui/Checkbox/Checkbox";
import Button from "../../../../components/ui/Button/Button";
import Counter from "../../../../components/Counter/Counter";
import Input from "../../../../components/ui/Input/Input";
import constants from "../../../../static/constants";
import createId from "../../../../utils/createId";

import './TravelInviteMember.css'
import useUserSelector from "../../../../hooks/useUserSelector";

/**@type{MemberType} */
const defaultMember = {
    id:createId(),
    access_rights: [],
    movementType:[],
    name: '',
    age: 7,
    email: '',
    inviteURL: '',
    isChild: false
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

    const user = useUserSelector()
    const [member, setMember] = useState(() => ({
        ...defaultMember,
            inviteURL: process.env.REACT_APP_SERVER_URL + `/invite/${nanoid(24)}/`
    }))

    const message = `${user.first_name} ${user.last_name} приглашает присоедениться к поездке`

    /**
     *  обработчик устанавливает флаг isChild
     * @param {boolean} isChild
     */
    const handleChildCheckbox = (isChild) => setMember({
        ...member,
        isChild,
        age: !member.age ? 7 : member.age,
    })
    console.log(member)
    /**
     * обработчик устанавливает возраст ребенка
     * @param {number} age 1 - 17
     */
    const handleChildAgeChange = (age) => setMember({...member, age})

    /**
     * обработчик записи EMail
     * @param e
     */
    const handleEMailChange = (e) => setMember({...member, email: e.target.value})

    /** обработчик для отправки приглошения */
    function handleInviteButtonClick(){
        pushAlertMessage({type: "info", message:'Отправка приглошения в процессе разработки'})
    }

    /**
     * обработчик копирует
     * @param {Event<HTMLInputElement>} e
     */
    function handleCopyInviteLink(e){
        if(
            'navigator' in window
            && 'clipboard' in window.navigator
        ){
            navigator.clipboard.writeText(e.target.value)
            e.target.classList.add('input-highlight')
            pushAlertMessage({type:'success', message:"Ссылка скопирована"})
        }
    }

    return (
        <div className='wrapper'>
            <Container className='content pt-20 pb-20 column gap-1'>
                <h2 className='invite-title'>Добавить в поедку</h2>
                <Input
                    placeholder='Имя'
                />
                <Checkbox checked={!!member.isChild} onChange={handleChildCheckbox}>Ребенок</Checkbox>
                {
                    !!member.isChild && (
                        <div className='invite-child'>
                            <Counter min={1} max={17} initialValue={7} onChange={handleChildAgeChange}/>
                            <span>лет</span>
                        </div>
                    )
                }
                <div className='flex-stretch'>
                    <Input
                        className='br-right-0'
                        value={member.email}
                        onChange={handleEMailChange}
                        placeholder='E-mail'
                    />
                    <button className='invite-button flex-0' onClick={handleInviteButtonClick}>Пригласить</button>
                </div>
                <Input
                    value={member.inviteURL}
                    onChange={() => {}}
                    onFocus={handleCopyInviteLink}
                    placeholder='URL'
                />
                <div>
                    <div className='invite-share-title'>Поделиться ссылкой</div>
                    <div className='flex-nowrap gap-0.25'>
                        <a
                            href={`whatsapp://send?text=${message} ${member.inviteURL}`}
                            className='share-link whatsapp-bg'
                        ><WhatsappIcon/></a>
                        <a
                            href={`https://telegram.me/share/url?url=${member.inviteURL}&text=${message}`}
                            className='share-link telegram-bg'
                        ><TelegramIcon/></a>
                        <div
                            className='share-link share-link-bg'
                            onClick={handleCopyInviteLink}
                        ><ShareLinkIcon/></div>
                    </div>
                </div>

                <Button className='close-button' onClick={() => navigate(-1)}>Закрыть</Button>
            </Container>
        </div>
    )
}