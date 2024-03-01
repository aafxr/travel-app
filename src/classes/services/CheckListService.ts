import {ChecklistType} from "../../types/ChecklistType";
import {StoreName} from "../../types/StoreName";
import {Travel, User} from "../StoreEntities";
import {Checklist} from "../StoreEntities";
import {DB} from "../db/DB";


/**
 * Сервис для работы с чеклистом
 *
 * Содержит методы:
 * - getCheckList
 * - updateChecklist
 */
export class CheckListService{
    /**
     * метод загружает существующий чеклист из локальной бд или создает новый
     * @param travel
     * @param user
     */
    static async getCheckList(travel: Travel, user:User){
        const id = `${user.id}:${travel.id}`
        const ch = await DB.getOne<ChecklistType>(StoreName.CHECKLIST, id)

        let checklist: Checklist
        if(ch) checklist = new Checklist(ch)
        else{
            checklist = new Checklist({id})
            await DB.update(StoreName.CHECKLIST, checklist.dto())
        }
        return checklist
    }

    /**
     * метод обновляет информацию о чеклисте в бд
     * @param chl
     */
    static async updateChecklist(chl: Checklist){
        await DB.update(StoreName.CHECKLIST, chl.dto())
    }
}