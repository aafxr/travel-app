import clsx from "clsx";
import React, {useEffect, useRef, useState} from "react";

import defaultHandleError from "../../../../utils/error-handlers/defaultHandleError";
import {useTravel, useUser} from "../../../../contexts/AppContextProvider";
import {useSocket} from "../../../../contexts/SocketContextProvider";
import Container from "../../../../components/Container/Container";
import TextArea from "../../../../components/ui/TextArea/TextArea";
import {MessageService} from "../../../../classes/services";
import {Message} from "../../../../classes/StoreEntities";
import {PageHeader} from "../../../../components/ui";
import {SendIcon} from "../../../../components/svg";

import './TravelChat.css'


export function TravelChat() {
    const socket = useSocket()
    const user = useUser()
    const travel = useTravel()
    const [messages, setMessages] = useState<Message[]>([])
    const [text, setText] = useState('')
    const [taFocus, setTaFocus] = useState(false)
    const chatRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!travel) return

        MessageService
            .getMessagesByTravelID(travel.id)
            .then(setMessages)
            .catch(defaultHandleError)
    }, [])

    useEffect(() => {
        if (!socket) return

        function newMessage(msg: string) {
            const m = Message.fromSocket(msg)
            if (m) setMessages(prev => [...prev, m])
        }

        socket.on('message', newMessage)

        return () => {
            socket.off('message', newMessage)
        }
    }, [socket])

    useEffect(() => {
        if(!chatRef.current) return
        chatRef.current.scroll({ top: chatRef.current.scrollHeight, behavior: "smooth" })
    }, [messages])

    function handleSendMessageChange(){
        const t = text.trim()
        if(!t || !user || !travel) return

        const msg = new Message({
            from: user.id,
            primary_entity_id: travel.id,
            date: new Date(),
            text: t
        })
        MessageService
            .sendMessage(msg)
            .then(() => {
                setText('')
                setMessages([...messages, msg])
            })
            .catch(defaultHandleError)

    }

    if(!user) return null

    return (
        <div className='wrapper'>
            <Container>
                <PageHeader arrowBack title='Чат'/>
            </Container>
            <Container ref={chatRef} className='content'>
                <div className='chat'>
                    {
                        messages.map((m) => (
                            <div key={m.id} className={`msg ${Message.isSelf(m, user) ? 'right-msg' : 'left-msg'}`}>
                                <div className="msg-img"></div>

                                <div className="msg-bubble">
                                    <div className="msg-info">
                                        <div className="msg-info-name">{m.from}</div>
                                        <div className="msg-info-time">{m.date.toLocaleTimeString().slice(0, 5)}</div>
                                    </div>

                                    <div className="msg-text">{m.text}
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </Container>
            {/*<Container className='footer'>*/}
                <div className='footer-btn-container footer'>
                    <div className='msg-input'>
                        <TextArea
                            autoResize={false}
                            className={taFocus ? 'active': ''}
                            value={text}
                            onChange={setText}
                            onSubmit={handleSendMessageChange}
                            onFocus={() => setTaFocus(true)}
                            onBlur={() => setTaFocus(false)}
                        />
                        <SendIcon
                            className={clsx('msg-input-icon', {active: !!text})}
                            onClick={handleSendMessageChange}
                        />
                    </div>
                </div>
            {/*</Container>*/}
        </div>
    )
}