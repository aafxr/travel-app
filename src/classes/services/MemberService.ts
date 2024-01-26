import {fetchUsers} from "../../api/fetch/fetchUsers";
import {fetchUser} from "../../api/fetch/fetchUser";
import {MemberType} from "../../types/MemberType";
import {StoreName} from "../../types/StoreName";
import {Member} from "../StoreEntities/Member";
import {DB} from "../db/DB";


export class MemberService {
    static async getById(id: string) {
        let member = await fetchUser(id)
        if (member) await DB.update(StoreName.USERS, member)
        else member = await DB.getOne<MemberType>(StoreName.USERS, id)

        if (member) return new Member(member)
    }

    static async getManyByIds(ids: string[]) {
        let members = await fetchUsers(ids)
        if (members) await DB.writeAllToStore(StoreName.USERS, members)
        else members = await DB.getManyByIds<MemberType>(StoreName.USERS, ids)
        return members.map(m => new Member(m))

    }
}