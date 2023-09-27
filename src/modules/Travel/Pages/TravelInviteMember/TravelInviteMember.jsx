import ShareLinkIcon from "../../../../components/svg/ShareLinkIcon";
import Container from "../../../../components/Container/Container";
import WhatsappIcon from "../../../../components/svg/WhatsappIcon";
import Checkbox from "../../../../components/ui/Checkbox/Checkbox";
import TelegramIcon from "../../../../components/svg/TelegramIcon";
import Button from "../../../../components/ui/Button/Button";
import Counter from "../../../../components/Counter/Counter";
import Input from "../../../../components/ui/Input/Input";

import './TravelInviteMember.css'
import {useState} from "react";

export default function TravelInviteMember() {
    const [isChild, setIsChild] = useState(false)


    return (
        <div className='wrapper'>
            <Container className='content pt-20 pb-20 column gap-1'>
                <h2 className='invite-title'>Добавить в поедку</h2>
                <Input
                    placeholder='Имя'
                />
                <Checkbox checked={isChild} onChange={setIsChild}>Ребенок</Checkbox>
                {
                    isChild && (
                        <div className='invite-child'>
                            <Counter min={1} max={17} initialValue={7}/>
                            <span>лет</span>
                        </div>
                    )
                }
                <div className='flex-stretch'>
                    <Input className='br-right-0' placeholder='E-mail'/>
                    <button className='invite-button flex-0'>Пригласить</button>
                </div>
                <Input placeholder='URL'/>
                <div>
                    <div className='invite-share-title'>Поделиться ссылкой</div>
                    <div className='flex-nowrap gap-0.25'>
                        <div className='share-link whatsapp-bg'><WhatsappIcon/></div>
                        <div className='share-link telegram-bg'><TelegramIcon/></div>
                        <div className='share-link share-link-bg'><ShareLinkIcon/></div>
                    </div>
                </div>

                <Button className='close-button'>Закрыть</Button>
            </Container>
        </div>
    )
}