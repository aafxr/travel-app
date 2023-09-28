import {useState} from "react";
import {useNavigate} from "react-router-dom";

import ShareLinkIcon from "../../../../components/svg/ShareLinkIcon";
import Container from "../../../../components/Container/Container";
import WhatsappIcon from "../../../../components/svg/WhatsappIcon";
import Checkbox from "../../../../components/ui/Checkbox/Checkbox";
import TelegramIcon from "../../../../components/svg/TelegramIcon";
import Button from "../../../../components/ui/Button/Button";
import Counter from "../../../../components/Counter/Counter";
import Input from "../../../../components/ui/Input/Input";
import createId from "../../../../utils/createId";

import './TravelInviteMember.css'
import {pushAlertMessage} from "../../../../components/Alerts/Alerts";

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

export default function TravelInviteMember() {
    const navigate = useNavigate()
    const [member, setMember] = useState(defaultMember)

    /**
     *  обработчик устанавливает флаг isChild
     * @param {boolean} isChild
     */
    const handleChildCheckbox = (isChild) => setMember({
        ...member,
        isChild,
        age: !member.age ? 7 : member.age
    })

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
                <Input value={member.inviteURL} onChange={() => {}} placeholder='URL'/>
                <div>
                    <div className='invite-share-title'>Поделиться ссылкой</div>
                    <div className='flex-nowrap gap-0.25'>
                        <div className='share-link whatsapp-bg'><WhatsappIcon/></div>
                        <div className='share-link telegram-bg'><TelegramIcon/></div>
                        <div className='share-link share-link-bg'><ShareLinkIcon/></div>
                    </div>
                </div>

                <Button className='close-button' onClick={() => navigate(-1)}>Закрыть</Button>
            </Container>
        </div>
    )
}