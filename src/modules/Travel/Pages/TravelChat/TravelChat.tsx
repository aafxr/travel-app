import clsx from "clsx";
import {useEffect, useState} from "react";

import defaultHandleError from "../../../../utils/error-handlers/defaultHandleError";
import {useTravel, useUser} from "../../../../contexts/AppContextProvider";
import {useSocket} from "../../../../contexts/SocketContextProvider";
import Container from "../../../../components/Container/Container";
import {MessageService} from "../../../../classes/services";
import {Message} from "../../../../classes/StoreEntities";
import {PageHeader} from "../../../../components/ui";

import './TravelChat.css'


export function TravelChat() {
    const socket = useSocket()
    const user = useUser()
    const travel = useTravel()
    const [messages, setMessages] = useState<Message[]>([])

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
            if (m) setMessages([...messages, m])
        }

        socket.on('message', newMessage)

        return () => {
            socket.off('message', newMessage)
        }
    }, [socket])

    function isLeft(msg: Message) {
        if (!user) return false
        return msg.from !== user.id
    }

    return (
        <div className='wrapper'>
            <Container>
                <PageHeader arrowBack title='Чат'/>
            </Container>
            <Container className='content'>
                <div className='chat'>

                    {
                        messages.map((m) => (
                            <div className={`"msg ${isLeft(m) ? 'left-msg' : 'right-msg'}"`}>
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
        </div>
    )
}