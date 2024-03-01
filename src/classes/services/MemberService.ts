import {fetchUsers} from "../../api/fetch/fetchUsers";
import {fetchUser} from "../../api/fetch/fetchUser";
import {MemberType} from "../../types/MemberType";
import {StoreName} from "../../types/StoreName";
import {Photo} from "../StoreEntities/Photo";
import {PhotoService} from "./PhotoService";
import {Member} from "../StoreEntities";
import {DB} from "../db/DB";


/**
 * сервис позваляет получать информацию о пользователях
 *
 * ---
 * доступны следующие методы:
 * - getById
 * - getManyByIds
 */
export class MemberService {

    /**
     * метод формирует запрос к api для получения информации о пользователе
     * или загружфет информацию из локальной бд
     * @param id ид пользователя
     */
    static async getById(id: string) {
        let member = await fetchUser(id)
        if (member) await DB.update(StoreName.USERS, member)
        else member = await DB.getOne<MemberType>(StoreName.USERS, id)

        if (member) {
            const memberinstance = new Member(member)
            if (memberinstance.photo) {
                const photo = await PhotoService.getById(memberinstance.photo)
                if (photo) memberinstance.setPhoto(new Photo(photo))
            }
            return memberinstance
        }
    }

    /**
     * метод формирует запрос к api для получения информации о пользователях
     * или загружфет информацию из локальной бд
     * @param ids список ид пользователей
     */
    static async getManyByIds(ids: string[]) {
        let members_types
            members_types = await fetchUsers(ids)
        if (members_types.length) await DB.writeAllToStore(StoreName.USERS, members_types)
        else members_types = await DB.getManyByIds<MemberType>(StoreName.USERS, ids)
        const members = members_types.map(m => new Member(m))
        return await PhotoService.initPhoto(members)
    }
}