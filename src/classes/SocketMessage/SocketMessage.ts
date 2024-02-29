import {nanoid} from "nanoid";
import {Action} from "../StoreEntities";

export type SocketMessageType = {
    id: string,
    join: string
} | {
    id: string,
    leave: string
} | {
    id: string,
    message: {
        from: string,
        to: string,
        text: string,
        date: Date,
        primary_entity_id: string
    }
} | {
    id: string,
    action: Action<any>
} | {
    receive: string
}





/**
 * класс создает сообщения для отправки через сокет
 */
export class SocketMessage {
    static getMessageID() {
        return nanoid(7)
    }


    /**
     * метод для отправки сообщения на подключение к шруппе
     * @param group
     */
    static join(group: string) {
        const msg: SocketMessageType = {
            id: SocketMessage.getMessageID(),
            join: group
        }
        return msg
    }


    /**
     * метод для отключения от группы
     * @param group
     */
    static leave(group: string) {
        const msg: SocketMessageType = {
            id: SocketMessage.getMessageID(),
            leave: group
        }
        return msg
    }


    /**
     * текстовое сообщение  пользователю
     * @param from
     * @param to
     * @param text
     * @param date
     * @param primary_entity_id
     */
    static message(from: string, to: string, text: string, primary_entity_id: string, date?: Date) {
        if (!date) date = new Date()

        const msg: SocketMessageType = {
            id: SocketMessage.getMessageID(),
            message: {from, to, text, date, primary_entity_id}
        }
        return msg
    }


    /**
     * сообщение о событии
     * @param action
     */
    static actionMessage(action: Action<any>) {
        return {
            id: SocketMessage.getMessageID(),
            action
        }
    }
}