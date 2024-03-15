import {openIDBDatabase} from "../db/openIDBDatabaase";
import {ActionName} from "../../types/ActionsType";
import {Action, Message} from "../StoreEntities";
import {StoreName} from "../../types/StoreName";
import {DB} from "../db/DB";


/**
 * сервис для обработки сообщений
 */
export class MessageService{

    /**
     * метод сохраняет сообщение в локальную бд
     * @param msg
     */
    static async saveNewMessage(msg: Message){
        await DB.update(StoreName.MESSAGE, msg)
    }

    /**
     * загрузка сообщений из локальной бд
     * @param travelID
     */
    static async getMessagesByTravelID(travelID:string){
        const messages = await DB.getManyFromIndex<Message>(StoreName.MESSAGE, "primary_entity_id", travelID)
        return messages.map(m => new Message(m))
    }

    /**
     * метод записывает сообщение в бд и создает action
     * @param msg
     */
    static async sendMessage(msg: Message){
        const action = new Action(msg, msg.from, StoreName.MESSAGE, ActionName.ADD)
        await MessageService.writeTransaction(msg, action)
    }

    /**
     * метод удаляет сообщение из локальной бд и создает action
     * @param msg
     */
    static async deleteMessage(msg:Message){
        const action = new Action(msg, msg.from, StoreName.MESSAGE, ActionName.DELETE)
        await MessageService.writeTransaction(msg, action, true)
    }

    /**
     * метод создает транзакцию и записывает сообщение и action в бд
     * @param msg
     * @param action
     * @param isDelete
     */
    static async writeTransaction(msg:Message, action: Action<Partial<Message>>, isDelete = false){
        const db = await openIDBDatabase()
        const tx = db.transaction([StoreName.MESSAGE, StoreName.ACTION], 'readwrite')
        const messageStore = tx.objectStore(StoreName.MESSAGE)
        const actionStore = tx.objectStore(StoreName.ACTION)
        isDelete
            ? messageStore.delete(msg.date)
            : messageStore.put(msg)
        actionStore.add(action)
    }
}