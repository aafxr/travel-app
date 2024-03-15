import {nanoid} from "nanoid";
import {User} from "./User";

export class Message{
    id: string
    date: Date
    from: string
    text: string
    primary_entity_id: string

    constructor(msg: Partial<Message>) {
        this.id = msg.id ? msg.id : nanoid(16)
        this.date = msg.date ? new Date(msg.date) : new Date(0)
        this.from = msg.from ? msg.from : 'anonym'
        this.text = msg.text ? msg.text : ''
        this.primary_entity_id = msg.primary_entity_id ? msg.primary_entity_id : 'unknown'
    }

    static fromSocket(msg: string){
        try {
            let message = JSON.parse(msg)
            if('message' in message){
                message = message.message
                return new Message(message)
            }
        }catch(e){
            return
        }
    }

    static isSelf(msg:Message, user?: User | undefined | null){
        return msg.from === user?.id
    }
}