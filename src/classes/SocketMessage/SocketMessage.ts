import {nanoid} from "nanoid";
import {Action} from "../StoreEntities";

export type SocketMessageType = {
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
     * текстовое сообщение  пользователю
     * @param from отправитель
     * @param to получатель
     * @param text
     * @param date
     * @param primary_entity_id ид путешествия
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