import {StoreName} from "../../types/StoreName";
import {Message} from "../StoreEntities";
import {DB} from "../db/DB";

export class MessageService{

    static async saveNewMessage(msg: Message){
        await DB.update(StoreName.MESSAGE, msg)
    }

    static async getMessagesByTravelID(travelID:string){
        const messages = await DB.getManyFromIndex<Message>(StoreName.MESSAGE, "primary_entity_id", travelID)
        return messages.map(m => new Message(m))
    }
}